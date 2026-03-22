<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    
    <div v-if="loading" class="flex justify-center py-10">
      <!-- Spinner -->
      <svg class="animate-spin h-8 w-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </div>

    <div v-else-if="error" class="text-red-500 text-center py-5 bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700">
      {{ error }}
    </div>

    <div v-else-if="helper" class="grid grid-cols-1 xl:grid-cols-3 gap-6">
      
      <!-- Profile Card -->
      <div class="xl:col-span-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
        <div class="h-32 bg-brand-500/10 dark:bg-brand-500/20 w-full relative">
           <div class="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
              <img :src="helper.profile_picture || helper.profilePicture || '/images/user/user-01.jpg'" :alt="helper.name || `User ${helper.student_id}`" class="w-24 h-24 rounded-full border-4 border-white dark:border-gray-800 object-cover" />
           </div>
        </div>
        
        <div class="pt-16 pb-6 px-6 text-center">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-1">{{ helper.name || `Helper ${helper.student_id}` }}</h2>
          <p class="text-sm text-brand-500 mb-4 font-medium">Psychological Helper</p>
          
          <div class="flex items-center justify-center gap-1.5 mb-6">
             <span :class="[
               'w-2 h-2 rounded-full', 
               (helper.availability_status || helper.availability) === 'active' || (helper.availability_status || helper.availability) === 'Available' ? 'bg-green-500' : 'bg-orange-500'
             ]"></span>
             <span class="text-sm font-medium capitalize" :class="(helper.availability_status || helper.availability) === 'active' || (helper.availability_status || helper.availability) === 'Available' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'">
               {{ helper.availability_status || helper.availability || 'Unknown' }}
             </span>
          </div>

          <div class="flex gap-3 justify-center border-t border-gray-100 dark:border-gray-700 pt-6">
             <button v-if="!isSelf" @click="startConsultation" class="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 w-full shadow-sm shadow-brand-500/20">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
               Consult
             </button>
          </div>
        </div>
      </div>

      <!-- About & Details -->
      <div class="xl:col-span-2 space-y-6">
        <div class="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-sm">
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">About Me</h3>
          <p class="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
            {{ helper.bio }}
          </p>

          <div class="mt-8 border-t border-gray-100 dark:border-gray-700 pt-8">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">Expertise & Specialties</h3>
            <div class="flex flex-wrap gap-2">
               <span class="px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold rounded-full">Stress Management</span>
               <span class="px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold rounded-full">Academic Anxiety</span>
               <span class="px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold rounded-full">Depression Counseling</span>
               <span class="px-3 py-1.5 bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 text-xs font-semibold rounded-full">Mindfulness</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";

const route = useRoute();
const router = useRouter();
const currentPageTitle = ref("Helper Profile");

const helper = ref(null);
const loading = ref(true);
const error = ref(null);
const isSelf = ref(false);

const checkIsSelf = () => {
    if (!helper.value) return;
    const userStr = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    if (userStr) {
        try {
            const u = JSON.parse(userStr);
            const loggedInId = String(u.id || u._id);
            const loggedInUsername = String(u.username);
            
            isSelf.value = 
                String(helper.value.auth_user_id) === loggedInId || 
                String(helper.value.student_id) === loggedInId ||
                String(helper.value.student_id) === loggedInUsername;
        } catch(e) {}
    }
};

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

onMounted(async () => {
  const { id } = route.params;
  
  try {
    const response = await fetch(`${apiUrl}/api/p-helper/${id}`);
    if (response.ok) {
      const data = await response.json();
      helper.value = data;
    } else {
      throw new Error(`API fetch failed with status: ${response.status}`);
    }
  } catch (err) {
    console.warn('API unavailable, falling back to mock data', err);
    // Mock the single fetch based on ID
    const mockData = [
      {
        id: 2,
        name: 'Michael Chang',
        bio: 'Licensed Therapist focusing on cognitive behavioral therapy and mindfulness approaches for academic anxiety. Known for practical strategies and empathetic approach.',
        profilePicture: 'https://i.pravatar.cc/150?img=11',
        availability: 'Busy'
      },
      {
        id: 3,
        name: 'Dr. Emily Foster',
        bio: 'Specialist in career counseling, life transitions, and mental well-being for college students. Helps students navigate major life changes safely.',
        profilePicture: 'https://i.pravatar.cc/150?img=5',
        availability: 'Available'
      },
      {
        id: 4,
        name: 'James Wilson',
        bio: 'Experienced counselor helping students work through relationship issues and develop solid coping mechanisms for dealing with heavy coursework and exams.',
        profilePicture: 'https://i.pravatar.cc/150?img=12',
        availability: 'Available'
      }
    ];

    const match = mockData.find(h => String(h.id) === String(id));
    if (match) {
      helper.value = match;
    } else {
      error.value = "Helper not found";
    }
  } finally {
    checkIsSelf();
    loading.value = false;
  }
});

const startConsultation = async () => {
    const userStr = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    let studentId = '';
    if(userStr) {
        try { 
            const u = JSON.parse(userStr); 
            studentId = u.id || u._id;
        } catch(e){}
    }
    
    if (!studentId) {
        let mockId = localStorage.getItem('mockUserId');
        if (!mockId) {
            mockId = `USER-${Date.now()}`;
            localStorage.setItem('mockUserId', mockId);
        }
        studentId = mockId;
    }

    // Ensure we are using the _id for the helper
    const payload = {
       student_id: studentId,
       helper_id: helper.value._id || helper.value.id
    };

    try {
        const res = await fetch(`${apiUrl}/api/chat/conversations`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(payload)
        });
        if(res.ok) {
           const convo = await res.json();
           router.push(`/connect-u/chat/${convo._id}`);
        } else {
           alert("Failed to start consultation");
        }
    } catch(err) {
        alert("Error starting consultation: " + err.message);
    }
};
</script>
