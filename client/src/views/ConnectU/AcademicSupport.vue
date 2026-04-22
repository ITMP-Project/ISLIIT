<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-6">
      
      <!-- Selection Flow -->
      <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Find Modules</h3>
        
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
