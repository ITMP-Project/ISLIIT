<template>
  <div>
    <div
      class="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm
             dark:border-gray-800 dark:bg-gray-900 lg:p-6"
    >
      <div class="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 class="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Academic Details
          </h4>

          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">Faculty ID</p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ authUser?.faculty_id || 'N/A' }}
              </p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Specialization ID
              </p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ authUser?.specialization_id || 'N/A' }}
              </p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Registered Modules
              </p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ modulesValue }}
              </p>
            </div>

            <div>
              <p class="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Created At
              </p>
              <p class="text-sm font-medium text-gray-800 dark:text-white/90">
                {{ createdAtDisplay }}
              </p>
            </div>
          </div>
        </div>


      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthUser } from '@/composables/useAuthUser'

const { authUser, createdAtDisplay } = useAuthUser()

const modulesValue = computed(() => {
  const modules = authUser.value?.modules
  if (modules && modules.length) {
    return modules.join(', ')
  }
  return 'N/A'
})
</script>

<style></style>
