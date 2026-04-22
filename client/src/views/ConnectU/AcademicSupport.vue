<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-6">
      
      <!-- Selection Flow -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div class="flex flex-row justify-between items-center mb-4">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white">Find Modules</h3>
          <router-link to="/connect-u/chat/my-inbox" class="relative flex items-center gap-2 px-4 py-2 bg-brand-50 hover:bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 dark:text-brand-400 rounded-lg font-medium transition-colors text-sm border border-brand-100 dark:border-brand-500/20">
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/></svg>
            My Consultations
            <span v-if="myInboxCount > 0" class="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-800">{{ myInboxCount }}</span>
          </router-link>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Faculty Select -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Faculty</label>
            <select v-model="selectedFaculty" @change="fetchSpecializations" class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
              <option value="" disabled>Select Faculty</option>
              <option v-for="f in faculties" :key="f._id" :value="f._id">{{ f.name }}</option>
            </select>
          </div>
          
          <!-- Specialization Select -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Specialization</label>
            <select v-model="selectedSpec" @change="fetchModules" :disabled="!selectedFaculty" class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input disabled:opacity-50">
              <option value="" disabled>Select Specialization</option>
              <option v-for="s in specializations" :key="s._id" :value="s._id">{{ s.name }}</option>
            </select>
          </div>

          <!-- Year Select -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Year</label>
            <select v-model="selectedYear" @change="fetchModules" class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
              <option value="" disabled>Select Year</option>
              <option value="1">Year 1</option>
              <option value="2">Year 2</option>
              <option value="3">Year 3</option>
              <option value="4">Year 4</option>
            </select>
          </div>

          <!-- Semester Select -->
          <div>
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Semester</label>
            <select v-model="selectedSemester" @change="fetchModules" class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
              <option value="" disabled>Select Semester</option>
              <option value="1">Semester 1</option>
              <option value="2">Semester 2</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Modules List -->
      <div v-if="loadingModules" class="flex justify-center py-10">
        <svg class="animate-spin h-8 w-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>

      <div v-else-if="modules.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="mod in modules" 
          :key="mod._id"
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md"
        >
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">{{ mod.name }}</h3>
          <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Year {{ mod.year }}, Semester {{ mod.semester }}
          </p>
          <router-link :to="`/connect-u/academic-support/${mod._id}`" class="mt-auto w-full py-2.5 px-4 bg-brand-500 hover:bg-brand-600 text-white font-medium text-sm rounded-lg transition-colors text-center inline-block">
            View Helpers
          </router-link>
        </div>
      </div>
      
      <div v-else-if="allSelected" class="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <p class="text-gray-500 dark:text-gray-400">No modules found for the selected criteria.</p>
      </div>
      
      <div v-else class="text-center py-10 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700">
        <p class="text-gray-500 dark:text-gray-400">Please select Faculty, Specialization, Year, and Semester to view modules.</p>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";

const currentPageTitle = ref("Academic Support");
const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

const readAuthUser = () => {
  const raw = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  try { return raw ? JSON.parse(raw) : null; } catch(e) { return null; }
};
const currentUser = ref(readAuthUser());
const myHelperProfile = ref(null);
const myInboxCount = ref(0);

const defaultStudentId = computed(() => {
  if (currentUser.value?.student_id) return currentUser.value.student_id;
  if (currentUser.value?.username && /^[A-Za-z]{2}\d{8}$/.test(currentUser.value.username)) return currentUser.value.username;
  return currentUser.value?.username || "unknown";
});

const faculties = ref([]);
const specializations = ref([]);
const modules = ref([]);

const selectedFaculty = ref("");
const selectedSpec = ref("");
const selectedYear = ref("");
const selectedSemester = ref("");

const loadingModules = ref(false);

const allSelected = computed(() => {
  return selectedFaculty.value && selectedSpec.value && selectedYear.value && selectedSemester.value;
});

onMounted(async () => {
  if (defaultStudentId.value && defaultStudentId.value !== "unknown") {
    let totalUnread = 0;
    
    // 1. Fetch student unread count
    try {
      const sRes = await fetch(`${apiUrl}/api/academic/chat/student-unread/${defaultStudentId.value}`);
      if (sRes.ok) {
        const sData = await sRes.json();
        totalUnread += (sData.count || 0);
      }
    } catch(e) {}
    
    // 2. Fetch helper unread count if they are a registered helper
    try {
      const pRes = await fetch(`${apiUrl}/api/academic/helpers/by-student/${defaultStudentId.value}`);
      if (pRes.ok) {
         myHelperProfile.value = await pRes.json();
         const hRes = await fetch(`${apiUrl}/api/academic/chat/unread/${myHelperProfile.value._id}`);
         if (hRes.ok) {
           const hData = await hRes.json();
           totalUnread += (hData.count || 0);
         }
      }
    } catch(e) {}
    
    myInboxCount.value = totalUnread;
  }

  try {
    const res = await fetch(`${apiUrl}/api/academic/faculties`);
    if(res.ok) faculties.value = await res.json();
  } catch(e) { console.error('Error fetching faculties', e); }
});

const fetchSpecializations = async () => {
  selectedSpec.value = "";
  modules.value = [];
  try {
    const res = await fetch(`${apiUrl}/api/academic/specializations?facultyId=${selectedFaculty.value}`);
    if(res.ok) specializations.value = await res.json();
  } catch(e) { console.error('Error', e); }
};

const fetchModules = async () => {
  if (!allSelected.value) return;
  loadingModules.value = true;
  modules.value = [];
  try {
    const params = new URLSearchParams({
      facultyId: selectedFaculty.value,
      specId: selectedSpec.value,
      year: selectedYear.value,
      semester: selectedSemester.value
    });
    const res = await fetch(`${apiUrl}/api/academic/modules?${params}`);
    if(res.ok) modules.value = await res.json();
  } catch(e) {
    console.error('Error', e);
  } finally {
    loadingModules.value = false;
  }
};
</script>
