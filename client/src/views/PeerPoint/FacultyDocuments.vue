<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import { useNotification } from '@/composables/useNotification';

const router = useRouter();
const { addNotification } = useNotification();

// Track which faculty sections are expanded
const expanded = reactive<Record<string, boolean>>({
  computing: true,
  business: false,
  engineering: false,
  humanities: false,
});

const toggleFaculty = (key: string) => {
  expanded[key] = !expanded[key];
};

interface Document {
  id: string;
  title: string;
  type: string;
  pages: number;
  size: string;
  description: string;
}

interface Faculty {
  key: string;
  name: string;
  subtitle: string;
  accent: string;
  icon: string;
  documents: Document[];
}

const faculties: Faculty[] = [
  {
    key: 'computing',
    name: 'Faculty of Computing',
    subtitle: 'IEEE formats, research guides, programming textbooks & past papers',
    accent: '#FF6F00',
    icon: '💻',
    documents: [
      {
        id: 'foc-1',
        title: 'IEEE Conference Paper Template',
        type: 'Template / PDF',
        pages: 4,
        size: '240 KB',
        description: 'Official IEEE two-column conference paper format with style annotations and citation guidance.',
      },
      {
        id: 'foc-2',
        title: 'Introduction to Algorithms — CLRS 4th Edition',
        type: 'Textbook Reference',
        pages: 120,
        size: '18 MB',
        description: 'Selected chapters covering sorting, graph algorithms, and dynamic programming from Cormen et al.',
      },
      {
        id: 'foc-3',
        title: 'Cloud Computing: Concepts & Architecture',
        type: 'Research Handbook',
        pages: 65,
        size: '5.2 MB',
        description: 'Covers IaaS/PaaS/SaaS models, containerisation (Docker/K8s), and cloud security fundamentals.',
      },
      {
        id: 'foc-4',
        title: 'Machine Learning Primer — Andrew Ng Notes',
        type: 'Study Notes',
        pages: 48,
        size: '3.8 MB',
        description: 'Handwritten-style condensed notes on supervised learning, neural networks, and model evaluation.',
      },
      {
        id: 'foc-5',
        title: 'Software Engineering — Ian Sommerville (10th Ed.)',
        type: 'Textbook Reference',
        pages: 180,
        size: '22 MB',
        description: 'Chapters on agile development, software architecture, testing strategies, and project management.',
      },
      {
        id: 'foc-6',
        title: 'Database Systems: Design & Implementation',
        type: 'Lab Manual',
        pages: 55,
        size: '4.1 MB',
        description: 'ER modelling, normalisation exercises, SQL labs, and NoSQL integration guide for SLIIT modules.',
      },
    ],
  },
  {
    key: 'business',
    name: 'Faculty of Business',
    subtitle: 'APA formats, case study templates, management & finance guides',
    accent: '#0A1F44',
    icon: '📊',
    documents: [
      {
        id: 'fob-1',
        title: 'APA 7th Edition Style Guide',
        type: 'Style Reference',
        pages: 30,
        size: '2.1 MB',
        description: 'Complete guide to APA referencing, in-text citations, reference lists, and formatted examples.',
      },
      {
        id: 'fob-2',
        title: 'Principles of Management — Robbins & Coulter',
        type: 'Textbook Reference',
        pages: 140,
        size: '15 MB',
        description: 'Selected chapters on planning, organising, leading, and controlling for BBA/MBA coursework.',
      },
      {
        id: 'fob-3',
        title: 'Financial Accounting Fundamentals',
        type: 'Study Notes',
        pages: 72,
        size: '5.5 MB',
        description: 'Balance sheets, income statements, cash flow analysis, and ratio interpretation worksheets.',
      },
      {
        id: 'fob-4',
        title: 'Marketing Research Methods Manual',
        type: 'Lab Manual',
        pages: 58,
        size: '4.0 MB',
        description: 'Quantitative & qualitative research design, survey construction, SPSS analysis, and reporting templates.',
      },
      {
        id: 'fob-5',
        title: 'Business Analytics Handbook',
        type: 'Research Handbook',
        pages: 80,
        size: '6.3 MB',
        description: 'Data visualisation with Tableau, predictive models, dashboarding, and business decision frameworks.',
      },
      {
        id: 'fob-6',
        title: 'Case Study Writing & Analysis Template',
        type: 'Template / DOCX',
        pages: 12,
        size: '380 KB',
        description: 'SLIIT-approved case study report structure with section prompts and evaluation rubric.',
      },
    ],
  },
  {
    key: 'engineering',
    name: 'Faculty of Engineering',
    subtitle: 'Lab manuals, CAD guidelines, reference charts & past papers',
    accent: '#FF6F00',
    icon: '⚙️',
    documents: [
      {
        id: 'foe-1',
        title: 'Engineering Mathematics — Kreyszig Vol.1',
        type: 'Textbook Reference',
        pages: 160,
        size: '20 MB',
        description: 'ODE, linear algebra, vector calculus, and complex numbers — key chapters annotated for SLIIT exams.',
      },
      {
        id: 'foe-2',
        title: 'Circuit Analysis & Electronics Lab Manual',
        type: 'Lab Manual',
        pages: 85,
        size: '7.2 MB',
        description: 'Complete lab sheets for DC/AC circuit experiments, op-amp tasks, and oscilloscope usage.',
      },
      {
        id: 'foe-3',
        title: 'Thermodynamics Engineering Reference',
        type: 'Research Handbook',
        pages: 96,
        size: '8.5 MB',
        description: 'Laws of thermodynamics, heat transfer modes, steam tables, and Rankine/Brayton cycle analysis.',
      },
      {
        id: 'foe-4',
        title: 'CAD/SolidWorks Submission Guide',
        type: 'Submission Template',
        pages: 20,
        size: '1.4 MB',
        description: 'Drawing standards, title block requirements, tolerancing, and electronic submission checklist.',
      },
      {
        id: 'foe-5',
        title: 'Signal & Systems Processing Manual',
        type: 'Study Notes',
        pages: 75,
        size: '5.8 MB',
        description: 'Fourier transforms, Laplace analysis, Z-transforms, and filter design with MATLAB examples.',
      },
      {
        id: 'foe-6',
        title: 'Structural Analysis Past Papers (2019–2023)',
        type: 'Past Papers',
        pages: 50,
        size: '3.6 MB',
        description: 'Five years of structural mechanics past exam papers with model answers and mark schemes.',
      },
    ],
  },
  {
    key: 'humanities',
    name: 'Faculty of Humanities & Sciences',
    subtitle: 'Research methods, academic writing, science lab manuals & statistics',
    accent: '#7C3AED',
    icon: '🔬',
    documents: [
      {
        id: 'fohs-1',
        title: 'Research Methods in Social Sciences',
        type: 'Research Handbook',
        pages: 90,
        size: '6.8 MB',
        description: 'Mixed-methods design, interview techniques, ethical clearance, and thematic data analysis.',
      },
      {
        id: 'fohs-2',
        title: 'Academic Writing & English Composition',
        type: 'Study Guide',
        pages: 55,
        size: '4.2 MB',
        description: 'Essay structures, paragraph coherence, academic vocabulary, paraphrasing, and avoiding plagiarism.',
      },
      {
        id: 'fohs-3',
        title: 'Introduction to Philosophy — Key Readings',
        type: 'Selected Readings',
        pages: 68,
        size: '5.1 MB',
        description: 'Curated readings on ethics, epistemology, logic, and critical thinking with annotation prompts.',
      },
      {
        id: 'fohs-4',
        title: 'Biology Lab Manual — Cellular & Molecular',
        type: 'Lab Manual',
        pages: 100,
        size: '9.0 MB',
        description: 'Microscopy labs, PCR techniques, DNA extraction protocols, and safety data sheets.',
      },
      {
        id: 'fohs-5',
        title: 'Statistics for Scientists — Applied Methods',
        type: 'Textbook Reference',
        pages: 130,
        size: '12 MB',
        description: 'Descriptive statistics, hypothesis testing, ANOVA, regression, and R programming exercises.',
      },
      {
        id: 'fohs-6',
        title: 'Environmental Science & Sustainability Report',
        type: 'Research Paper',
        pages: 45,
        size: '3.3 MB',
        description: 'Climate systems, biodiversity, sustainable development goals, and Sri Lanka case studies.',
      },
    ],
  },
];

const cart = ref<string[]>([]);

const addToCart = (doc: Document, faculty: Faculty) => {
  cart.value.push(doc.id);
  addNotification(`"${doc.title}" added to cart! Redirecting to print customization...`, 'success');
  setTimeout(() => {
    router.push({
      path: '/peerpoint/printing',
      query: {
        docName: encodeURIComponent(doc.title),
        docFaculty: encodeURIComponent(faculty.name),
        docType: encodeURIComponent(doc.type),
        docPages: doc.pages,
      },
    });
  }, 800);
};

const getTypeColor = (type: string) => {
  if (type.includes('Template')) return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
  if (type.includes('Textbook')) return 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300';
  if (type.includes('Lab')) return 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300';
  if (type.includes('Notes') || type.includes('Guide')) return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300';
  if (type.includes('Past')) return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
  return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300';
};
</script>

<template>
  <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <PageBreadcrumb pageTitle="Faculty Documents" />

    <!-- Header Banner -->
    <div
      class="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0A1F44] via-[#0d2554] to-[#1a3a70] p-8 shadow-xl"
    >
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Faculty Document Library</h1>
          <p class="mt-1 text-sm text-gray-300">
            Browse faculty-approved textbooks, research papers, templates, and study materials.
            Add any document to cart to proceed directly to print customization.
          </p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6F00]/20 text-2xl">
            📚
          </div>
          <div>
            <p class="text-xs text-gray-400">Total Documents</p>
            <p class="text-xl font-bold text-white">
              {{ faculties.reduce((acc, f) => acc + f.documents.length, 0) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Faculty Sections -->
    <div class="space-y-4">
      <div
        v-for="faculty in faculties"
        :key="faculty.key"
        class="overflow-hidden rounded-2xl border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark transition-all duration-300"
        :style="`border-top: 4px solid ${faculty.accent};`"
      >
        <!-- Faculty Accordion Header -->
        <button
          class="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-gray-50 dark:hover:bg-white/[0.03]"
          @click="toggleFaculty(faculty.key)"
        >
          <div class="flex items-center gap-4">
            <span class="text-3xl">{{ faculty.icon }}</span>
            <div>
              <h2 class="text-lg font-bold text-gray-900 dark:text-white">{{ faculty.name }}</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ faculty.subtitle }}</p>
            </div>
          </div>
          <div class="flex items-center gap-3 shrink-0">
            <span
              class="rounded-full px-3 py-1 text-xs font-bold text-white"
              :style="`background-color: ${faculty.accent};`"
            >
              {{ faculty.documents.length }} docs
            </span>
            <svg
              class="h-5 w-5 text-gray-400 transition-transform duration-300"
              :class="expanded[faculty.key] ? 'rotate-180' : ''"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        <!-- Document Grid (Collapsible) -->
        <transition
          name="accordion"
          @enter="(el: any) => { el.style.maxHeight = el.scrollHeight + 'px'; }"
          @leave="(el: any) => { el.style.maxHeight = '0'; }"
        >
          <div v-show="expanded[faculty.key]" class="overflow-hidden">
            <div class="border-t border-stroke dark:border-strokedark px-6 pb-6 pt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div
                v-for="doc in faculty.documents"
                :key="doc.id"
                class="group flex flex-col justify-between rounded-xl border border-gray-100 bg-gray-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-gray-700 dark:bg-white/[0.03]"
                :style="`hover:border-color: ${faculty.accent};`"
              >
                <!-- Doc Header -->
                <div>
                  <div class="mb-3 flex items-start justify-between gap-2">
                    <span
                      class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                      :class="getTypeColor(doc.type)"
                    >
                      {{ doc.type }}
                    </span>
                    <span class="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{{ doc.size }}</span>
                  </div>
                  <h3 class="mb-2 text-sm font-semibold leading-snug text-gray-800 dark:text-white">
                    {{ doc.title }}
                  </h3>
                  <p class="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                    {{ doc.description }}
                  </p>
                </div>

                <!-- Doc Footer -->
                <div class="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
                  <span class="flex items-center gap-1 text-xs text-gray-400">
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z" />
                    </svg>
                    {{ doc.pages }} pages
                  </span>

                  <button
                    @click="addToCart(doc, faculty)"
                    class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95"
                    :style="`background-color: ${faculty.accent};`"
                  >
                    <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5"
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>

    <!-- Bottom CTA -->
    <div class="mt-8 rounded-xl border border-dashed border-brand-300 bg-brand-50 p-6 text-center dark:border-brand-500/30 dark:bg-brand-500/5">
      <p class="text-sm font-medium text-brand-600 dark:text-brand-400">
        📄 Can't find your document? Use
        <router-link to="/peerpoint/printing" class="underline hover:text-brand-700">Document Printing</router-link>
        to upload any file directly.
      </p>
    </div>
  </div>
</template>

<style scoped>
.accordion-enter-active,
.accordion-leave-active {
  transition: max-height 0.35s ease, opacity 0.3s ease;
  max-height: 2000px;
  opacity: 1;
}
.accordion-enter-from,
.accordion-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
