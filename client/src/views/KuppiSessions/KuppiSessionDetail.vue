<template>
  <AdminLayout>
    <div class="p-6">
      <!-- Back Button -->
    <button
      id="btn-back-kuppi"
      @click="router.push('/kuppi-sessions')"
      class="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-brand-600 dark:hover:text-brand-400 mb-6 transition-colors"
    >
      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
      Back to Kuppi Sessions
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64 text-gray-400">
      <svg class="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>

    <!-- Error State -->
    <div
      v-else-if="error"
      class="px-4 py-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm dark:bg-error-900/20"
    >
      {{ error }}
    </div>

    <!-- Not Found -->
    <div
      v-else-if="!session"
      class="flex flex-col items-center justify-center h-64 text-gray-400"
    >
      <p class="font-medium">Session not found.</p>
    </div>

    <!-- Session Detail Card -->
    <div v-else class="max-w-2xl">
      <div class="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm overflow-hidden">
        <!-- Top accent bar -->
        <div class="h-2 bg-gradient-to-r from-brand-400 to-brand-600"></div>

        <div class="p-6 md:p-8">
          <!-- Status + Title -->
          <div class="mb-5">
            <span class="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400 mb-3">
              <span class="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse"></span>
              {{ session.status }}
            </span>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white leading-snug">
              {{ session.title }}
            </h1>
            <p class="text-brand-500 dark:text-brand-400 font-medium mt-1">
              {{ session.subject }}
            </p>
          </div>

          <!-- Divider -->
          <hr class="border-gray-100 dark:border-gray-700 mb-5" />

          <!-- Description -->
          <div class="mb-6">
            <h2 class="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
              About this session
            </h2>
            <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {{ session.description }}
            </p>
          </div>

          <!-- Meta Grid -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <!-- Date -->
            <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div class="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 dark:text-gray-500">Date</p>
                <p class="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">{{ formatDate(session.date) }}</p>
              </div>
            </div>

            <!-- Time -->
            <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div class="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 dark:text-gray-500">Time</p>
                <p class="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">{{ session.time }}</p>
              </div>
            </div>

            <!-- Created By -->
            <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div class="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 dark:text-gray-500">Created by</p>
                <p class="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">{{ session.createdBy }}</p>
              </div>
            </div>

            <!-- Platform -->
            <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div class="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 dark:text-gray-500">Platform</p>
                <p class="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">Microsoft Teams</p>
              </div>
            </div>

            <!-- Participants -->
            <div class="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
              <div class="p-2 rounded-lg bg-brand-50 dark:bg-brand-900/30 text-brand-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.856-1.487M15 10a3 3 0 11-6 0 3 3 0 016 0zM6 20a7 7 0 1114 0" />
                </svg>
              </div>
              <div>
                <p class="text-xs text-gray-400 dark:text-gray-500">Registered</p>
                <p class="text-sm font-semibold text-gray-800 dark:text-white mt-0.5">{{ sessionParticipants[session._id!] ?? 0 }} students</p>
              </div>
            </div>
          </div>

          <!-- Join Button -->
          <button
            id="btn-join-session"
            @click="joinSession"
            class="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors shadow-sm hover:shadow-md"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.9L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            Join Session on Microsoft Teams
          </button>

          <!-- Register Button -->
          <button
            id="btn-register-session"
            @click="handleRegister"
            :disabled="registering || userRegistrations[session._id!] === true"
            :class="[
              'w-full py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2 mt-3',
              userRegistrations[session._id!]
                ? 'bg-success-50 text-success-700 dark:bg-success-900/20 dark:text-success-400 cursor-default'
                : 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm hover:shadow-md'
            ]"
          >
            <svg v-if="registering" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <svg v-else-if="userRegistrations[session._id!]" class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
            {{ userRegistrations[session._id!] ? "Successfully Registered" : "Register for Session" }}
          </button>
        </div>
      </div>
    </div>

    <!-- ─── Registration Modal ─── -->
    <transition name="fade">
      <div
        v-if="showRegistrationModal"
        class="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="closeRegistrationModal"
      >
        <div class="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Register for Session</h2>
            <button
              @click="closeRegistrationModal"
              class="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Form -->
          <form @submit.prevent="handleRegistrationFormSubmit" class="px-6 py-5 space-y-4">
            <!-- Form Error -->
            <div
              v-if="registrationFormError"
              class="px-4 py-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm dark:bg-error-900/20"
            >
              {{ registrationFormError }}
            </div>

            <!-- Student ID -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Student ID <span class="text-error-500">*</span>
              </label>
              <input
                v-model="registrationForm.studentId"
                type="text"
                placeholder="e.g. ST123456"
                class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                required
              />
            </div>

            <!-- Year -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Year <span class="text-error-500">*</span>
              </label>
              <input
                v-model="registrationForm.year"
                type="text"
                placeholder="e.g. Year 2"
                class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                required
              />
            </div>

            <!-- Semester -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Semester <span class="text-error-500">*</span>
              </label>
              <input
                v-model="registrationForm.semester"
                type="text"
                placeholder="e.g. Semester 1"
                class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                required
              />
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="closeRegistrationModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="registrationFormSubmitting"
                class="px-5 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                <svg v-if="registrationFormSubmitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {{ registrationFormSubmitting ? "Registering..." : "Register" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import type { MongoKuppiSession } from "@/ts/mongo";
import { useKuppiSessionsStore } from "@/store/kuppiSessions";

const route = useRoute();
const router = useRouter();

const {
  loading,
  error,
  getKuppiSession,
  registerForSession,
  checkUserRegistration,
  getSessionParticipantCount,
  sessionParticipants,
  userRegistrations,
  registrationError,
} = useKuppiSessionsStore();

const session = ref<MongoKuppiSession | null>(null);
const registering = ref(false);

// Registration modal state
const showRegistrationModal = ref(false);
const registrationFormError = ref<string | null>(null);
const registrationFormSubmitting = ref(false);

const blankRegistrationForm = () => ({
  studentId: "",
  year: "",
  semester: "",
});

const registrationForm = reactive(blankRegistrationForm());

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const readAuthUser = () => {
  const raw =
    localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const joinSession = () => {
  if (session.value?.teamsLink) {
    window.open(session.value.teamsLink, "_blank", "noopener,noreferrer");
  }
};

const handleRegister = async () => {
  const authUser = readAuthUser();
  if (!authUser) {
    alert("Please log in to register for a session");
    return;
  }

  if (!session.value?._id) return;

  showRegistrationModal.value = true;
  registrationFormError.value = null;
  Object.assign(registrationForm, blankRegistrationForm());
};

const closeRegistrationModal = () => {
  showRegistrationModal.value = false;
  registrationFormError.value = null;
  Object.assign(registrationForm, blankRegistrationForm());
};

const handleRegistrationFormSubmit = async () => {
  if (!registrationForm.studentId.trim() || !registrationForm.year.trim() || !registrationForm.semester.trim()) {
    registrationFormError.value = "All fields are required";
    return;
  }

  if (!session.value?._id) return;

  const authUser = readAuthUser();
  if (!authUser) return;

  registrationFormSubmitting.value = true;
  registrationFormError.value = null;

  const success = await registerForSession(
    session.value._id,
    authUser._id,
    registrationForm.studentId.trim(),
    registrationForm.year.trim(),
    registrationForm.semester.trim()
  );

  registrationFormSubmitting.value = false;

  if (success) {
    closeRegistrationModal();
    alert("Successfully registered for the session!");
  } else {
    registrationFormError.value = registrationError.value ?? "Failed to register. Please try again.";
  }
};

onMounted(async () => {
  const id = String(route.params.id);
  session.value = await getKuppiSession(id);

  if (session.value?._id) {
    const authUser = readAuthUser();
    if (authUser) {
      await Promise.all([
        checkUserRegistration(session.value._id, authUser._id),
        getSessionParticipantCount(session.value._id),
      ]);
    }
  }
});
</script>
