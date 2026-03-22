<script setup lang="ts">
import { ref } from 'vue';
import { useNotification } from '@/composables/useNotification';

const copies = ref(1);
const bindingType = ref('staple');
const faculty = ref('');
const pack = ref('');

const { addNotification } = useNotification();

const validateOrder = () => {
  if (!copies.value || copies.value === 0) {
    addNotification('Number of copies cannot be empty or 0.', 'error');
    return false;
  }
  if (copies.value > 10) {
    addNotification('Copy limit exceeded. Maximum allowed is 10.', 'error');
    return false;
  }
  return true;
};

defineExpose({ validateOrder, copies, pack, bindingType });
</script>

<template>
  <div class="space-y-5">

    <!-- Number of Copies -->
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Number of Copies
      </label>
      <input
        type="number"
        v-model="copies"
        min="1"
        max="10"
        class="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 py-2.5 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-brand-800"
      />
    </div>

    <!-- Binding Type -->
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Binding Type
      </label>
      <div class="relative z-20 bg-transparent">
        <select
          v-model="bindingType"
          class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
        >
          <option value="none">None</option>
          <option value="staple">Corner Staple</option>
          <option value="spiral">Spiral Binding</option>
          <option value="hardcover">Hardcover</option>
        </select>
        <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
          <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
    </div>

    <!-- Faculty Templates -->
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Faculty Templates
      </label>
      <div class="relative z-20 bg-transparent">
        <select
          v-model="faculty"
          class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          :class="{ 'text-gray-800 dark:text-white/90': faculty }"
        >
          <option value="">Select Faculty…</option>
          <option value="fob">Business (APA Format)</option>
          <option value="foc">Computing (IEEE Format)</option>
          <option value="foe">Engineering</option>
          <option value="fohs">Faculty of Humanities &amp; Sciences</option>
        </select>
        <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
          <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
    </div>

    <!-- Add Stationery Pack -->
    <div>
      <label class="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400">
        Add Stationery Pack
      </label>
      <div class="relative z-20 bg-transparent">
        <select
          v-model="pack"
          class="dark:bg-dark-900 h-11 w-full appearance-none rounded-lg border border-gray-300 bg-transparent bg-none px-4 py-2.5 pr-11 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-brand-300 focus:outline-hidden focus:ring-3 focus:ring-brand-500/10 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90 dark:focus:border-brand-800"
          :class="{ 'text-gray-800 dark:text-white/90': pack }"
        >
          <option value="">None</option>
          <option value="essentials">Exam Essentials (+Rs 200)</option>
          <option value="eng">Engineering Kit (+Rs 1500)</option>
          <option value="folder">Presentation Folder (+Rs 150)</option>
        </select>
        <span class="absolute z-30 text-gray-500 -translate-y-1/2 pointer-events-none right-4 top-1/2 dark:text-gray-400">
          <svg class="stroke-current" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.79175 7.396L10.0001 12.6043L15.2084 7.396" stroke="" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </div>
    </div>

  </div>
</template>
