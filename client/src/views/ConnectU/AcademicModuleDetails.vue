<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-6">
      
      <!-- Module Header & Become a Helper Button -->
      <div class="flex flex-col sm:flex-row justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div>
           <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Module Helpers</h2>
           <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Connect with students who excel in this module.</p>
        </div>
        <button v-if="!isAdmin && !myHelperProfile" @click="showModal = true" class="mt-4 sm:mt-0 px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors">
          Become a Helper
        </button>
      </div>

      <!-- Helpers List -->
      <div v-if="loading" class="flex justify-center py-10">
        <svg class="animate-spin h-8 w-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
      </div>
      <div v-else-if="helpers.length === 0" class="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <p class="text-gray-500 dark:text-gray-400">No approved helpers available for this module yet.</p>
      </div>
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="helper in helpers" 
          :key="helper._id"
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col"
        >
          <div class="h-24 bg-brand-500/10 dark:bg-brand-500/20 w-full relative">
             <div class="absolute -bottom-10 left-6">
                <img :src="helper.profilePicture || '/images/user/user-01.jpg'" class="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover" />
             </div>
          </div>
          
          <div class="pt-12 pb-6 px-6 flex-grow flex flex-col">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-1">{{ helper.name || `Helper ${helper.student_id}` }}</h3>
            <p class="text-brand-500 text-xs font-semibold mb-3">Year {{ helper.year_of_study }}</p>
            <p class="text-gray-600 dark:text-gray-400 text-sm mb-5 leading-relaxed">{{ helper.introduction }}</p>
            
            <button v-if="!myHelperProfile || helper._id !== myHelperProfile._id" @click="$router.push(`/connect-u/academic-chat/${helper._id}`)" class="mt-auto w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-medium text-sm rounded-lg border border-gray-200 dark:border-gray-600 transition-colors flex items-center justify-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
              Consult
            </button>
          </div>
        </div>
      </div>

      <!-- Application Modal -->
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
        <div class="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-lg relative shadow-xl">
           <button @click="showModal = false" class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>
           <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">Become an Academic Helper</h3>
           
           <form @submit.prevent="submitApplication" class="space-y-4">
             <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student ID</label>
               <input v-model="form.student_id" required pattern="{10}" title="Student ID must be exactly 10 digits" type="text" class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
             </div>
             <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contact No</label>
               <input v-model="form.contact_no" required pattern="[0-9]{10}" title="Contact number must be exactly 10 digits" type="text" class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
             </div>
             <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
               <input v-model="form.name" required type="text" class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
             </div>
             <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year of Study</label>
               <input v-model="form.year_of_study" required type="number" min="1" max="4" class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
             </div>
             <div>
               <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Introduction (Expertise)</label>
               <textarea v-model="form.introduction" required rows="3" class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input"></textarea>
             </div>
             
             <div v-if="appSuccess" class="p-3 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-sm">
                Application submitted successfully! Waiting for admin approval.
             </div>
             <div v-if="appError" class="p-3 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 rounded-lg text-sm">
                {{ appError }}
             </div>

             <div class="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
               <button type="button" @click="showModal = false" class="px-5 py-2.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg font-medium">Cancel</button>
               <button type="submit" :disabled="submitting" class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white rounded-lg font-medium disabled:opacity-50">
                 {{ submitting ? 'Submitting...' : 'Apply' }}
               </button>
             </div>
           </form>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";

const route = useRoute();
const currentPageTitle = ref("Module Helpers");
const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const helpers = ref([]);
const loading = ref(true);

const showModal = ref(false);
const submitting = ref(false);
const appSuccess = ref(false);
const appError = ref("");

const form = ref({
  student_id: "",
  contact_no: "",
  name: "",
  year_of_study: "",
  introduction: ""
});

const readAuthUser = () => {
  const raw = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const currentUser = ref(readAuthUser());

const isAdmin = computed(() => {
  if (!currentUser.value) return false;
  const roles = Array.isArray(currentUser.value.roles)
    ? currentUser.value.roles
    : Array.isArray(currentUser.value.role)
      ? currentUser.value.role
      : currentUser.value.role
        ? [currentUser.value.role]
        : [];
  return roles.some((role) => String(role).toLowerCase() === "admin");
});

const isHelperForModule = computed(() => {
  if (!myHelperProfile.value) return false;
  return helpers.value.some(h => h._id === myHelperProfile.value._id);
});

const myHelperProfile = ref(null);

onMounted(async () => {
  const { id } = route.params; // moduleId
  
  if (currentUser.value?.username) {
    try {
      const pRes = await fetch(`${apiUrl}/api/academic/helpers/by-student/${currentUser.value.username}`);
      if (pRes.ok) myHelperProfile.value = await pRes.json();
    } catch(e) {}
  }

  try {
    const res = await fetch(`${apiUrl}/api/academic/modules/${id}/helpers`);
    if(res.ok) helpers.value = await res.json();
  } catch(e) {
    console.error('Error fetching helpers', e);
  } finally {
    loading.value = false;
  }
});

const submitApplication = async () => {
  submitting.value = true;
  appError.value = "";
  appSuccess.value = false;
  
  try {
    const payload = { ...form.value, module_id: route.params.id };
    const res = await fetch(`${apiUrl}/api/academic/helpers/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    if(res.ok) {
      appSuccess.value = true;
      setTimeout(() => {
        showModal.value = false;
        appSuccess.value = false;
        form.value = { student_id: "", contact_no: "", name: "", year_of_study: "", introduction: "" };
      }, 2000);
    } else {
      const data = await res.json();
      appError.value = Array.isArray(data.errors) ? data.errors.join(", ") : data.error;
    }
  } catch(e) {
    appError.value = "Network error. Please try again later.";
  } finally {
    submitting.value = false;
  }
};
</script>
