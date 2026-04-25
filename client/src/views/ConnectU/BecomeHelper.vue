<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]">
      <h3 class="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90">
        Apply to become a Psychological Helper
      </h3>
      
      <form @submit.prevent="submitForm" class="space-y-5">
        <div v-if="error" class="text-red-500 bg-red-100 dark:bg-red-500/10 dark:text-red-400 p-3 rounded-lg text-sm">{{ error }}</div>
        <div v-if="success" class="text-green-600 bg-green-100 dark:bg-green-500/10 dark:text-green-400 p-3 rounded-lg text-sm">{{ success }}</div>

        <!-- Profile Picture -->
        <!-- <div>
          <label class="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">Profile Picture (Optional)</label>
          <input @change="handleFileUpload" type="file" accept="image/*" class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:text-white/90" />
        </div> -->
        <!-- Name -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">Name</label>
          <input v-model="form.name" type="text" required class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:text-white/90" placeholder="Enter your full name" />
        </div>
        <!-- Student ID -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">Student ID</label>
          <input v-model="form.student_id" type="text" required pattern=".{10}" maxlength="10" minlength="10" title="Student ID must be exactly 10 characters" class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:text-white/90" placeholder="e.g. IT21000000" />
        </div>
        <!-- Year of Study -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">Year of Study</label>
          <select v-model="form.year_of_study" required class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:text-white/90">
             <option value="" disabled>Select Year</option>
             <option value="1st Year">1st Year</option>
             <option value="2nd Year">2nd Year</option>
             <option value="3rd Year">3rd Year</option>
             <option value="4th Year">4th Year</option>
             <option value="Alumni">Alumni</option>
          </select>
        </div>
        <!-- Contact No -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">Contact Number</label>
          <input v-model="form.contact_no" type="tel" required pattern="\d{10}" maxlength="10" minlength="10" title="Phone number must be exactly 10 digits" class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:text-white/90" placeholder="e.g. 0712345678" />
        </div>
        <!-- Bio -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">Short Bio</label>
          <textarea v-model="form.bio" required rows="3" class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:text-white/90" placeholder="A brief introduction about yourself that will be shown on your profile"></textarea>
        </div>
        <!-- Expertise & Specialties -->
        <div>
          <label class="mb-3 block text-sm font-medium text-gray-800 dark:text-white/90">Expertise & Specialties</label>
          <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            <label v-for="spec in availableSpecialties" :key="spec" class="flex items-center gap-2 text-sm text-gray-800 dark:text-white/90 cursor-pointer hover:opacity-80 transition-opacity">
              <input type="checkbox" :value="spec" v-model="form.specialties" class="w-4 h-4 text-brand-500 border-gray-300 rounded focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800" />
              <span>{{ spec }}</span>
            </label>
          </div>
          <p class="mt-2 text-xs text-brand-500" v-if="form.specialties.length === 0">Please select at least one specialty.</p>
        </div>
        <!-- Why Select You -->
        <div>
          <label class="mb-2 block text-sm font-medium text-gray-800 dark:text-white/90">Why should we select you to this position?</label>
          <textarea v-model="form.why_select_you" required rows="4" class="w-full rounded-lg border border-gray-200 bg-transparent px-4 py-3 text-sm text-gray-800 outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 dark:border-gray-800 dark:text-white/90" placeholder="Explain your motivations, relevant skills, and how you can help students..."></textarea>
        </div>
        <!-- Submit -->
        <button v-if="!hasApplication" type="submit" :disabled="loading" class="w-full rounded-lg bg-brand-500 px-4 py-3 text-sm font-medium text-white transition hover:bg-brand-600 disabled:opacity-50 mt-4 shadow-sm shadow-brand-500/20">
          {{ loading ? 'Submitting...' : 'Submit Application' }}
        </button>
        <button v-else type="button" disabled class="w-full rounded-lg bg-gray-400 px-4 py-3 text-sm font-medium text-white opacity-50 mt-4 shadow-sm cursor-not-allowed">
          Application Already Submitted
        </button>
      </form>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import PageBreadcrumb from '@/components/common/PageBreadcrumb.vue';
import { useRouter } from 'vue-router';

const currentPageTitle = ref('Become a Helper');
const router = useRouter();

const form = ref({
  name: '',
  student_id: '',
  year_of_study: '',
  contact_no: '',
  bio: '',
  specialties: [],
  why_select_you: '',
  auth_user_id: '',
  profile_picture: ''
});

const availableSpecialties = [
  'Stress Management', 
  'Academic Anxiety', 
  'Depression Counseling', 
  'Mindfulness & Medication', 
  'Career Guidance', 
  'Relationship Counseling', 
  'Trauma & Recovery', 
  'Time Management', 
  'Substance Abuse Support',
  'Intercultural Adjustment'
];

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.profile_picture = e.target.result;
  };
  reader.readAsDataURL(file);
};

const loading = ref(false);
const error = ref('');
const success = ref('');
const hasApplication = ref(false);

const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

onMounted(async () => {
    // try to get student_id from auth if possible
    const userStr = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
    if(userStr) {
        try {
            const user = JSON.parse(userStr);
            form.value.auth_user_id = user.id || user._id || '';

            // Check if application exists
            const res = await fetch(`${apiUrl}/api/p-helper/status/user/${form.value.auth_user_id}`);
            if(res.ok) {
               const data = await res.json();
               if(data.hasApplication) {
                  hasApplication.value = true;
                  error.value = `You already have an application. Current status: ${data.status}`;
               }
            }
        } catch(e) {}
    }
});

const submitForm = async () => {
  if (form.value.specialties.length === 0) {
    error.value = "Please select at least one specialty.";
    return;
  }
  
  loading.value = true;
  error.value = '';
  success.value = '';
  try {
    const res = await fetch(`${apiUrl}/api/p-helper`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form.value,
        availability_status: 'offline',
        onboarding_status: 'pending' // Just to make sure it's pending
      })
    });
    
    if(!res.ok) {
       const data = await res.json();
       throw new Error(data.errors ? data.errors.join(', ') : 'Application failed');
    }
    
    success.value = "Your application has been submitted and is pending admin approval.";
    setTimeout(() => {
        router.push('/connect-u/mental-health');
    }, 2000);

  } catch (err) {
    error.value = err.message || 'An error occurred';
  } finally {
    loading.value = false;
  }
};
</script>
