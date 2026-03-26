<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />

    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6">
      
      <!-- left col: Structure Management -->
      <div class="space-y-6">
        
        <!-- Add Faculty -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Faculty</h3>
          <form @submit.prevent="addFaculty" class="flex gap-4">
            <input v-model="newFacultyName" required placeholder="Faculty Name" type="text" class="flex-grow rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
            <button type="submit" :disabled="submittingFac" class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
              Add
            </button>
          </form>
        </div>

        <!-- Add Specialization -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Specialization</h3>
          <form @submit.prevent="addSpecialization" class="space-y-4">
            <select v-model="specFacultyId" required class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
              <option value="" disabled>Select Faculty</option>
              <option v-for="f in faculties" :key="f._id" :value="f._id">{{ f.name }}</option>
            </select>
            <div class="flex gap-4">
              <input v-model="newSpecName" required placeholder="Specialization Name" type="text" class="flex-grow rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
              <button type="submit" :disabled="submittingSpec" class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                Add
              </button>
            </div>
          </form>
        </div>

        <!-- Add Module -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Module</h3>
          <form @submit.prevent="addModule" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <select v-model="modFacultyId" @change="fetchSpecForMod" required class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
                <option value="" disabled>Select Faculty</option>
                <option v-for="f in faculties" :key="f._id" :value="f._id">{{ f.name }}</option>
              </select>
              <select v-model="modSpecId" required :disabled="!modFacultyId" class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input disabled:opacity-50">
                <option value="" disabled>Select Specialization</option>
                <option v-for="s in filteredSpecs" :key="s._id" :value="s._id">{{ s.name }}</option>
              </select>
            </div>
            
            <div class="grid grid-cols-2 gap-4">
              <select v-model="modYear" required class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
                <option value="" disabled>Year</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
              </select>
              <select v-model="modSemester" required class="w-full rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
                <option value="" disabled>Semester</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </select>
            </div>

            <div class="flex gap-4">
              <input v-model="newModName" required placeholder="Module Name" type="text" class="flex-grow rounded-lg border border-stroke bg-transparent py-2.5 px-4 outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-form-strokedark dark:bg-form-input">
              <button type="submit" :disabled="submittingMod" class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors disabled:opacity-50">
                Add
              </button>
            </div>
          </form>
        </div>

        <!-- Manage Modules -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Manage Modules</h3>
          <div v-if="modulesList.length === 0" class="text-sm text-gray-500">No modules found.</div>
          <div v-else class="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            <div v-for="m in modulesList" :key="m._id" class="flex justify-between items-center p-3 border border-gray-100 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white text-sm">{{ m.name }}</h4>
                <p class="text-xs text-brand-500">Year {{ m.year }}, Sem {{ m.semester }}</p>
              </div>
              <button @click="deleteModule(m._id)" class="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-md transition-colors text-xs font-medium">Delete</button>
            </div>
          </div>
        </div>

      </div>

      <!-- right col: Helper Approvals -->
      <div class="space-y-6 flex flex-col h-full">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
          Pending Helper Applications
          <span class="bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 py-1 px-3 rounded-full text-sm">{{ pendingHelpers.length }}</span>
        </h3>
        
        <div v-if="loadingHelpers" class="flex justify-center py-10">
          <svg class="animate-spin h-6 w-6 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
        </div>
        
        <div v-else-if="pendingHelpers.length === 0" class="text-center py-10 text-gray-500 dark:text-gray-400">
          No pending applications.
        </div>

        <div v-else class="space-y-4">
          <div v-for="h in pendingHelpers" :key="h._id" class="p-4 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <div class="flex justify-between items-start mb-2">
               <div>
                  <h4 class="font-bold text-gray-900 dark:text-white">{{ h.name }} <span class="text-xs font-normal text-gray-500">({{ h.student_id }})</span></h4>
                  <p class="text-xs text-brand-500 font-medium mb-1">Year {{ h.year_of_study }}</p>
                  <p v-if="h.contact_no" class="text-xs text-gray-600 dark:text-gray-400 font-mono">Contact: {{ h.contact_no }}</p>
               </div>
               <div class="flex gap-2">
                 <button @click="updateStatus(h._id, 'approved')" class="p-1.5 bg-green-100 text-green-600 hover:bg-green-200 rounded-md transition-colors" title="Approve">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                 </button>
                 <button @click="updateStatus(h._id, 'rejected')" class="p-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-md transition-colors" title="Reject">
                   <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
               </div>
            </div>
            <div class="text-xs bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 mb-2 font-mono">
              Target Module ID: {{ h.module_id }} 
              <span v-if="h.moduleDetails" class="text-gray-500">({{ h.moduleDetails.name }})</span>
            </div>
            <p class="text-sm text-gray-600 dark:text-gray-400">{{ h.introduction }}</p>
          </div>
        </div>
      
        <!-- Accepted Helpers -->
        <div class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 h-fit">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center justify-between">
            Accepted Helpers
            <span class="bg-brand-100 text-brand-600 dark:bg-brand-500/20 dark:text-brand-400 py-1 px-3 rounded-full text-sm">{{ acceptedHelpers.length }}</span>
          </h3>
          <div v-if="acceptedHelpers.length === 0" class="text-center py-10 text-gray-500 dark:text-gray-400">
            No accepted helpers.
          </div>
          <div v-else class="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <div v-for="h in acceptedHelpers" :key="h._id" class="p-4 border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 rounded-lg flex justify-between items-center">
              <div>
                <h4 class="font-bold text-gray-900 dark:text-white">{{ h.name }} <span class="text-xs font-normal text-gray-500">({{ h.student_id }})</span></h4>
                <div class="text-xs bg-white dark:bg-gray-800 px-2 py-1 inline-block rounded border border-gray-200 dark:border-gray-700 mt-1 font-mono">
                  Module: {{ h.moduleDetails?.name || h.module_id }}
                </div>
              </div>
              <button @click="deleteHelper(h._id)" class="px-3 py-1.5 bg-red-100 text-red-600 hover:bg-red-200 rounded-md transition-colors text-sm font-medium">
                Delete
              </button>
            </div>
          </div>
        </div>

      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";

const currentPageTitle = ref("Academic Admin");
const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

// Structure Data
const faculties = ref([]);
const filteredSpecs = ref([]);

// Form Bindings
const newFacultyName = ref("");
const specFacultyId = ref("");
const newSpecName = ref("");

const modFacultyId = ref("");
const modSpecId = ref("");
const modYear = ref("");
const modSemester = ref("");
const newModName = ref("");

// Load states
const loadingHelpers = ref(false);
const submittingFac = ref(false);
const submittingSpec = ref(false);
const submittingMod = ref(false);

const pendingHelpers = ref([]);
const acceptedHelpers = ref([]);
const modulesList = ref([]);

onMounted(() => {
  fetchFaculties();
  fetchPendingHelpers();
  fetchAcceptedHelpers();
  fetchAllModules();
});

const fetchFaculties = async () => {
  try {
    const res = await fetch(`${apiUrl}/api/academic/faculties`);
    if(res.ok) faculties.value = await res.json();
  } catch(e) { console.error(e); }
};

const fetchSpecForMod = async () => {
  modSpecId.value = "";
  filteredSpecs.value = [];
  try {
    const res = await fetch(`${apiUrl}/api/academic/specializations?facultyId=${modFacultyId.value}`);
    if(res.ok) filteredSpecs.value = await res.json();
  } catch(e) { console.error(e); }
};

const fetchPendingHelpers = async () => {
  loadingHelpers.value = true;
  try {
    const res = await fetch(`${apiUrl}/api/academic/helpers/pending`);
    if(res.ok) pendingHelpers.value = await res.json();
  } catch(e) { console.error(e); }
  loadingHelpers.value = false;
};

// Handlers
const addFaculty = async () => {
  submittingFac.value = true;
  try {
    const res = await fetch(`${apiUrl}/api/academic/faculty`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newFacultyName.value })
    });
    if(res.ok) {
      newFacultyName.value = "";
      fetchFaculties();
    }
  } catch(e) { console.error(e); }
  submittingFac.value = false;
};

const addSpecialization = async () => {
  submittingSpec.value = true;
  try {
    const res = await fetch(`${apiUrl}/api/academic/specialization`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newSpecName.value, faculty_id: specFacultyId.value })
    });
    if(res.ok) {
      newSpecName.value = "";
      specFacultyId.value = "";
    }
  } catch(e) { console.error(e); }
  submittingSpec.value = false;
};

const addModule = async () => {
  submittingMod.value = true;
  try {
    const res = await fetch(`${apiUrl}/api/academic/module`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newModName.value,
        faculty_id: modFacultyId.value,
        spec_id: modSpecId.value,
        year: modYear.value,
        semester: modSemester.value
      })
    });
    if(res.ok) {
      newModName.value = "";
      modYear.value = "";
      modSemester.value = "";
      modSpecId.value = "";
      modFacultyId.value = "";
    }
  } catch(e) { console.error(e); }
  submittingMod.value = false;
};

const updateStatus = async (id, status) => {
  try {
    const res = await fetch(`${apiUrl}/api/academic/helpers/${id}/status`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if(res.ok) {
      fetchPendingHelpers();
      fetchAcceptedHelpers();
    }
  } catch(e) { console.error(e); }
};

const fetchAcceptedHelpers = async () => {
  try {
    const res = await fetch(`${apiUrl}/api/academic/helpers/accepted`);
    if(res.ok) acceptedHelpers.value = await res.json();
  } catch(e) { console.error(e); }
};

const fetchAllModules = async () => {
  try {
    const res = await fetch(`${apiUrl}/api/academic/modules`);
    if(res.ok) modulesList.value = await res.json();
  } catch(e) { console.error(e); }
};

const deleteModule = async (id) => {
  if(!confirm("Are you sure you want to delete this module?")) return;
  try {
    const res = await fetch(`${apiUrl}/api/academic/module/${id}`, { method: 'DELETE' });
    if(res.ok) fetchAllModules();
  } catch(e) { console.error(e); }
};

const deleteHelper = async (id) => {
  if(!confirm("Are you sure you want to delete this helper?")) return;
  try {
    const res = await fetch(`${apiUrl}/api/academic/helpers/${id}`, { method: 'DELETE' });
    if(res.ok) fetchAcceptedHelpers();
  } catch(e) { console.error(e); }
};
</script>
