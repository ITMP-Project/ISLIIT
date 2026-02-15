<template>
  <div
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
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">
                Current Roles
              </p>
            </th>
            <th class="px-5 py-3 text-left sm:px-6">
              <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Action</p>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
          <tr v-if="loadingUsers || loadingRoles">
            <td colspan="4" class="px-6 py-6 text-sm text-gray-500 dark:text-gray-400">
              Loading users...
            </td>
          </tr>
          <tr v-else-if="error">
            <td colspan="4" class="px-6 py-6 text-sm text-error-600 dark:text-error-400">
              {{ error }}
            </td>
          </tr>
          <tr v-else-if="!authUsers.length">
            <td colspan="4" class="px-6 py-6 text-sm text-gray-500 dark:text-gray-400">
              No auth users found.
            </td>
          </tr>
          <tr
            v-else
            v-for="user in authUsers"
            :key="user.username"
            class="border-t border-gray-100 dark:border-gray-800"
          >
            <td class="px-5 py-4 sm:px-6">
              <p class="text-gray-800 text-theme-sm dark:text-white/90">{{ user.username }}</p>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="role in getUserRoles(user)"
                  :key="role"
                  :class="roleBadgeClass(role)"
                  class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium text-white"
                >
                  <svg
                    class="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      clip-rule="evenodd"
                      d="M10 2.5a7.5 7.5 0 1 0 0 15 7.5 7.5 0 0 0 0-15Zm3.25 6.25a.75.75 0 0 1 .53 1.28l-4 4a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 1 1 1.06-1.06l1.47 1.47 3.47-3.47a.75.75 0 0 1 .53-.22Z"
                    />
                  </svg>
                  {{ role }}
                </span>
                <span v-if="!getUserRoles(user).length" class="text-xs text-gray-500 dark:text-gray-400">
                  -
                </span>
              </div>
            </td>
            <td class="px-5 py-4 sm:px-6">
              <button
                class="rounded-lg bg-brand-500 px-3 py-2 text-xs font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
                :disabled="!user._id"
                @click="user._id && openAssignModal(user)"
              >
                Assign Roles
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <Modal v-if="isModalOpen" :fullScreenBackdrop="true" @close="closeAssignModal">
    <template #body>
      <div
        class="relative w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-theme-sm dark:bg-gray-900"
      >
        <button
          @click="closeAssignModal"
          class="transition-color absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:bg-gray-700 dark:bg-white/[0.05] dark:text-gray-400 dark:hover:bg-white/[0.07] dark:hover:text-gray-300"
        >
          <svg
            class="fill-current"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4.55806 4.55806C4.80214 4.31398 5.19786 4.31398 5.44194 4.55806L10 9.11612L14.5581 4.55806C14.8021 4.31398 15.1979 4.31398 15.4419 4.55806C15.686 4.80214 15.686 5.19786 15.4419 5.44194L10.8839 10L15.4419 14.5581C15.686 14.8021 15.686 15.1979 15.4419 15.4419C15.1979 15.686 14.8021 15.686 14.5581 15.4419L10 10.8839L5.44194 15.4419C5.19786 15.686 4.80214 15.686 4.55806 15.4419C4.31398 15.1979 4.31398 14.8021 4.55806 14.5581L9.11612 10L4.55806 5.44194C4.31398 5.19786 4.31398 4.80214 4.55806 4.55806Z"
              fill="currentColor"
            />
          </svg>
        </button>

        <div class="space-y-4">
          <div>
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
              Assign Roles
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ modalUser?.username ?? "User" }}
            </p>
          </div>

          <div class="grid gap-3 sm:grid-cols-2">
            <label
              v-for="role in roleOptions"
              :key="role"
              class="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 dark:border-gray-700 dark:text-gray-200"
            >
              <input
                type="checkbox"
                :value="role"
                v-model="modalRoles"
                class="h-4 w-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
              />
              <span class="capitalize">{{ role }}</span>
            </label>
          </div>

          <div class="flex flex-wrap gap-3 pt-2">
            <button
              class="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-600 disabled:cursor-not-allowed disabled:opacity-70"
              :disabled="modalSaving || !modalUser?._id"
              @click="confirmAssign"
            >
              {{ modalSaving ? "Assigning..." : "Assign" }}
            </button>
            <button
              class="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
              @click="closeAssignModal"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </template>
  </Modal>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useRolesAdminStore } from "@/store/rolesAdmin";
import type { AuthUser } from "@/ts/mongo";
import Modal from "@/components/ui/Modal.vue";
import { useToast } from "vue-toastification";

const toast = useToast();
const isModalOpen = ref(false);
const modalUser = ref<AuthUser | null>(null);
const modalRoles = ref<string[]>([]);
const modalSaving = ref(false);

const { roles, authUsers, loadingRoles, loadingUsers, error, fetchRoles, fetchAuthUsers, assignRoles } =
  useRolesAdminStore();

const getUserRoles = (user: AuthUser) => {
  if (Array.isArray(user.roles)) return user.roles;
  if (Array.isArray(user.role)) return user.role;
  if (user.role) return [user.role];
  return [];
};

const roleBadgeClass = (role: string) => {
  const normalized = String(role ?? "").toLowerCase();
  if (normalized === "admin") return "bg-error-500";
  if (normalized === "helper") return "bg-warning-500";
  if (normalized === "student" || normalized === "students") return "bg-blue-light-500";
  if (normalized === "user") return "bg-success-500";
  return "bg-gray-500";
};

const roleOptions = computed(() => {
  const base = ["admin", "helper", "user"];
  const existing = Array.isArray(roles.value)
    ? roles.value.map((role) => String(role.name ?? "").trim()).filter(Boolean)
    : [];
  const unique = new Set([...base, ...existing]);
  return Array.from(unique);
});

const openAssignModal = (user: AuthUser) => {
  modalUser.value = user;
  modalRoles.value = [...getUserRoles(user)];
  isModalOpen.value = true;
};

const closeAssignModal = () => {
  isModalOpen.value = false;
  modalUser.value = null;
  modalRoles.value = [];
};

const confirmAssign = async () => {
  if (!modalUser.value?._id) return;
  modalSaving.value = true;
  const updated = await assignRoles(modalUser.value._id, modalRoles.value);
  if (updated) {
    toast.success("Roles assigned successfully.");
    closeAssignModal();
  } else {
    toast.error(error.value ?? "Assign role failed.");
  }
  modalSaving.value = false;
};

onMounted(async () => {
  await Promise.all([fetchRoles(), fetchAuthUsers()]);
});
</script>
