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
      <div v-else-if="error" class="text-red-500 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">{{ error }}</div>
      <div v-else-if="conversations.length === 0" class="bg-white dark:bg-gray-800 p-10 text-center rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-center">
        <div class="h-16 w-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
        </div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2">No messages yet</h3>
        <p class="text-gray-500 dark:text-gray-400">You don't have any ongoing consultations.</p>
      </div>
      <div v-else class="grid gap-4">
        <router-link 
          v-for="conv in conversations" 
          :key="conv._id" 
          :to="`/connect-u/chat/${conv._id}`" 
          class="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex items-center justify-between hover:border-brand-500 transition-colors cursor-pointer group"
        >
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-brand-50 dark:bg-brand-500/10 rounded-full flex items-center justify-center text-brand-500 font-bold border border-brand-100 dark:border-brand-500/20">
                {{ getParticipantName(conv).charAt(0).toUpperCase() }}
             </div>
             <div>
               <h4 class="text-base font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors">{{ getParticipantName(conv) }}</h4>
               <p class="text-xs text-gray-500 mt-1 font-medium">Session started {{ new Date(conv.created_at).toLocaleDateString() }}</p>
             </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700/50 p-2 rounded-lg group-hover:bg-brand-50 dark:group-hover:bg-brand-500/20 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400 group-hover:text-brand-500 transition-colors" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
          </div>
        </router-link>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';

const currentPageTitle = ref('My Messages');
const conversations = ref([]);
const loading = ref(true);
const error = ref('');
const currentUserId = ref('');

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

onMounted(async () => {
    const userStr = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            currentUserId.value = user.id || user._id || '';
        } catch(e) {}
    } 
    
    if (!currentUserId.value) {
        let mockId = localStorage.getItem('mockUserId');
        if (!mockId) {
           mockId = `USER-${Date.now()}`;
           localStorage.setItem('mockUserId', mockId);
        }
        currentUserId.value = mockId;
    }

    try {
        const res = await fetch(`${apiUrl}/api/chat/conversations/user/${currentUserId.value}`);
        if (!res.ok) throw new Error("Failed to load conversations");
        conversations.value = await res.json();
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
});

const getParticipantName = (conv) => {
    // If I am the student, the participant is the helper
    if (conv.student_id === currentUserId.value) {
        return conv.helper?.name ? `Helper ${conv.helper.name}` : `Helper (ID: ${conv.helper?.student_id || conv.helper_id})`;
    }
    // If I am the helper, I help the student
    return `Student (ID: ${conv.student_id})`;
};
</script>
