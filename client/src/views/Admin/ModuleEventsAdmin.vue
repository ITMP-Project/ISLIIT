<template>
  <AdminLayout>
    <PageBreadcrumb pageTitle="Module Events Admin" />

    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Modules">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
          <p class="text-xs text-gray-500 dark:text-gray-400">
            Search modules and open the events page for a specific module.
          </p>
          <div class="relative">
            <input
              v-model="search"
              type="text"
              placeholder="Search module title…"
              class="h-8 w-52 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>
        </div>

        <div v-if="error" class="mt-3 rounded-lg border border-error-200 bg-error-50 px-4 py-2 text-xs text-error-700 dark:border-error-900/60 dark:bg-error-950/40 dark:text-error-300">
          {{ error }}
        </div>

        <div class="mt-4">
          <div
            v-if="filteredModules.length"
            class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div class="max-w-full overflow-x-auto custom-scrollbar">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-gray-200 text-[11px] text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <th class="px-5 py-3 text-left sm:px-6">Module</th>
                    <th class="px-5 py-3 text-left sm:px-6">Year / Sem</th>
                    <th class="px-5 py-3 text-left sm:px-6">Specialization</th>
                    <th class="px-5 py-3 text-right sm:px-6">Actions</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 text-xs text-gray-700 dark:divide-gray-800 dark:text-gray-200">
                  <tr v-for="mod in filteredModules" :key="mod._id ?? mod.module_name">
                    <td class="px-5 py-3 sm:px-6">
                      {{ mod.module_name }}
                    </td>
                    <td class="px-5 py-3 sm:px-6">
                      Year {{ mod.year }}, Sem {{ mod.semester }}
                    </td>
                    <td class="px-5 py-3 sm:px-6">
                      {{ mod.specialization_id }}
                    </td>
                    <td class="px-5 py-3 text-right sm:px-6">
                      <button
                        type="button"
                        class="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1 text-[11px] font-medium text-white hover:bg-brand-600"
                        @click="goToEvents(mod)"
                      >
                        Manage events
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            v-else
            class="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
          >
            No modules found.
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import type { Module } from "@/ts/mongo";
import { useStudentRequestsStore } from "@/store/studentRequests";

const router = useRouter();
const search = ref("");

const { modules, error, fetchModules } = useStudentRequestsStore();

const filteredModules = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return modules.value;
  return modules.value.filter((mod) =>
    String(mod.module_name ?? "")
      .toLowerCase()
      .includes(term)
  );
});

const goToEvents = (mod: Module) => {
  const id = String(mod._id ?? "");
  if (!id) return;
  router.push({ path: `/modules/${encodeURIComponent(id)}/events` });
};

onMounted(async () => {
  await fetchModules();
});
</script>

