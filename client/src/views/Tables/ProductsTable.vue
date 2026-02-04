<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Products CRUD">
        <div class="flex flex-wrap items-center justify-between gap-3 pb-4">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            API:
            <span class="font-medium text-gray-700 dark:text-gray-200">{{ apiUrl }}</span>
          </div>
          <button
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="fetchProducts"
          >
            Refresh
          </button>
        </div>

        <form
          class="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:grid-cols-6"
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
            v-model.trim="form.category"
            type="text"
            placeholder="Category"
            class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
            required
          />
          <input
            v-model.number="form.price"
            type="number"
            step="0.01"
            placeholder="Price"
            class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
            required
          />
          <input
            v-model.number="form.stock"
            type="number"
            placeholder="Stock"
            class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
            required
          />
          <select
            v-model="form.status"
            class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
          >
            <option>Active</option>
            <option>Inactive</option>
            <option>Backorder</option>
          </select>
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
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Name</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Category</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Price</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Stock</p>
                  </th>
                  <th class="px-5 py-3 text-left sm:px-6">
                    <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p>
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
                  v-for="product in products"
                  :key="product._id ?? product.name"
                  class="border-t border-gray-100 dark:border-gray-800"
                >
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-800 text-theme-sm dark:text-white/90">{{ product.name }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ product.category }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ formatMoney(product.price) }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ product.stock }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <span class="rounded-full bg-brand-50 px-2 py-1 text-xs font-medium text-brand-600 dark:bg-brand-500/10 dark:text-brand-300">
                      {{ product.status }}
                    </span>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <p class="text-gray-500 text-theme-sm dark:text-gray-400">{{ product._id }}</p>
                  </td>
                  <td class="px-5 py-4 sm:px-6">
                    <button
                      class="rounded-lg border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                      @click="product._id && deleteProduct(product._id)"
                      :disabled="!product._id"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="!products.length" class="px-6 py-8 text-sm text-gray-500 dark:text-gray-400">
            No products yet. Add one or click Refresh.
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
import { useProductsTableStore } from "@/store/productsTable";

const currentPageTitle = ref("Products Table");
const saving = ref(false);
const form = ref({
  name: "",
  category: "",
  price: 0,
  stock: 0,
  status: "Active",
});

const { products, loading, error, fetchProducts, createProduct, deleteProduct, apiUrl } =
  useProductsTableStore();

const handleCreate = async () => {
  saving.value = true;
  const created = await createProduct({
    name: form.value.name,
    category: form.value.category,
    price: Number(form.value.price),
    stock: Number(form.value.stock),
    status: form.value.status,
  });

  if (created) {
    form.value = {
      name: "",
      category: "",
      price: 0,
      stock: 0,
      status: "Active",
    };
  }

  saving.value = false;
};

const formatMoney = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value ?? 0);

onMounted(fetchProducts);
</script>
