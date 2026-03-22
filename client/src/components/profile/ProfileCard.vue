<template>
  <div>
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm
             dark:border-gray-800 dark:bg-gray-900 lg:p-6"
    >
      <div class="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
        <div class="flex w-full flex-col items-center gap-6 xl:flex-row">
          <div
            class="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-brand-500 text-lg font-semibold text-white dark:border-gray-800 shadow-sm"
          >
            {{ userInitials }}
          </div>
          <div class="order-3 text-center xl:order-2 xl:text-left">
            <h4 class="mb-1 text-lg font-semibold text-gray-800 dark:text-white/90">
              {{ authUser?.username || 'User' }}
            </h4>
            <div class="flex flex-col items-center gap-2 xl:items-start">
              <div class="flex flex-wrap justify-center gap-1.5 xl:justify-start">
                <span
                  v-for="chip in roleChips"
                  :key="chip.label"
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="chip.class"
                >
                  {{ chip.label }}
                </span>
              </div>
              <div class="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                <div class="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p>ID: {{ authUser?.student_id || 'N/A' }}</p>
              </div>
            </div>
          </div>

        </div>
 
      </div>
    </div>
    <Modal v-if="isProfileInfoModal" @close="isProfileInfoModal = false">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <!-- Extra profile info can go here -->
        </div>
      </template>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Modal from './Modal.vue'
import { useAuthUser } from '@/composables/useAuthUser'

const isProfileInfoModal = ref(false)

const { authUser, userInitials, roleChips } = useAuthUser()
</script>
