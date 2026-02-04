<template>
  <div class="min-h-screen xl:flex">
    <app-sidebar />
    <Backdrop />
    <div
      class="flex-1 transition-all duration-300 ease-in-out"
      :class="[isExpanded || isHovered ? 'lg:ml-[290px]' : 'lg:ml-[90px]']"
    >
      <app-header />
      <div class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
        <slot></slot>
      </div>
      <!-- Footer -->
      <footer class="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 pt-0">
        <p class="text-sm text-center text-gray-500 dark:text-gray-400">
          Designed and Developed by 
          <a 
            href="https://tailadmin.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-brand-500 hover:text-brand-600 transition-colors duration-200 font-medium"
          >
            TailAdmin
          </a>
          ~ Distributed by 
          <a 
            href="https://themewagon.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            class="text-brand-500 hover:text-brand-600 transition-colors duration-200 font-medium"
          >
            ThemeWagon
          </a>
          .
        </p>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSidebar } from '@/composables/useSidebar'
import AppHeader from './AppHeader.vue'
import AppSidebar from './AppSidebar.vue'
import Backdrop from './Backdrop.vue'
const { isExpanded, isHovered } = useSidebar()
</script>
