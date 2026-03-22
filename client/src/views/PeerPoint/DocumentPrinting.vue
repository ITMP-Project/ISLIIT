<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import ComponentCard from '@/components/common/ComponentCard.vue';
import OrderCustomization from './OrderCustomization.vue';
import EcoOptions from './EcoOptions.vue';
import UploadSection from './UploadSection.vue';
import { useNotification } from '@/composables/useNotification';

const { addNotification } = useNotification();
const router = useRouter();
const route = useRoute();

// ─── Faculty Library pre-selection ───────────────────────────────────────────
const fromFacultyDoc = ref<{
  name: string;
  faculty: string;
  type: string;
  pages: number;
} | null>(null);

// True when arriving via "Add to Cart" from Faculty Documents
const isFacultyMode = computed(() => !!fromFacultyDoc.value);

onMounted(() => {
  const docName   = route.query.docName   as string | undefined;
  const docFaculty = route.query.docFaculty as string | undefined;
  const docType   = route.query.docType   as string | undefined;
  const docPages  = route.query.docPages  as string | undefined;

  if (docName) {
    fromFacultyDoc.value = {
      name:    decodeURIComponent(docName),
      faculty: docFaculty ? decodeURIComponent(docFaculty) : '',
      type:    docType    ? decodeURIComponent(docType)    : 'Document',
      pages:   docPages   ? parseInt(docPages)              : 1,
    };
    // Skip the Upload step — faculty docs don't need a file upload
    activeStep.value = 2;
    addNotification(`"${decodeURIComponent(docName)}" loaded. Configure your print options below.`, 'success');
  }
});

// ─── Pack cost lookup ─────────────────────────────────────────────────────────
const PACK_COSTS: Record<string, number> = {
  '': 0,
  essentials: 200,
  eng: 1500,
  folder: 150,
};

// ─── Progressive Step State ───────────────────────────────────────────────────
// Step 1 = Upload (skipped for faculty docs), 2 = Eco, 3 = Print Customization
const activeStep  = ref(1);
const isNavigating = ref(false);

const uploadRef = ref<any>(null);
const ecoRef    = ref<any>(null);
const orderRef  = ref<any>(null);

// Only used for manual (non-faculty) uploads
const completeUpload = () => {
  if (uploadRef.value && !uploadRef.value.validateUpload()) return;
  activeStep.value = 2;
  addNotification('Document uploaded successfully. Please configure Eco Options.', 'success');
};

const completeEcoOptions = (skipped: boolean = false) => {
  if (skipped && ecoRef.value) {
    ecoRef.value.clearOptions();
    addNotification('Eco options skipped.', 'info');
  } else {
    addNotification('Eco preferences saved.', 'success');
  }
  activeStep.value = 3;
};

const finalizeOrder = async () => {
  if (orderRef.value && !orderRef.value.validateOrder()) return;
  isNavigating.value = true;
  addNotification('Order prepared! Proceeding to secure payment...', 'info');

  // For faculty docs, use the known page count; for uploads, get it from UploadSection
  const totalPages = isFacultyMode.value
    ? (fromFacultyDoc.value?.pages ?? 1)
    : (uploadRef.value ? uploadRef.value.getTotalPages() : 0);

  const copies    = orderRef.value ? parseInt(orderRef.value.copies) : 1;
  const packKey   = orderRef.value?.pack ?? '';
  const packCost  = PACK_COSTS[packKey] ?? 0;
  const ecoSelected = ecoRef.value ? ecoRef.value.hasEcoSelection() : false;

  const printCostBase = totalPages * copies * 5;
  const ecoDiscount   = ecoSelected ? parseFloat((printCostBase * 0.03).toFixed(2)) : 0;
  const printCost     = parseFloat((printCostBase - ecoDiscount).toFixed(2));
  const total         = parseFloat((printCost + packCost).toFixed(2));

  // Resolve document name
  const documentName = isFacultyMode.value
    ? fromFacultyDoc.value!.name
    : (uploadRef.value?.files?.[0]?.file?.name ?? 'Document');

  let orderToken = `F-${Math.floor(Math.random() * 900) + 100}`;
  try {
    const ecoFlags = ecoRef.value
      ? { doubleSided: ecoRef.value.doubleSided, recycledPaper: ecoRef.value.recycledPaper, draftMode: ecoRef.value.draftMode }
      : { doubleSided: false, recycledPaper: false, draftMode: false };

    const res = await fetch('http://localhost:4000/api/peerpoint/order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        documentName,
        copies,
        pack: packKey,
        totalPages,
        ecoSelected,
        totalAmount: total,
        ...ecoFlags,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      orderToken = data.token;
    }
  } catch {
    addNotification('Could not reach server. Proceeding with fallback token.', 'error');
  }

  router.push({
    path: '/peerpoint/payment',
    query: {
      token: orderToken,
      pages: totalPages,
      copies,
      packKey,
      packCost,
      printCost,
      ecoDiscount,
      total,
      ecoSelected: ecoSelected ? '1' : '0',
    },
  });
};
</script>

<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Document Printing" />

    <!-- ── Faculty Document Selected Banner ─────────────────────────────── -->
    <transition name="fade-down">
      <div
        v-if="isFacultyMode"
        class="mb-6 flex flex-wrap items-center gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 shadow-sm dark:border-emerald-500/30 dark:from-emerald-900/20 dark:to-teal-900/20"
      >
        <!-- Icon -->
        <div class="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-2xl shadow-inner dark:bg-emerald-500/20">
          📚
        </div>

        <!-- Info -->
        <div class="flex-1 min-w-0">
          <p class="text-xs font-semibold uppercase tracking-widest text-emerald-500 dark:text-emerald-400">
            Faculty Library · Upload skipped
          </p>
          <p class="mt-0.5 truncate text-base font-bold text-gray-800 dark:text-white">
            {{ fromFacultyDoc!.name }}
          </p>
          <p class="mt-0.5 flex flex-wrap gap-2 text-xs text-emerald-600 dark:text-emerald-300">
            <span v-if="fromFacultyDoc!.faculty">{{ fromFacultyDoc!.faculty }}</span>
            <span v-if="fromFacultyDoc!.type" class="opacity-60">·</span>
            <span v-if="fromFacultyDoc!.type">{{ fromFacultyDoc!.type }}</span>
            <span class="opacity-60">·</span>
            <span>{{ fromFacultyDoc!.pages }} pages</span>
          </p>
        </div>

        <!-- Badge -->
        <span class="inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow">
          <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
          </svg>
          Ready to print
        </span>
      </div>
    </transition>

    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
      <!-- ══ Left Column ══════════════════════════════════════════════════ -->
      <div class="space-y-6">

        <!-- Step 1 — Upload & AI Assistance -->
        <div class="space-y-3">
          <!-- Step header bar -->
          <div
            class="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]"
            :class="{ 'opacity-50 pointer-events-none': activeStep < 1 }"
          >
            <h4 class="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white/90">
              <span
                class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                :class="activeStep > 1 ? 'bg-success-50 text-success-600 dark:bg-success-500/15' : 'bg-brand-50 text-brand-500 dark:bg-brand-500/15'"
              >
                <svg v-if="activeStep > 1" class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>1</span>
              </span>
              Upload Document
            </h4>
            <button
              v-if="activeStep === 1"
              @click="completeUpload"
              class="inline-flex items-center gap-1.5 rounded-lg border border-brand-300 bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 dark:border-brand-400 dark:bg-brand-500"
            >
              Continue &rarr;
            </button>
            <span v-else-if="activeStep > 1" class="flex items-center gap-1 text-sm font-semibold text-success-600 dark:text-success-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              {{ isFacultyMode ? 'Skipped (Faculty Doc)' : 'Completed' }}
            </span>
          </div>

          <!-- Upload Card — hidden in faculty mode since upload is not needed -->
          <ComponentCard
            v-if="!isFacultyMode"
            title="Upload & AI Assistance"
            :class="activeStep < 1 ? 'opacity-50 pointer-events-none' : ''"
          >
            <UploadSection ref="uploadRef" />
          </ComponentCard>

          <!-- Faculty mode placeholder card -->
          <div
            v-else
            class="rounded-xl border border-dashed border-emerald-300 bg-emerald-50 p-6 text-center dark:border-emerald-500/30 dark:bg-emerald-500/5"
          >
            <p class="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              ✅ Document sourced from the Faculty Library — no upload required.
            </p>
            <p class="mt-1 text-xs text-emerald-500 dark:text-emerald-500">
              Configure your eco options and print preferences below.
            </p>
          </div>
        </div>

      </div>

      <!-- ══ Right Column ═════════════════════════════════════════════════ -->
      <div class="space-y-6">

        <!-- Step 2 — Eco-Friendly Options -->
        <div class="space-y-3 transition-all duration-500" :class="activeStep < 2 ? 'opacity-40 pointer-events-none' : ''">
          <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 class="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white/90">
              <span
                class="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold"
                :class="activeStep > 2 ? 'bg-success-50 text-success-600 dark:bg-success-500/15' : 'bg-brand-50 text-brand-500 dark:bg-brand-500/15'"
              >
                <svg v-if="activeStep > 2" class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span v-else>2</span>
              </span>
              Eco-Friendly Configuration
            </h4>
            <div v-if="activeStep === 2" class="flex gap-2">
              <button
                @click="completeEcoOptions(true)"
                class="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 shadow-theme-xs transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300"
              >
                Skip
              </button>
              <button
                @click="completeEcoOptions()"
                class="inline-flex items-center gap-1.5 rounded-lg border border-brand-300 bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600"
              >
                Continue &rarr;
              </button>
            </div>
            <span v-else-if="activeStep > 2" class="flex items-center gap-1 text-sm font-semibold text-success-600 dark:text-success-400">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
              Completed
            </span>
          </div>
          <ComponentCard title="Eco-Friendly Options">
            <EcoOptions ref="ecoRef" />
          </ComponentCard>
        </div>

        <!-- Step 3 — Print Customization -->
        <div class="space-y-3 transition-all duration-500" :class="activeStep < 3 ? 'opacity-40 pointer-events-none' : ''">
          <div class="flex items-center justify-between rounded-xl border border-gray-200 bg-white px-5 py-3 shadow-theme-xs dark:border-gray-800 dark:bg-white/[0.03]">
            <h4 class="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-white/90">
              <span class="bg-brand-50 text-brand-500 dark:bg-brand-500/15 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold">3</span>
              Print Customization
            </h4>
            <button
              v-if="activeStep === 3"
              @click="finalizeOrder"
              :disabled="isNavigating"
              class="inline-flex items-center gap-1.5 rounded-lg border border-brand-300 bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-theme-xs transition hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span v-if="isNavigating" class="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></span>
              {{ isNavigating ? 'Preparing...' : 'Confirm & Pay →' }}
            </button>
          </div>
          <ComponentCard title="Order Customization">
            <OrderCustomization ref="orderRef" />
          </ComponentCard>
        </div>

      </div>
    </div>

  </AdminLayout>
</template>

<style scoped>
.fade-down-enter-active,
.fade-down-leave-active {
  transition: opacity 0.35s ease, transform 0.35s ease;
}
.fade-down-enter-from,
.fade-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
