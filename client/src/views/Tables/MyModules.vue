<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="My Modules">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
          <div class="space-y-0.5 text-xs text-gray-500 dark:text-gray-400">
            <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
              {{ username }}
            </p>
            <p v-if="contextSummary" class="text-[11px]">
              {{ contextSummary }}
            </p>
          </div>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2 text-xs font-medium text-white shadow-sm transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="!canEdit || loading"
            @click="openModulesDialog"
          >
            Add modules
          </button>
        </div>

        <div v-if="error" class="mt-3 rounded-lg border border-error-200 bg-error-50 px-4 py-2 text-xs text-error-700 dark:border-error-900/60 dark:bg-error-950/40 dark:text-error-300">
          {{ error }}
        </div>
        <div v-if="successMessage" class="mt-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          {{ successMessage }}
        </div>

        <div class="mt-4">
          <div
            v-if="selectedModules.length"
            class="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div class="max-w-full overflow-x-auto custom-scrollbar">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-gray-200 text-[11px] text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    <th class="px-5 py-3 text-left sm:px-6">Module</th>
                    <th class="px-5 py-3 text-left sm:px-6">Year / Sem</th>
                    <th class="px-5 py-3 text-right sm:px-6">Events</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-gray-200 text-xs text-gray-700 dark:divide-gray-800 dark:text-gray-200">
                  <tr v-for="mod in selectedModules" :key="mod._id ?? mod.module_name">
                    <td class="px-5 py-3 sm:px-6">
                      {{ mod.module_name }}
                    </td>
                    <td class="px-5 py-3 sm:px-6">
                      Year {{ mod.year }}, Sem {{ mod.semester }}
                    </td>
                    <td class="px-5 py-3 text-right sm:px-6">
                      <RouterLink
                        v-if="mod._id"
                        :to="`/modules/${encodeURIComponent(String(mod._id))}/events`"
                        class="inline-flex items-center gap-1 rounded-lg bg-brand-500 px-3 py-1 text-[11px] font-medium text-white hover:bg-brand-600"
                      >
                        View events
                      </RouterLink>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="rounded-xl border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300">
            No modules selected yet. Click <span class="font-semibold">Add modules</span> to choose.
          </div>
        </div>
      </ComponentCard>
    </div>

    <div
      v-if="isModulesDialogOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6"
    >
      <div
        class="w-full max-w-2xl rounded-2xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-gray-900 dark:ring-white/10"
      >
        <div class="flex items-center justify-between border-b border-gray-100 px-5 py-3 dark:border-gray-800">
          <div>
            <p class="text-sm font-semibold text-gray-800 dark:text-gray-100">Select modules</p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              Tick one or more modules for your specialization, year and semester.
            </p>
          </div>
          <button
            type="button"
            class="rounded-full px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
            @click="closeModulesDialog"
          >
            ✕
          </button>
        </div>
        <div class="max-h-80 overflow-y-auto px-5 py-4">
          <div v-if="modules.length === 0" class="text-xs text-gray-500 dark:text-gray-400">
            No modules available for your current academic context.
          </div>
          <div v-else class="space-y-2">
            <label
              v-for="mod in modules"
              :key="mod._id ?? mod.module_name"
              class="flex cursor-pointer items-start gap-3 rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs text-gray-700 shadow-sm transition hover:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <input
                v-model="tempSelectedModuleIds"
                class="mt-0.5 h-3 w-3 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                type="checkbox"
                :value="String(mod._id ?? '')"
              />
              <span>
                <span class="block text-xs font-semibold">
                  {{ mod.module_name }}
                </span>
                <span class="block text-[11px] text-gray-500 dark:text-gray-400">
                  Year {{ mod.year }}, Sem {{ mod.semester }}
                </span>
              </span>
            </label>
          </div>
        </div>
        <div class="flex items-center justify-end gap-2 border-t border-gray-100 px-5 py-3 text-xs dark:border-gray-800">
          <button
            type="button"
            class="rounded-lg border border-gray-200 bg-white px-4 py-1.5 font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="closeModulesDialog"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg bg-brand-500 px-4 py-1.5 font-medium text-white hover:bg-brand-600"
            @click="saveModules"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import type { AuthUser } from "@/ts/mongo";
import { useUserModulesStore } from "@/store/userModules";

const currentPageTitle = ref("My Modules");
const isModulesDialogOpen = ref(false);
const selectedModuleIds = ref<string[]>([]);
const tempSelectedModuleIds = ref<string[]>([]);
const successMessage = ref("");

const readAuthUser = (): AuthUser | null => {
  const raw = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const authUser = readAuthUser();
const username = authUser?.username ?? "";
const userId = authUser?._id ?? "";
const rolesRaw = Array.isArray(authUser?.roles)
  ? authUser.roles
  : Array.isArray(authUser?.role)
    ? (authUser?.role as string[])
    : authUser?.role
      ? [authUser.role as string]
      : [];
const normalizedRoles = rolesRaw.map((role: unknown) => String(role).toLowerCase());

const canEdit = computed(() =>
  normalizedRoles.some((role) => ["student", "admin", "helper"].includes(role))
);

const {
  modules,
  loading,
  error,
  fetchModulesForContext,
  updateUserModules,
} = useUserModulesStore();

const contextSummary = computed(() => {
  const facultyId = String((authUser as any)?.faculty_id ?? "");
  const specId = String((authUser as any)?.specialization_id ?? "");
  const year = Number((authUser as any)?.year ?? 0);
  const semester = Number((authUser as any)?.semester ?? 0);
  if (!facultyId || !specId || !year || !semester) {
    return "";
  }
  return `Faculty: ${facultyId} • Specialization: ${specId} • Year ${year}, Sem ${semester}`;
});

const selectedModules = computed(() =>
  modules.value.filter((mod) => {
    const id = String(mod._id ?? "");
    if (!id) return false;
    return selectedModuleIds.value.includes(id);
  })
);

const openModulesDialog = () => {
  successMessage.value = "";
  tempSelectedModuleIds.value = [...selectedModuleIds.value];
  isModulesDialogOpen.value = true;
};

const closeModulesDialog = () => {
  isModulesDialogOpen.value = false;
};

const saveModules = async () => {
  if (!userId) return;
  const nextIds = [...tempSelectedModuleIds.value];
  const updated = await updateUserModules(userId, nextIds);
  if (updated) {
    selectedModuleIds.value = nextIds;
    // keep authUser in local storage in sync
    const merged: AuthUser = { ...(authUser ?? {}), ...updated };
    localStorage.setItem("authUser", JSON.stringify(merged));
    successMessage.value = "Modules updated successfully.";
    isModulesDialogOpen.value = false;
  }
};

onMounted(async () => {
  if (!authUser) return;
  selectedModuleIds.value = Array.isArray(authUser.modules)
    ? authUser.modules.map((id) => String(id))
    : [];

  await fetchModulesForContext({
    // load all modules for this specialization, any year/semester
    specializationId: String((authUser as any)?.specialization_id ?? ""),
  });
});
</script>

