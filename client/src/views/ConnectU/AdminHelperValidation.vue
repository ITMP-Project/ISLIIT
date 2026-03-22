<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-6">
      <div v-if="loading" class="flex justify-center py-10">
        <!-- Spinner -->
        <svg class="animate-spin h-8 w-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
      <div v-else-if="error" class="text-red-500 bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">{{ error }}</div>
      <div v-else-if="helpers.length === 0" class="bg-white dark:bg-gray-800 p-8 text-center rounded-xl shadow-sm text-gray-500 border border-gray-200 dark:border-gray-700">
        No pending helper applications found.
      </div>
      <div v-else class="grid gap-6">
        <div v-for="h in helpers" :key="h._id || h.id" class="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col md:flex-row gap-6 md:items-center justify-between transition-transform">
          <div class="flex-1">
             <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
               <div>
                 <h4 class="text-lg font-bold text-gray-900 dark:text-white">{{ h.name }}</h4>
                 <div class="flex gap-4 mt-2">
                   <p class="text-sm text-brand-500 font-medium">ID: {{ h.student_id }}</p>
                   <p class="text-sm text-brand-500 font-medium">Year: {{ h.year_of_study }}</p>
                   <p class="text-sm text-brand-500 font-medium">Contact: {{ h.contact_no }}</p>
                 </div>
               </div>
             </div>

             <div class="space-y-4">
               <div>
                  <h5 class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Short Bio</h5>
                  <p class="text-sm text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">{{ h.bio }}</p>
               </div>
               <div>
                  <h5 class="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">Why should we select you?</h5>
                  <p class="text-sm text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">{{ h.why_select_you }}</p>
               </div>
             </div>
          </div>
          <div class="flex gap-3 shrink-0">
             <button @click="updateStatus(h._id || h.id, 'approved')" :disabled="actionLoading === (h._id || h.id)" class="px-5 py-2.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg shadow-sm shadow-green-500/30 transition-colors disabled:opacity-50">Approve</button>
             <button @click="updateStatus(h._id || h.id, 'rejected')" :disabled="actionLoading === (h._id || h.id)" class="px-5 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-lg shadow-sm shadow-red-500/30 transition-colors disabled:opacity-50">Reject</button>
          </div>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';

const currentPageTitle = ref('Admin - Pending Helpers');
const helpers = ref([]);
const loading = ref(true);
const error = ref('');
const actionLoading = ref(null);

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const fetchPending = async () => {
    loading.value = true;
    try {
        const res = await fetch(`${apiUrl}/api/p-helper/admin/pending`);
        if(!res.ok) throw new Error("Failed to fetch pending requests");
        const data = await res.json();
        helpers.value = data;
    } catch(err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

onMounted(fetchPending);

const updateStatus = async (id, status) => {
    actionLoading.value = id;
    try {
        const res = await fetch(`${apiUrl}/api/p-helper/${id}/status`, {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ status })
        });
        if(!res.ok) throw new Error(`Update to ${status} failed`);
        
        helpers.value = helpers.value.filter(h => (h._id || h.id) !== id);
    } catch(err) {
        alert(err.message);
    } finally {
        actionLoading.value = null;
    }
};
</script>
