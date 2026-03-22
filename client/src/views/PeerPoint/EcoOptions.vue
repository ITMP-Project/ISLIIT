<script setup lang="ts">
import { ref } from 'vue';

const doubleSided = ref(false);
const recycledPaper = ref(false);
const draftMode = ref(false);

const clearOptions = () => {
  doubleSided.value = false;
  recycledPaper.value = false;
  draftMode.value = false;
};

const hasEcoSelection = () => doubleSided.value || recycledPaper.value || draftMode.value;

defineExpose({ clearOptions, hasEcoSelection, doubleSided, recycledPaper, draftMode });
</script>

<template>
  <div class="space-y-5">

    <!-- Double-sided -->
    <label for="eco-double" class="flex cursor-pointer select-none items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-400">
      <div class="relative">
        <input type="checkbox" id="eco-double" v-model="doubleSided" class="sr-only" />
        <div
          class="flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] transition hover:border-brand-500 dark:hover:border-brand-500"
          :class="doubleSided ? 'border-brand-500 bg-brand-500' : 'border-gray-300 bg-transparent dark:border-gray-700'"
        >
          <span :class="doubleSided ? '' : 'opacity-0'">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="1.94437" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </div>
      </div>
      Double-sided Printing <span class="ml-1 text-xs text-gray-400">(Recommended)</span>
    </label>

    <!-- Recycled Paper -->
    <label for="eco-recycled" class="flex cursor-pointer select-none items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-400">
      <div class="relative">
        <input type="checkbox" id="eco-recycled" v-model="recycledPaper" class="sr-only" />
        <div
          class="flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] transition hover:border-brand-500 dark:hover:border-brand-500"
          :class="recycledPaper ? 'border-brand-500 bg-brand-500' : 'border-gray-300 bg-transparent dark:border-gray-700'"
        >
          <span :class="recycledPaper ? '' : 'opacity-0'">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="1.94437" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </div>
      </div>
      Recycled Paper <span class="ml-1 text-xs text-success-600 dark:text-success-400">(+10 Eco Points)</span>
    </label>

    <!-- Draft Mode -->
    <label for="eco-draft" class="flex cursor-pointer select-none items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-400">
      <div class="relative">
        <input type="checkbox" id="eco-draft" v-model="draftMode" class="sr-only" />
        <div
          class="flex h-5 w-5 items-center justify-center rounded-md border-[1.25px] transition hover:border-brand-500 dark:hover:border-brand-500"
          :class="draftMode ? 'border-brand-500 bg-brand-500' : 'border-gray-300 bg-transparent dark:border-gray-700'"
        >
          <span :class="draftMode ? '' : 'opacity-0'">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.6666 3.5L5.24992 9.91667L2.33325 7" stroke="white" stroke-width="1.94437" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </span>
        </div>
      </div>
      Draft Mode <span class="ml-1 text-xs text-gray-400">(Save Ink)</span>
    </label>

  </div>
</template>
