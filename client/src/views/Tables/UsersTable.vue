<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Users CRUD">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            API:
            <span class="font-medium text-gray-700 dark:text-gray-200">{{ apiUrl }}</span>
          </div>
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="fetchUsers"
          >
            Refresh
          </button>
        </div>

        <form
          class="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:grid-cols-3"
          @submit.prevent="handleCreate"
        >
          <input
            v-model.trim="form.name"
            type="text"
            placeholder="Name"
            class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
            required
          />
          <input
            v-model.number="form.age"
            type="number"
            min="0"
            step="1"
            placeholder="Age"
            class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
            required
          />
          <div class="flex gap-3">
            <button
              type="submit"
              class="h-11 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
              :disabled="saving"
            >
              {{ saving ? "Saving..." : "Add" }}
            </button>
          </div>
        </form>

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
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Actions</p>
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
                    <template v-if="editingId === user._id">
                      <input
                        v-model.trim="editForm.name"
                        type="text"
                        class="h-9 w-full rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
                      />
                    </template>
                    <p v-else class="text-gray-800 text-theme-sm dark:text-white/90">{{ user.name }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <template v-if="editingId === user._id">
                      <input
                        v-model.number="editForm.age"
                        type="number"
                        min="0"
                        step="1"
                        class="h-9 w-24 rounded-lg border border-gray-200 bg-transparent px-3 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
                      />
                    </template>
                    <p v-else class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user.age }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ user._id }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-if="editingId !== user._id"
                        class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                        @click="startEdit(user)"
                        :disabled="!user._id"
                      >
                        Edit
                      </button>
                      <button
                        v-else
                        class="rounded-lg bg-brand-500 px-3 py-1 text-xs font-medium text-white transition hover:bg-brand-600"
                        @click="user._id && saveEdit(user._id)"
                        :disabled="!user._id"
                      >
                        Save
                      </button>
                      <button
                        v-if="editingId === user._id"
                        class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                        @click="cancelEdit"
                      >
                        Cancel
                      </button>
                      <button
                        class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                        @click="user._id && deleteUser(user._id)"
                        :disabled="!user._id"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="!users.length" class="px-6 py-8 text-sm text-gray-500 dark:text-gray-400">
            No users yet. Add one or click Refresh.
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
import { useUsersTableStore } from "@/store/usersTable";

const currentPageTitle = ref("Users Table");
const form = ref({ name: "", age: 18 });
const saving = ref(false);
const editingId = ref<string | null>(null);
const editForm = ref({ name: "", age: 18 });

const {
  users,
  loading,
  error,
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  apiUrl,
} = useUsersTableStore();

const handleCreate = async () => {
  saving.value = true;
  const created = await createUser({
    name: form.value.name,
    age: form.value.age,
  });
  if (created) {
    form.value = { name: "", age: 18 };
  }
  saving.value = false;
};

const startEdit = (user: { _id?: string; name: string; age: number }) => {
  if (!user._id) return;
  editingId.value = user._id;
  editForm.value = { name: user.name, age: user.age };
};

const cancelEdit = () => {
  editingId.value = null;
};

const saveEdit = async (id: string) => {
  const updated = await updateUser(id, {
    name: editForm.value.name,
    age: editForm.value.age,
  });
  if (updated) {
    editingId.value = null;
  }
};

onMounted(fetchUsers);
</script>
