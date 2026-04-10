<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="space-y-5 sm:space-y-6">
      <ComponentCard :title="cardTitle">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div class="space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
            <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
              {{ moduleName || 'Module events' }}
            </p>
            <p v-if="moduleMeta" class="text-[11px]">
              {{ moduleMeta }}
            </p>
          </div>

          <button
            v-if="canCreate"
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="loading"
            @click="isCreateOpen = true"
          >
            Create event
          </button>
        </div>

        <div v-if="!isAllowed" class="mt-4 rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-xs text-error-700 dark:border-error-900/60 dark:bg-error-950/40 dark:text-error-300">
          You are not allowed to view events for this module.
        </div>

        <div v-else>
          <div v-if="loading && !events.length" class="flex flex-col items-center justify-center py-12">
            <div class="h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-brand-500"></div>
            <p class="mt-4 text-xs text-gray-500 dark:text-gray-400">Loading events...</p>
          </div>

          <div v-else-if="error" class="mt-3 rounded-lg border border-error-200 bg-error-50 px-4 py-2 text-xs text-error-700 dark:border-error-900/60 dark:bg-error-950/40 dark:text-error-300">
            {{ error }}
          </div>

          <div class="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div class="text-[11px] text-gray-500 dark:text-gray-400">
              {{ events.length }} event(s)
            </div>
            <div class="relative">
              <input
                v-model="search"
                type="text"
                placeholder="Search by title…"
                class="h-8 w-44 rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              />
            </div>
          </div>

          <div class="mt-4">
            <div
              v-if="filteredEvents.length"
              class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
            >
              <div class="max-w-full overflow-x-auto custom-scrollbar">
                <table class="min-w-full">
                  <thead>
                    <tr class="border-b border-gray-200 text-[11px] text-gray-500 dark:border-gray-700 dark:text-gray-400">
                      <th class="px-5 py-3 text-left sm:px-6">Title</th>
                      <th class="px-5 py-3 text-left sm:px-6">Type</th>
                      <th class="px-5 py-3 text-left sm:px-6">Start</th>
                      <th class="px-5 py-3 text-left sm:px-6">End</th>
                      <th class="px-5 py-3 text-left sm:px-6">Description</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 text-xs text-gray-700 dark:divide-gray-800 dark:text-gray-200">
                    <tr v-for="evt in filteredEvents" :key="evt._id">
                      <td class="px-5 py-3 sm:px-6">
                        {{ evt.title }}
                      </td>
                      <td class="px-5 py-3 sm:px-6 capitalize">
                        {{ evt.type }}
                      </td>
                      <td class="px-5 py-3 sm:px-6">
                        {{ formatDateTime(evt.startTime) }}
                      </td>
                      <td class="px-5 py-3 sm:px-6">
                        {{ formatDateTime(evt.endTime) }}
                      </td>
                      <td class="px-5 py-3 sm:px-6 max-w-xs">
                        <span class="line-clamp-2">
                          {{ evt.description }}
                        </span>
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
              No events found for this module.
            </div>
          </div>
        </div>
      </ComponentCard>
    </div>

    <!-- Create event modal -->
    <div
      v-if="isCreateOpen && isAllowed && canCreate"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
    >
      <div
        class="w-full max-w-lg rounded-2xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10"
      >
        <div class="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-gray-800">
          <div>
            <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">Create event</p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              Add a lecture, lab, or exam for this module.
            </p>
          </div>
          <button
            type="button"
            class="rounded-full px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            @click="closeCreate"
          >
            ✕
          </button>
        </div>
        <form class="space-y-3 px-5 py-4 text-xs" @submit.prevent="submitCreate">
          <div class="space-y-1">
            <label class="block font-medium text-gray-700 dark:text-gray-200">Title</label>
            <input
              v-model="form.title"
              type="text"
              required
              class="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="block font-medium text-gray-700 dark:text-gray-200">Type</label>
              <select
                v-model="form.type"
                required
                class="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              >
                <option disabled value="">Select type</option>
                <option value="lec">Lecture</option>
                <option value="lab">Lab</option>
                <option value="exam">Exam</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="space-y-1">
              <label class="block font-medium text-gray-700 dark:text-gray-200">Start time</label>
              <input
                v-model="form.startTime"
                type="datetime-local"
                required
                class="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              />
            </div>
            <div class="space-y-1">
              <label class="block font-medium text-gray-700 dark:text-gray-200">End time</label>
              <input
                v-model="form.endTime"
                type="datetime-local"
                required
                class="h-8 w-full rounded-lg border border-gray-200 bg-white px-3 text-xs text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
              />
            </div>
          </div>

          <div class="space-y-1">
            <label class="block font-medium text-gray-700 dark:text-gray-200">Description</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            />
          </div>

          <div class="flex items-center justify-end gap-2 border-t border-gray-100 pt-3 text-xs dark:border-gray-800">
            <button
              type="button"
              class="rounded-lg border border-gray-200 bg-white px-4 py-1.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="closeCreate"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-1.5 font-medium text-white hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="submitting"
            >
              <svg v-if="submitting" class="h-3 w-3 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ submitting ? 'Saving...' : 'Save event' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from "vue";
import { useRoute } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import type { AuthUser, Module } from "@/ts/mongo";
import { useModuleEventsStore } from "@/store/moduleEvents";
import { useStudentRequestsStore } from "@/store/studentRequests";
import { useNotification } from "@/composables/useNotification";

const route = useRoute();
const moduleId = computed(() => String(route.params.moduleId ?? ""));

const pageTitle = ref("Module Events");
const cardTitle = computed(() =>
  canCreate.value ? "Manage module events" : "Module events"
);

const {
  events,
  loading,
  error,
  fetchEvents,
  createEvent,
} = useModuleEventsStore();

const { modules, fetchModules } = useStudentRequestsStore();
const { addNotification } = useNotification();

const search = ref("");
const isCreateOpen = ref(false);
const submitting = ref(false);

const form = reactive({
  title: "",
  type: "" as "" | "lec" | "lab" | "exam",
  startTime: "",
  endTime: "",
  description: "",
});

const readAuthUser = (): AuthUser | null => {
  const raw = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_err) {
    return null;
  }
};

const authUser = readAuthUser();
const rolesRaw = Array.isArray(authUser?.roles)
  ? authUser.roles
  : Array.isArray(authUser?.role)
    ? (authUser?.role as string[])
    : authUser?.role
      ? [authUser.role as string]
      : [];
const normalizedRoles = rolesRaw.map((role: unknown) => String(role).toLowerCase());

const isAdmin = computed(() =>
  normalizedRoles.some((role) => role === "admin")
);

const userModuleIds = computed<string[]>(() =>
  Array.isArray(authUser?.modules)
    ? authUser!.modules.map((id) => String(id))
    : []
);

const isAllowed = computed(() => {
  if (!moduleId.value) return false;
  if (isAdmin.value) return true;
  return userModuleIds.value.includes(moduleId.value);
});

const canCreate = computed(() => isAdmin.value);

const currentModule = computed<Module | null>(() => {
  if (!moduleId.value) return null;
  return modules.value.find((m) => String(m._id ?? "") === moduleId.value) ?? null;
});

const moduleName = computed(() => currentModule.value?.module_name ?? "");
const moduleMeta = computed(() => {
  if (!currentModule.value) return "";
  return `Year ${currentModule.value.year}, Sem ${currentModule.value.semester}`;
});

const filteredEvents = computed(() => {
  const term = search.value.trim().toLowerCase();
  if (!term) return events.value;
  return events.value.filter((evt) =>
    evt.title.toLowerCase().includes(term)
  );
});

const formatDateTime = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const resetForm = () => {
  form.title = "";
  form.type = "";
  form.startTime = "";
  form.endTime = "";
  form.description = "";
};

const closeCreate = () => {
  if (submitting.value) return;
  resetForm();
  isCreateOpen.value = false;
};

const submitCreate = async () => {
  if (!moduleId.value) return;
  submitting.value = true;
  try {
    const result = await createEvent(moduleId.value, {
      title: form.title,
      type: form.type || "lec",
      startTime: new Date(form.startTime).toISOString(),
      endTime: new Date(form.endTime).toISOString(),
      description: form.description,
    });
    
    if (result) {
      addNotification("Event created successfully!", "success");
      resetForm();
      isCreateOpen.value = false;
    } else {
      addNotification(error.value || "Failed to create event", "error");
    }
  } catch (err: any) {
    addNotification(err.message || "An unexpected error occurred", "error");
  } finally {
    submitting.value = false;
  }
};

const loadModulePage = async () => {
  if (!moduleId.value) return;

  if (authUser) {
    await fetchModules({
      specializationId: String((authUser as any)?.specialization_id ?? ""),
    });
  }

  if (isAllowed.value) {
    await fetchEvents(moduleId.value);
  }
};

watch(moduleId, loadModulePage, { immediate: true });
</script>

