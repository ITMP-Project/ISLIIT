<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Comments CRUD">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            API:
            <span class="font-medium text-gray-700 dark:text-gray-200">{{ apiUrl }}</span>
          </div>
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="fetchComments"
          >
            Refresh
          </button>
        </div>

        <form
          class="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:grid-cols-4"
          @submit.prevent="handleCreate"
        >
          <input
            v-model.trim="form.productId"
            type="text"
            placeholder="Product ID"
            class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
            required
          />
          <input
            v-model.trim="form.author"
            type="text"
            placeholder="Author"
            class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
            required
          />
          <input
            v-model.trim="form.message"
            type="text"
            placeholder="Message"
            class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
            required
          />
          <button
            type="submit"
            class="h-11 rounded-lg bg-brand-500 px-4 text-sm font-medium text-white transition hover:bg-brand-600"
            :disabled="saving"
          >
            {{ saving ? "Saving..." : "Add" }}
          </button>
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
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Product ID</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Author</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Message</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Created</p>
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
                  v-for="comment in comments"
                  :key="comment._id ?? comment.message"
                  class="border-t border-gray-100 dark:border-gray-800"
                >
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ comment.productId }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-800 text-theme-sm dark:text-white/90">{{ comment.author }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ comment.message }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ formatDate(comment.createdAt) }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ comment._id }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <button
                      class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                      @click="comment._id && deleteComment(comment._id)"
                      :disabled="!comment._id"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="!comments.length" class="px-6 py-8 text-sm text-gray-500 dark:text-gray-400">
            No comments yet. Add one or click Refresh.
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
import { useCommentsTableStore } from "@/store/commentsTable";

const currentPageTitle = ref("Comments Table");
const saving = ref(false);
const form = ref({ productId: "", author: "", message: "" });

const { comments, loading, error, fetchComments, createComment, deleteComment, apiUrl } =
  useCommentsTableStore();

const handleCreate = async () => {
  saving.value = true;
  const created = await createComment({
    productId: form.value.productId,
    author: form.value.author,
    message: form.value.message,
  });
  if (created) {
    form.value = { productId: "", author: "", message: "" };
  }
  saving.value = false;
};

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
};

onMounted(fetchComments);
</script>
