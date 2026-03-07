<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      
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

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="helper in helpers" 
          :key="helper._id || helper.id"
          class="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden flex flex-col transition-transform hover:-translate-y-1 hover:shadow-md"
        >
          <!-- profile picture area -->
          <div class="h-32 bg-brand-500/10 dark:bg-brand-500/20 w-full relative">
             <div class="absolute -bottom-10 left-1/2 transform -translate-x-1/2">
                <img :src="helper.profile_picture || helper.profilePicture || '/images/user/user-01.jpg'" :alt="helper.name || `User ${helper.student_id}`" class="w-20 h-20 rounded-full border-4 border-white dark:border-gray-800 object-cover" />
             </div>
          </div>
          
          <div class="pt-14 pb-6 px-6 flex-grow flex flex-col items-center text-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-1">{{ helper.name || `Helper ${helper.student_id}` }}</h3>
            
            <div class="flex items-center gap-1.5 mb-3">
               <span :class="[
                 'w-2 h-2 rounded-full', 
                 (helper.availability_status || helper.availability) === 'active' || (helper.availability_status || helper.availability) === 'Available' ? 'bg-green-500' : 'bg-orange-500'
               ]"></span>
               <span class="text-sm font-medium capitalize" :class="(helper.availability_status || helper.availability) === 'active' || (helper.availability_status || helper.availability) === 'Available' ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'">
                 {{ helper.availability_status || helper.availability || 'Unknown' }}
               </span>
            </div>

            <p class="text-gray-500 dark:text-gray-400 text-sm mb-5 line-clamp-3">
              {{ helper.bio }}
            </p>

            <router-link :to="`/connect-u/mental-health/${helper._id || helper.id}`" class="mt-auto w-full py-2.5 px-4 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700/50 dark:hover:bg-gray-700 text-brand-600 dark:text-brand-400 font-medium text-sm rounded-lg border border-gray-200 dark:border-gray-600 transition-colors">
              View Profile
            </router-link>
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

const currentPageTitle = ref("Mental Health Support Providers");

const helpers = ref([]);
const loading = ref(true);
const error = ref(null);

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

onMounted(async () => {
  try {
    // Attempt to fetch from API
    // Using a try/catch so if backend isn't ready we fall back to mock data
    const response = await fetch(`${apiUrl}/api/psychological-helpers`);
    if (response.ok) {
      const data = await response.json();
      helpers.value = data;
    } else {
      throw new Error('API fetch failed');
    }
  } catch (err) {
    console.warn('API unavailable, falling back to mock data', err);
    // Fallback to mock data for demonstration
    helpers.value = [
      {
        id: 1,
        name: 'Dr. Sarah Jenkins',
        bio: 'Clinical Psychologist with 10 years of experience specializing in diverse student issues including stress management, anxiety, and depression.',
        profilePicture: 'https://i.pravatar.cc/150?img=1',
        availability: 'Available'
      },
      {
        id: 2,
        name: 'Michael Chang',
        bio: 'Licensed Therapist focusing on cognitive behavioral therapy and mindfulness approaches for academic anxiety.',
        profilePicture: 'https://i.pravatar.cc/150?img=11',
        availability: 'Busy'
      },
      {
        id: 3,
        name: 'Dr. Emily Foster',
        bio: 'Specialist in career counseling, life transitions, and mental well-being for college students.',
        profilePicture: 'https://i.pravatar.cc/150?img=5',
        availability: 'Available'
      },
      {
        id: 4,
        name: 'James Wilson',
        bio: 'Experienced counselor helping students work through relationship issues and develop solid coping mechanisms.',
        profilePicture: 'https://i.pravatar.cc/150?img=12',
        availability: 'Available'
      }
    ];
  } finally {
    loading.value = false;
  }
});
</script>
