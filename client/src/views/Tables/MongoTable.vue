<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Mongo Users">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            API: <span class="font-medium text-gray-700 dark:text-gray-200">{{ apiUrl }}</span>
          </div>
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="fetchUsers"
          >
            Refresh
          </button>
        </div>

        <div v-if="loading" class="py-6 text-sm text-gray-500 dark:text-gray-400">Loading...</div>
        <div v-else-if="error" class="py-6 text-sm text-error-600 dark:text-error-400">
          {{ error }}
        </div>
        <div
          v-else
          class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
        >
          <div class="max-w-full overflow-x-auto custom-scrollbar">
            <table class="min-w-full">
              <thead>
                <tr class="border-b border-gray-200 dark:border-gray-700">
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Name</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Age</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">ID</p>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr
                  v-for="user in users"
                  :key="user._id ?? user.name"
                  class="border-t border-gray-100 dark:border-gray-800"
                >
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-800 text-theme-sm dark:text-white/90">{{ user.name }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.age }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user._id }}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="!users.length" class="px-6 py-8 text-sm text-gray-500 dark:text-gray-400">
            No users yet. Check your MongoDB connection, then click Refresh.
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import { useMongoTableStore } from "@/store/mongoTable";

const currentPageTitle = ref("Mongo Users");

const { users, loading, error, fetchUsers, apiUrl } = useMongoTableStore();

onMounted(fetchUsers);
</script>
