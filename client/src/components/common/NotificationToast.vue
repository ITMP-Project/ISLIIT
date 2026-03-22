<script setup lang="ts">
import { useNotification } from '@/composables/useNotification';

const { notifications, removeNotification } = useNotification();
</script>

<template>
  <div class="fixed top-20 right-5 z-99999 flex flex-col gap-3 pointer-events-none">
    <transition-group 
        enter-active-class="transform transition-all duration-300 ease-out flex"
        enter-from-class="translate-x-full opacity-0 scale-90"
        enter-to-class="translate-x-0 opacity-100 scale-100"
        leave-active-class="transform transition-all duration-300 ease-in flex absolute w-full"
        leave-from-class="translate-x-0 opacity-100 scale-100"
        leave-to-class="translate-x-full opacity-0 scale-90"
        tag="div" 
        class="flex flex-col gap-3 relative"
    >
      <div 
        v-for="notification in notifications" 
        :key="notification.id"
        @click="removeNotification(notification.id)"
        class="pointer-events-auto cursor-pointer max-w-sm w-full p-4 rounded-lg shadow-[0_10px_30px_rgba(0,0,0,0.15)] flex items-start gap-4 border-l-4"
        :class="{
          'bg-green-50 border-green-500 text-green-800 dark:bg-meta-4 dark:text-green-400': notification.type === 'success',
          'bg-red-50 border-red-500 text-red-800 dark:bg-meta-4 dark:text-red-400': notification.type === 'error',
          'bg-blue-50 border-blue-500 text-blue-800 dark:bg-meta-4 dark:text-blue-400': notification.type === 'info'
        }"
      >
        <!-- Icon -->
        <span class="flex-shrink-0">
          <svg v-if="notification.type === 'success'" class="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <svg v-else-if="notification.type === 'error'" class="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          <svg v-else class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </span>
        <!-- Message -->
        <div class="flex-1 pt-0.5">
          <p class="text-sm font-semibold">{{ notification.message }}</p>
        </div>
      </div>
    </transition-group>
  </div>
</template>
