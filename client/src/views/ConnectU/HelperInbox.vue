<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-8">
      
      <div v-if="loading" class="flex justify-center py-10">
        <svg class="animate-spin h-8 w-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 p-6 rounded-2xl border border-red-100 dark:border-red-800 text-center">
        <p class="font-medium text-lg">{{ error }}</p>
      </div>

      <div v-else>
        <!-- Consultations as a Student -->
        <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
             <h2 class="text-xl font-bold text-gray-900 dark:text-white">Helpers You've Consulted</h2>
             <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Academic supporters you are getting help from.</p>
          </div>
          
          <div v-if="contactedHelpers.length === 0" class="p-10 text-center text-gray-500 dark:text-gray-400">
            <p>You haven't reached out to any helpers yet.</p>
          </div>

          <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="helper in contactedHelpers" :key="helper._id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <router-link :to="`/connect-u/academic-chat/${helper._id}`" class="flex items-center justify-between p-5">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 flex-shrink-0 rounded-full bg-brand-500/10 text-brand-600 flex items-center justify-center font-bold text-lg overflow-hidden">
                    <span v-if="!helper.profile_picture">H</span>
                    <img v-else :src="helper.profile_picture" alt="Profile" class="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ helper.name || helper.student_id }}</h4>
                    <p class="text-xs text-brand-500 font-medium">Academic Helper</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Click to view messages</p>
                  </div>
                </div>
                <div class="text-brand-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        
        <!-- Consultations as a Helper (Only if applies) -->
        <div v-if="helperProfile" class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div class="p-6 border-b border-gray-200 dark:border-gray-700">
             <h2 class="text-xl font-bold text-gray-900 dark:text-white">Students You're Helping</h2>
             <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">Students who have reached out to you for your expertise.</p>
          </div>
          
          <div v-if="students.length === 0" class="p-10 text-center text-gray-500 dark:text-gray-400">
            <p>You don't have any active student consultations yet.</p>
          </div>

          <ul v-else class="divide-y divide-gray-200 dark:divide-gray-700">
            <li v-for="student in students" :key="student.id" class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <router-link :to="`/connect-u/academic-chat/${helperProfile._id}?studentId=${student.id}`" class="flex items-center justify-between p-5">
                <div class="flex items-center gap-4">
                  <div class="w-12 h-12 flex-shrink-0 rounded-full bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold text-lg overflow-hidden">
                    <img v-if="student.profile_picture" :src="student.profile_picture" alt="Profile" class="h-full w-full object-cover" />
                    <span v-else>S</span>
                  </div>
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ student.username || student.id }}</h4>
                    <p class="text-xs text-blue-500 font-medium">Student</p>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Click to view messages</p>
                  </div>
                </div>
                <div class="text-brand-500">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
      
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";

const currentPageTitle = ref("My Consultations");
const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const readAuthUser = () => {
  const raw = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  try { return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
};

const currentUser = ref(readAuthUser());
const defaultStudentId = computed(() => {
  if (currentUser.value?.student_id) return currentUser.value.student_id;
  if (currentUser.value?.username && /^[A-Za-z]{2}\d{8}$/.test(currentUser.value.username)) return currentUser.value.username;
  return currentUser.value?.username || "unknown";
});

const loading = ref(true);
const error = ref("");
const helperProfile = ref(null);
const students = ref([]);
const contactedHelpers = ref([]);

onMounted(async () => {
  if (!defaultStudentId.value || defaultStudentId.value === "unknown") {
    error.value = "You must be logged in to view your consultations.";
    loading.value = false;
    return;
  }
  
  try {
    // 1. Fetch Student Inbox (Helpers they've chatted with)
    const sinboxRes = await fetch(`${apiUrl}/api/academic/chat/student-inbox/${defaultStudentId.value}`);
    if (sinboxRes.ok) {
       contactedHelpers.value = await sinboxRes.json();
    }
    
    // 2. Fetch Helper Inbox (Students who have chatted with them)
    const profileRes = await fetch(`${apiUrl}/api/academic/helpers/by-student/${defaultStudentId.value}`);
    if (profileRes.ok) {
      helperProfile.value = await profileRes.json();
      const helperId = helperProfile.value._id;
      
      const inboxRes = await fetch(`${apiUrl}/api/academic/chat/inbox/${helperId}`);
      if (inboxRes.ok) {
        let data = await inboxRes.json();
        students.value = data.filter(student => String(student.id) !== String(defaultStudentId.value));
      }
    }
  } catch(e) {
    error.value = "A network error occurred while loading your inboxes.";
    console.error(e);
  } finally {
    loading.value = false;
  }
});
</script>
