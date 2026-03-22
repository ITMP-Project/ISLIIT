<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Admin Requests (Student)">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            Pending requests: <span class="font-medium text-gray-700 dark:text-gray-200">{{ requests.length }}</span>
          </div>
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="refresh"
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
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Username</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Student ID</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Faculty</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Specialization</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Year</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Semester</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Modules</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Action</p>
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="req in requests" :key="req._id" class="border-t border-gray-100 dark:border-gray-800">
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-800 text-theme-sm dark:text-white/90">{{ req.username }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                      {{ requestStudentId(req) }}
                    </p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                      {{ facultyName(req.faculty_id) }}
                    </p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">
                      {{ specializationName(req.specialization_id) }}
                    </p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ req.year }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ req.semester }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-xs dark:text-gray-400">
                      {{ moduleNamesForRequest(req) }}
                    </p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <button
                      class="rounded-lg bg-brand-500 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
                      @click="req._id && approve(req._id)"
                      :disabled="!req._id || approvingId === req._id"
                    >
                      {{ approvingId === req._id ? "Approving..." : "Approve" }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="!requests.length" class="px-6 py-8 text-sm text-gray-500 dark:text-gray-400">
            No pending requests.
          </div>
        </div>
      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import type { StudentRequest } from "@/ts/mongo";
import { computed, onMounted, ref } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import { useStudentRequestsStore } from "@/store/studentRequests";

const currentPageTitle = ref("Admin Requests");
const approvingId = ref<string | null>(null);

const {
  faculties,
  specializations,
  modules,
  requests,
  loading,
  error,
  fetchFaculties,
  fetchSpecializations,
  fetchModules,
  fetchPendingRequests,
  approveRequest,
} = useStudentRequestsStore();

const facultyMap = computed(() => {
  const map = new Map<string, string>();
  for (const f of faculties.value) {
    if (f._id) map.set(String(f._id), String(f.faculty_name ?? ""));
  }
  return map;
});

const specializationMap = computed(() => {
  const map = new Map<string, string>();
  for (const s of specializations.value) {
    if (s._id) map.set(String(s._id), String(s.specialization_name ?? ""));
  }
  return map;
});

const moduleMap = computed(() => {
  const map = new Map<string, string>();
  for (const m of modules.value) {
    if (m._id) map.set(String(m._id), String(m.module_name ?? ""));
  }
  return map;
});

const facultyName = (id: string) => facultyMap.value.get(String(id)) ?? String(id ?? "-");
const specializationName = (id: string) =>
  specializationMap.value.get(String(id)) ?? String(id ?? "-");

const requestStudentId = (req: StudentRequest) =>
  String((req.studentId ?? (req as unknown as { student_id?: string }).student_id) ?? "-");

const moduleNamesForRequest = (req: StudentRequest) => {
  const ids = Array.isArray(req.module_ids)
    ? req.module_ids
    : [];
  if (!ids.length) return "-";
  const names = ids
    .map((id) => moduleMap.value.get(String(id)) ?? String(id))
    .filter(Boolean);
  return names.join(", ");
};

const refresh = async () => {
  await fetchPendingRequests();
};

const approve = async (id: string) => {
  approvingId.value = id;
  const result = await approveRequest(id);
  if (result) {
    await fetchPendingRequests();
  }
  approvingId.value = null;
};

onMounted(async () => {
  await fetchFaculties();
  await fetchSpecializations();
  await fetchModules();
  await fetchPendingRequests();
});
</script>

