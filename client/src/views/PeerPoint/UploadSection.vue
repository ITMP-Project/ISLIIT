<script setup lang="ts">
import { ref } from 'vue';
import { useNotification } from '@/composables/useNotification';
import * as pdfjsLib from 'pdfjs-dist';
import PdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';

// Point PDF.js at the bundled worker (Vite resolves ?url to the asset URL)
pdfjsLib.GlobalWorkerOptions.workerSrc = PdfjsWorker;


// ─── Types ────────────────────────────────────────────────────────────────────
interface DocumentFile {
  file: File;
  pages: number;
  scanning: boolean;   // true while page-count is in progress for this file
  error: string;       // per-file error message
}

// ─── State ────────────────────────────────────────────────────────────────────
const files        = ref<DocumentFile[]>([]);
const aiSuggestions = ref<string[]>([]);
const isUploading  = ref(false);
const alertMessage = ref('');   // banner-level rule violation message
const alertType    = ref<'error' | 'warning'>('error');

const { addNotification } = useNotification();

// ─── Real page counting ───────────────────────────────────────────────────────

/** Count pages in a PDF using PDF.js (exact). */
async function countPdfPages(file: File): Promise<number> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  return pdf.numPages;
}

/**
 * Estimate pages in a DOCX by counting paragraph tags inside word/document.xml.
 * A true paginator-level count is impossible without rendering; this gives a
 * reasonable approximation: every ~32 paragraphs ≈ 1 A4 page.
 */
async function countDocxPages(file: File): Promise<number> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);

    // A DOCX is a ZIP. Locate the "word/document.xml" entry by reading the
    // local file header signatures (PK\x03\x04) and file-name fields.
    const decoder = new TextDecoder('utf-8', { fatal: false });
    let xmlContent = '';
    let i = 0;

    while (i < bytes.length - 4) {
      // Local file header signature = 0x504B0304
      if (
        bytes[i]     === 0x50 && bytes[i + 1] === 0x4B &&
        bytes[i + 2] === 0x03 && bytes[i + 3] === 0x04
      ) {
        const comprMethod  = bytes[i + 8]  | (bytes[i + 9]  << 8);
        const compressedSz = bytes[i + 18] | (bytes[i + 19] << 8) |
                             (bytes[i + 20] << 16) | (bytes[i + 21] << 24);
        const fileNameLen  = bytes[i + 26] | (bytes[i + 27] << 8);
        const extraLen     = bytes[i + 28] | (bytes[i + 29] << 8);
        const headerEnd    = i + 30 + fileNameLen + extraLen;
        const fileName     = decoder.decode(bytes.slice(i + 30, i + 30 + fileNameLen));

        if (fileName === 'word/document.xml' && comprMethod === 0) {
          // Stored (uncompressed) — read directly
          xmlContent = decoder.decode(bytes.slice(headerEnd, headerEnd + compressedSz));
          break;
        }
        i = headerEnd + Math.max(0, compressedSz);
      } else {
        i++;
      }
    }

    if (!xmlContent) {
      // Fallback: try reading the whole file as text and searching for paragraph tags
      xmlContent = decoder.decode(bytes);
    }

    // Count </w:p> closing tags (one per paragraph)
    const paragraphCount = (xmlContent.match(/<\/w:p>/g) || []).length;
    // Count explicit section breaks as page boundaries
    const sectionCount   = (xmlContent.match(/<w:sectPr[\s>]/g) || []).length;

    const estimatedPages = Math.max(
      sectionCount,                    // each section break is at least 1 page
      Math.ceil(paragraphCount / 32),  // ~32 paragraphs per A4 page
      1,
    );

    return Math.min(estimatedPages, 500); // hard cap to avoid nonsense
  } catch {
    return 1; // if ZIP parsing fails, assume 1 page
  }
}

/** Dispatch to the right counter by file extension. */
async function getPageCount(file: File): Promise<number> {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf'))  return countPdfPages(file);
  if (name.endsWith('.docx')) return countDocxPages(file);
  return 1;
}

// ─── Upload handler ───────────────────────────────────────────────────────────
const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;

  const selectedFiles = Array.from(target.files);
  target.value = '';          // reset input so same file can be re-selected
  alertMessage.value = '';
  aiSuggestions.value = [];
  isUploading.value = true;

  // Validate formats first
  const validFiles = selectedFiles.filter(f => {
    const name = f.name.toLowerCase();
    const ok   = name.endsWith('.pdf') || name.endsWith('.docx');
    if (!ok) addNotification(`Unsupported format: ${f.name} (PDF/DOCX only)`, 'error');
    return ok;
  });

  if (validFiles.length === 0) {
    isUploading.value = false;
    return;
  }

  // Build preliminary entries with scanning=true so the UI shows spinners
  files.value = validFiles.map(f => ({ file: f, pages: 0, scanning: true, error: '' }));

  // Count pages concurrently for all files
  const counted: DocumentFile[] = await Promise.all(
    validFiles.map(async (f, idx) => {
      try {
        const pages = await getPageCount(f);
        return { file: f, pages, scanning: false, error: '' };
      } catch (err) {
        files.value[idx].scanning = false;
        return { file: f, pages: 1, scanning: false, error: 'Could not read page count.' };
      }
    }),
  );

  isUploading.value = false;

  // ── Enforce page-limit rules ─────────────────────────────────────────────
  // Rule 1: Any doc > 50 pages → only 1 doc allowed
  const oversized = counted.find(d => d.pages > 50);
  if (oversized) {
    const msg = 'Document exceeds 50 pages. Only one document can be printed.';
    alertMessage.value = msg;
    alertType.value    = 'error';
    addNotification(msg, 'error');
    files.value = [{ ...oversized, scanning: false }];
    showAiSuggestions();
    return;
  }

  // Rule 2: More than 5 docs → truncate to 5 and warn
  if (counted.length > 5) {
    const msg = 'Maximum 5 documents allowed with 5 pages each.';
    alertMessage.value = msg;
    alertType.value    = 'error';
    addNotification(msg, 'error');
    files.value = counted.slice(0, 5).map(d => ({ ...d, scanning: false }));
    showAiSuggestions();
    return;
  }

  // Rule 3: Multi-doc upload where any doc > 5 pages → warn (still allow, show badge)
  if (counted.length > 1 && counted.some(d => d.pages > 5)) {
    const msg = 'Maximum 5 documents allowed with 5 pages each.';
    alertMessage.value = msg;
    alertType.value    = 'warning';
    addNotification(msg, 'warning');
  }

  files.value = counted.map(d => ({ ...d, scanning: false }));
  showAiSuggestions();
};

const showAiSuggestions = () => {
  aiSuggestions.value = [
    'Include a SLIIT standard cover page.',
    'Adjust margins to 1-inch for better binding.',
    'Consider double-sided printing to save pages.',
  ];
};

const applySuggestions = () => {
  addNotification('AI Suggestions Applied Successfully!', 'success');
  aiSuggestions.value = [];
};

// ─── Validation (called by DocumentPrinting before proceeding) ────────────────
const validateUpload = () => {
  if (files.value.length === 0) {
    addNotification('Please upload a document to continue.', 'error');
    return false;
  }
  if (files.value.some(d => d.scanning)) {
    addNotification('Please wait — documents are still being scanned.', 'error');
    return false;
  }

  const oversized = files.value.find(d => d.pages > 50);
  if (oversized && files.value.length > 1) {
    const msg = 'Document exceeds 50 pages. Only one document can be printed.';
    addNotification(msg, 'error');
    return false;
  }

  if (files.value.length > 5) {
    addNotification('Maximum 5 documents allowed with 5 pages each.', 'error');
    return false;
  }

  if (files.value.length > 1 && files.value.some(d => d.pages > 5)) {
    addNotification('Maximum 5 documents allowed with 5 pages each.', 'error');
    return false;
  }

  return true;
};

const getTotalPages = () =>
  files.value.reduce((sum, doc) => sum + doc.pages, 0);

const pageBadgeClass = (pages: number) => {
  if (pages > 50) return 'bg-error-50   text-error-600   dark:bg-error-500/15   dark:text-error-400';
  if (pages >  5) return 'bg-warning-50 text-warning-600 dark:bg-warning-500/15 dark:text-warning-400';
  return              'bg-success-50  text-success-600 dark:bg-success-500/15 dark:text-success-400';
};

defineExpose({ validateUpload, getTotalPages, files });
</script>

<template>
  <div class="space-y-5">

    <!-- File Upload Input -->
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Upload Document (PDF or DOCX)
      </label>
      <input
        type="file"
        multiple
        @change="handleFileUpload"
        accept=".pdf,.docx"
        :disabled="isUploading"
        class="focus:border-ring-brand-300 h-11 w-full overflow-hidden rounded-lg border border-gray-300 bg-transparent text-sm text-gray-500 shadow-theme-xs transition-colors file:mr-5 file:border-collapse file:cursor-pointer file:rounded-l-lg file:border-0 file:border-r file:border-solid file:border-gray-200 file:bg-gray-50 file:py-3 file:pl-3.5 file:pr-3 file:text-sm file:text-gray-700 placeholder:text-gray-400 hover:file:bg-gray-100 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400 dark:file:border-gray-800 dark:file:bg-white/[0.03] dark:file:text-gray-400 disabled:opacity-60 disabled:cursor-not-allowed"
      />
      <p class="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
        Max 5 documents · each ≤ 5 pages for multi-upload · max 50 pages per single document
      </p>
    </div>

    <!-- Global scanning spinner (shown while any file is scanning) -->
    <div
      v-if="isUploading || files.some(f => f.scanning)"
      class="flex items-center gap-2 text-sm text-brand-500 dark:text-brand-400"
    >
      <span class="h-4 w-4 animate-spin rounded-full border-2 border-solid border-brand-500 border-t-transparent dark:border-brand-400"></span>
      Scanning document pages — please wait…
    </div>

    <!-- Rule-violation Alert Banner -->
    <transition name="fade-slide">
      <div
        v-if="alertMessage"
        class="flex items-start gap-3 rounded-lg border px-4 py-3"
        :class="alertType === 'error'
          ? 'border-error-200 bg-error-50 dark:border-error-500/30 dark:bg-error-500/10'
          : 'border-warning-200 bg-warning-50 dark:border-warning-500/30 dark:bg-warning-500/10'"
      >
        <svg
          class="mt-0.5 h-4 w-4 shrink-0"
          :class="alertType === 'error' ? 'text-error-500' : 'text-warning-500'"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p
          class="text-sm font-medium"
          :class="alertType === 'error' ? 'text-error-700 dark:text-error-400' : 'text-warning-700 dark:text-warning-400'"
        >
          {{ alertMessage }}
        </p>
        <button
          @click="alertMessage = ''"
          class="ml-auto shrink-0 rounded p-0.5 opacity-60 hover:opacity-100"
          :class="alertType === 'error' ? 'text-error-600' : 'text-warning-600'"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </transition>

    <!-- Scanned Documents List -->
    <div v-if="files.length > 0">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Uploaded Documents ({{ files.length }})
        </p>
        <!-- Total pages summary -->
        <span
          v-if="!files.some(f => f.scanning)"
          class="text-xs font-bold text-brand-500"
        >
          {{ getTotalPages() }} total page{{ getTotalPages() === 1 ? '' : 's' }}
        </span>
      </div>

      <ul class="flex flex-col gap-2">
        <li
          v-for="(doc, index) in files"
          :key="index"
          class="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2.5 dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <!-- File name -->
          <div class="flex min-w-0 flex-1 items-center gap-2">
            <!-- PDF / DOCX icon -->
            <span class="shrink-0 text-base">
              {{ doc.file.name.toLowerCase().endsWith('.pdf') ? '📄' : '📝' }}
            </span>
            <span class="max-w-[180px] truncate text-sm font-medium text-gray-700 dark:text-gray-300 sm:max-w-[240px]">
              {{ doc.file.name }}
            </span>
          </div>

          <!-- Scanning spinner or page badge -->
          <div class="ml-3 shrink-0">
            <span
              v-if="doc.scanning"
              class="inline-flex items-center gap-1 rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 dark:bg-gray-800 dark:text-gray-400"
            >
              <span class="h-3 w-3 animate-spin rounded-full border border-gray-400 border-t-transparent"></span>
              Scanning…
            </span>
            <span
              v-else
              class="rounded-md px-2 py-0.5 text-xs font-bold"
              :class="pageBadgeClass(doc.pages)"
            >
              {{ doc.pages }} page{{ doc.pages === 1 ? '' : 's' }}
            </span>
          </div>
        </li>
      </ul>

      <!-- Page-limit reference legend -->
      <div
        v-if="files.length > 0 && !files.some(f => f.scanning)"
        class="mt-3 flex flex-wrap gap-3 text-xs text-gray-400"
      >
        <span class="flex items-center gap-1">
          <span class="inline-block h-2 w-2 rounded-full bg-success-500"></span> ≤ 5 pages
        </span>
        <span class="flex items-center gap-1">
          <span class="inline-block h-2 w-2 rounded-full bg-warning-500"></span> 6–50 pages
        </span>
        <span class="flex items-center gap-1">
          <span class="inline-block h-2 w-2 rounded-full bg-error-500"></span> &gt; 50 pages
        </span>
      </div>
    </div>

    <!-- AI Suggestions -->
    <transition name="fade-slide">
      <div
        v-if="aiSuggestions.length > 0 && !isUploading && !files.some(f => f.scanning)"
        class="rounded-lg border-l-4 border-brand-500 bg-brand-50 p-4 dark:bg-brand-500/10"
      >
        <h4 class="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white/90">
          <svg class="h-4 w-4 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          AI Formatting Suggestions
        </h4>
        <ul class="mb-4 list-disc pl-5 space-y-1">
          <li
            v-for="(suggestion, i) in aiSuggestions"
            :key="i"
            class="text-sm text-gray-600 dark:text-gray-400"
          >
            {{ suggestion }}
          </li>
        </ul>
        <button
          @click="applySuggestions"
          class="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-brand-300 bg-brand-500 py-2.5 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 dark:border-brand-400"
        >
          Apply Suggestions
        </button>
      </div>
    </transition>

  </div>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
