<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import { useNotification } from '@/composables/useNotification';

const router = useRouter();
const { addNotification } = useNotification();

interface KitItem {
  label: string;
}

interface Kit {
  id: string;
  packKey: string;
  name: string;
  faculty: string;
  emoji: string;
  tagline: string;
  price: number;
  accent: string;
  badgeColor: string;
  items: KitItem[];
}

const kits: Kit[] = [
  {
    id: 'it-kit',
    packKey: 'it',
    name: 'IT / Computing Kit',
    faculty: 'Faculty of Computing',
    emoji: '💻',
    tagline: 'Everything you need for your IT project submissions.',
    price: 1800,
    accent: '#FF6F00',
    badgeColor: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
    items: [
      { label: '32GB USB Drive' },
      { label: 'Wireframe & UML Sketch Pad' },
      { label: 'Project Binding Credits (×2)' },
      { label: 'Multi-Liner Technical Pens (×4)' },
      { label: 'IEEE Reference Quick Card' },
      { label: 'Anti-Glare Screen Wipe Set' },
    ],
  },
  {
    id: 'business-kit',
    packKey: 'business',
    name: 'Business Presentation Kit',
    faculty: 'Faculty of Business',
    emoji: '📊',
    tagline: 'Professional tools for presentations and reports.',
    price: 1200,
    accent: '#0A1F44',
    badgeColor: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
    items: [
      { label: 'Leatherette Presentation Folder' },
      { label: 'SLIIT-Branded Notepad (A4)' },
      { label: 'APA 7th Ed. Reference Card' },
      { label: 'Highlighter Set (×5 colours)' },
      { label: 'Business Card Holder' },
      { label: 'Mini Stapler + Staples' },
    ],
  },
  {
    id: 'engineering-kit',
    packKey: 'eng',
    name: 'Engineering Tools Kit',
    faculty: 'Faculty of Engineering',
    emoji: '⚙️',
    tagline: 'Precision tools for lab reports and technical drawings.',
    price: 2500,
    accent: '#FF6F00',
    badgeColor: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
    items: [
      { label: 'Adjustable Protractor' },
      { label: 'Set Squares (30°/60° & 45°)' },
      { label: 'Scientific Calculator Protective Cover' },
      { label: 'Graph Paper Pad (A3, 50 sheets)' },
      { label: 'Technical Drawing Template Stencil' },
      { label: 'Engineering Scale Ruler (1:5 to 1:500)' },
    ],
  },
  {
    id: 'humanities-kit',
    packKey: 'humanities',
    name: 'Humanities & Sciences Kit',
    faculty: 'Faculty of Humanities & Sciences',
    emoji: '🔬',
    tagline: 'Research and lab essentials for science students.',
    price: 1500,
    accent: '#7C3AED',
    badgeColor: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    items: [
      { label: 'Hardcover Lab Notebook (A4, 200pp)' },
      { label: 'Data Analysis Graph Journal' },
      { label: 'Citation & Referencing Guide Card' },
      { label: 'Colour-Coded Sticky Note Set' },
      { label: 'Dissection Diagram Reference Sheets' },
      { label: 'Fine-Tip Permanent Marker Set (×6)' },
    ],
  },
  {
    id: 'essentials-kit',
    packKey: 'essentials',
    name: 'Exam Essentials Pack',
    faculty: 'All Faculties',
    emoji: '📝',
    tagline: 'The must-have pack for every exam season.',
    price: 200,
    accent: '#059669',
    badgeColor: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
    items: [
      { label: 'Ball-Point Pen Set (×4, blue/black)' },
      { label: 'Correction Tape (×2)' },
      { label: 'Ruled Index Cards (50 pack)' },
      { label: '30cm Transparent Exam Ruler' },
      { label: 'HB Pencil + Eraser Set' },
    ],
  },
];

const addingId = ref<string | null>(null);

const addToOrder = (kit: Kit) => {
  if (addingId.value) return; // debounce
  addingId.value = kit.id;

  addNotification(
    `"${kit.name}" added! Redirecting to payment…`,
    'success',
  );

  const token = `K-${Math.floor(Math.random() * 9000) + 1000}`;

  setTimeout(() => {
    router.push({
      path: '/peerpoint/payment',
      query: {
        token,
        kitName:     encodeURIComponent(kit.name),
        kitFaculty:  encodeURIComponent(kit.faculty),
        packKey:     kit.packKey,
        packCost:    kit.price,
        printCost:   0,
        ecoDiscount: 0,
        total:       kit.price,
        pages:       0,
        copies:      0,
        ecoSelected: '0',
      },
    });
    addingId.value = null;
  }, 700);
};
</script>

<template>
  <div class="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
    <PageBreadcrumb pageTitle="Faculty Stationery Kits" />

    <!-- ── Header Banner ──────────────────────────────────────────────── -->
    <div class="mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-[#0A1F44] via-[#0d2554] to-[#1a3a70] p-8 shadow-xl">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 class="text-2xl font-bold text-white">Faculty Stationery Kits</h1>
          <p class="mt-1 text-sm text-gray-300">
            Curated stationery packs for each faculty. Click <strong class="text-[#FF6F00]">Add to Order</strong>
            to proceed directly to the payment checkout — no extra steps.
          </p>
        </div>
        <div class="flex items-center gap-3 shrink-0">
          <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6F00]/20 text-2xl">🛍️</div>
          <div>
            <p class="text-xs text-gray-400">Available Kits</p>
            <p class="text-xl font-bold text-white">{{ kits.length }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Kit Cards Grid ─────────────────────────────────────────────── -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <div
        v-for="kit in kits"
        :key="kit.id"
        class="group flex flex-col overflow-hidden rounded-2xl border border-stroke bg-white shadow-default transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-strokedark dark:bg-boxdark"
        :style="`border-top: 4px solid ${kit.accent};`"
      >
        <!-- Card Header -->
        <div class="px-6 pt-6 pb-4">
          <div class="mb-4 flex items-center justify-between">
            <div
              class="flex h-14 w-14 items-center justify-center rounded-xl text-3xl shadow-inner"
              :style="`background-color: ${kit.accent}18;`"
            >
              {{ kit.emoji }}
            </div>
            <span
              class="rounded-full px-3 py-1 text-xs font-bold"
              :class="kit.badgeColor"
            >
              {{ kit.faculty === 'All Faculties' ? 'Universal' : kit.faculty.replace('Faculty of ', '') }}
            </span>
          </div>

          <h3 class="text-lg font-bold text-gray-800 dark:text-white group-hover:text-inherit transition-colors">
            {{ kit.name }}
          </h3>
          <p class="mt-1 text-xs text-gray-500 dark:text-gray-400">{{ kit.tagline }}</p>
        </div>

        <!-- Items Checklist -->
        <div class="flex-1 border-t border-stroke px-6 py-4 dark:border-strokedark">
          <p class="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            Kit includes
          </p>
          <ul class="space-y-2">
            <li
              v-for="item in kit.items"
              :key="item.label"
              class="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300"
            >
              <span
                class="flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-white text-[10px] font-black"
                :style="`background-color: ${kit.accent};`"
              >
                ✓
              </span>
              {{ item.label }}
            </li>
          </ul>
        </div>

        <!-- Price + CTA Footer -->
        <div class="border-t border-stroke px-6 py-5 dark:border-strokedark">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs text-gray-400">Kit Price</p>
              <p
                class="text-2xl font-black"
                :style="`color: ${kit.accent};`"
              >
                Rs.&nbsp;{{ kit.price.toLocaleString() }}
              </p>
            </div>

            <button
              @click="addToOrder(kit)"
              :disabled="addingId === kit.id"
              class="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              :style="`background-color: ${kit.accent};`"
            >
              <span
                v-if="addingId === kit.id"
                class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
              ></span>
              <svg
                v-else
                class="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2.5"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              {{ addingId === kit.id ? 'Adding…' : 'Add to Order' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Bottom note ────────────────────────────────────────────────── -->
    <div class="mt-8 rounded-xl border border-dashed border-brand-300 bg-brand-50 p-5 text-center dark:border-brand-500/30 dark:bg-brand-500/5">
      <p class="text-sm font-medium text-brand-600 dark:text-brand-400">
        🖨️ Need to print documents too?
        <router-link to="/peerpoint/printing" class="underline hover:text-brand-700">
          Start a Document Printing order
        </router-link>
        and add a stationery kit during checkout.
      </p>
    </div>
  </div>
</template>
