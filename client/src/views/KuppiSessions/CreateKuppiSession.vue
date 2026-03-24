<template>
  <AdminLayout>
    <div class="p-6">
      <!-- Page Header with Back Button -->
      <div class="mb-8">
        <button
          id="btn-back-from-create"
          @click="router.push('/kuppi-sessions')"
          class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 mb-6 transition-colors"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Browse Sessions
        </button>
        
        <div>
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Create a Kuppi Session</h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Start a peer-tutoring session and invite other students to join</p>
        </div>
      </div>

      <!-- Form Container -->
      <div class="max-w-2xl">
        <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm p-6 md:p-8">
          <!-- Error Banner -->
          <div
            v-if="formError"
            class="mb-6 px-4 py-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm dark:bg-error-900/20 dark:border-error-800 dark:text-error-400"
          >
            {{ formError }}
          </div>

          <!-- Form -->
          <form @submit.prevent="handleSubmit" class="space-y-6">
            <!-- Title -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Session Title <span class="text-error-500">*</span>
              </label>
              <input
                id="create-kuppi-title"
                v-model="form.title"
                type="text"
                placeholder="e.g. Data Structures Revision Session"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                required
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Give your session a clear, descriptive title</p>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Description <span class="text-error-500">*</span>
              </label>
              <textarea
                id="create-kuppi-description"
                v-model="form.description"
                rows="4"
                placeholder="Describe what topics will be covered, learning objectives, or any important details..."
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition resize-none"
                required
              ></textarea>
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Help other students understand what they'll learn</p>
            </div>

            <!-- Subject / Module -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Subject / Module <span class="text-error-500">*</span>
              </label>
              <input
                id="create-kuppi-subject"
                v-model="form.subject"
                type="text"
                placeholder="e.g. CS2020 — Algorithms & Data Structures"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                required
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter the course code and name</p>
            </div>

            <!-- Year and Semester Row -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Year <span class="text-error-500">*</span>
                </label>
                <input
                  id="create-kuppi-year"
                  v-model="form.year"
                  type="text"
                  placeholder="e.g. Year 2"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Semester <span class="text-error-500">*</span>
                </label>
                <input
                  id="create-kuppi-semester"
                  v-model="form.semester"
                  type="text"
                  placeholder="e.g. Semester 1"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <!-- Date, Time, and Duration Row -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Date <span class="text-error-500">*</span>
                </label>
                <input
                  id="create-kuppi-date"
                  v-model="form.date"
                  type="date"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  :min="todayDate"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Start Time <span class="text-error-500">*</span>
                </label>
                <input
                  id="create-kuppi-time"
                  v-model="form.time"
                  type="time"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Duration <span class="text-error-500">*</span>
                </label>
                <input
                  id="create-kuppi-duration"
                  v-model="form.duration"
                  type="text"
                  placeholder="e.g. 1.5 hours"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <!-- Microsoft Teams Link -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Microsoft Teams Meeting Link <span class="text-error-500">*</span>
              </label>
              <input
                id="create-kuppi-teams-link"
                v-model="form.teamsLink"
                type="url"
                placeholder="https://teams.microsoft.com/l/meetup-join/..."
                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                required
              />
              <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Participants will use this link to join the session</p>
            </div>

            <!-- Form Actions -->
            <div class="flex justify-between items-center gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
              <button
                type="button"
                @click="router.push('/kuppi-sessions')"
                class="px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-create-kuppi-submit"
                type="submit"
                :disabled="submitting"
                class="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                <svg v-if="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                <span>{{ submitting ? 'Creating Session...' : 'Create Session' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import AdminLayout from '@/components/layout/AdminLayout.vue';
import { useKuppiSessionsStore } from '@/store/kuppiSessions';

const router = useRouter();
const { error, createKuppiSession } = useKuppiSessionsStore();

const submitting = ref(false);
const formError = ref<string | null>(null);

const blankForm = () => ({
  title: '',
  description: '',
  subject: '',
  year: '',
  semester: '',
  date: '',
  time: '',
  duration: '',
  teamsLink: '',
});

const form = reactive(blankForm());

const todayDate = computed(() => {
  const today = new Date();
  return today.toISOString().split('T')[0];
});

const readAuthUser = () => {
  const raw = localStorage.getItem('authUser') || sessionStorage.getItem('authUser');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const handleSubmit = async () => {
  if (!form.title.trim() || !form.description.trim() || !form.subject.trim() || 
      !form.year.trim() || !form.semester.trim() || !form.date || 
      !form.time || !form.duration.trim() || !form.teamsLink.trim()) {
    formError.value = 'All fields are required';
    console.warn('[CreateKuppiSession] Validation failed - missing fields');
    return;
  }

  const selectedDate = new Date(form.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (selectedDate < today) {
    formError.value = 'Session date cannot be in the past';
    console.warn('[CreateKuppiSession] Date is in the past:', form.date);
    return;
  }

  try {
    new URL(form.teamsLink);
  } catch {
    formError.value = 'Please enter a valid URL for the Teams link';
    console.warn('[CreateKuppiSession] Invalid Teams link:', form.teamsLink);
    return;
  }

  submitting.value = true;
  formError.value = null;

  const authUser = readAuthUser();
  console.log('[CreateKuppiSession] Auth user:', authUser);
  
  if (!authUser) {
    formError.value = 'You must be logged in to create a session';
    submitting.value = false;
    return;
  }

  const payload = {
    ...form,
    createdBy: authUser?.username ?? 'Unknown',
  };
  
  console.log('[CreateKuppiSession] Submitting payload:', payload);
  const result = await createKuppiSession(payload);
  console.log('[CreateKuppiSession] API response:', result);
  console.log('[CreateKuppiSession] Store error:', error.value);

  submitting.value = false;

  if (result) {
    console.log('[CreateKuppiSession] Success! Redirecting to:', `/kuppi-sessions/${result._id}`);
    await router.push(`/kuppi-sessions/${result._id}`);
  } else {
    formError.value = error.value ?? 'Failed to create session. Please try again.';
    console.error('[CreateKuppiSession] Failed to create session:', error.value);
  }
};
</script>

<style scoped>
input:focus,
textarea:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 0 0 2px rgba(59, 130, 246, 1);
}
</style>
