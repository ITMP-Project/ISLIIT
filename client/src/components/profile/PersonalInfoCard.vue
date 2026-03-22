<template>
  <div>
    <div
      class="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm
             dark:border-gray-800 dark:bg-gray-900 lg:p-6"
    >
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Personal Information
          </h4>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Username
              </p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ authUser?.username || 'N/A' }}
              </p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Student ID
              </p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ authUser?.student_id || 'N/A' }}
              </p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Roles</p>
              <div class="flex flex-wrap gap-1.5">
                <span
                  v-for="chip in roleChips"
                  :key="chip.label"
                  class="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium"
                  :class="chip.class"
                >
                  {{ chip.label }}
                </span>
              </div>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Faculty ID
              </p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ authUser?.faculty_id || 'N/A' }}
              </p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Year / Semester
              </p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ authUser?.year ?? 'N/A' }} / {{ authUser?.semester ?? 'N/A' }}
              </p>
            </div>
          </div>
        </div>

   
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthUser } from '@/composables/useAuthUser'

const { authUser, roleChips } = useAuthUser()
</script>
