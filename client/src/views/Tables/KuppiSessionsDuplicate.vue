<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="p-6">
      <!-- Page Header -->
      <div class="flex items-center justify-between mb-6">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Kuppi Sessions</h1>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Browse and join peer tutoring sessions</p>
        </div>
      <button
        id="btn-create-kuppi"
        @click="showModal = true"
        class="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-500 text-white text-sm font-medium hover:bg-brand-600 transition-colors"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Create Kuppi Session
      </button>
    </div>

    <!-- Error Banner -->
    <div
      v-if="error"
      class="mb-4 px-4 py-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm dark:bg-error-900/20 dark:border-error-800 dark:text-error-400"
    >
      {{ error }}
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center h-48 text-gray-400">
      <svg class="animate-spin w-8 h-8" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
    </div>

    <!-- Empty State -->
    <div
      v-else-if="!loading && sessions.length === 0"
      class="flex flex-col items-center justify-center h-64 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-gray-400"
    >
      <svg class="w-12 h-12 mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
      <p class="font-medium">No Kuppi Sessions yet</p>
      <p class="text-sm mt-1">Be the first to create one!</p>
    </div>

    <!-- Sessions Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      <div
        v-for="session in sessions"
        :key="session._id"
        id="kuppi-session-card"
        @click="goToDetail(session._id!)"
        class="group cursor-pointer rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md hover:border-brand-300 dark:hover:border-brand-700 transition-all duration-200 overflow-hidden"
      >
        <!-- Card Header Strip -->
        <div class="h-2 bg-gradient-to-r from-brand-400 to-brand-600"></div>
        <div class="p-5">
          <!-- Status Badge -->
          <span 
            :class="[
              'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full mb-3',
              session.status === 'UPCOMING' 
                ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                : session.status === 'ONGOING'
                ? 'bg-success-50 text-success-700 dark:bg-success-900/30 dark:text-success-400'
                : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            ]"
          >
            <span 
              :class="[
                'w-1.5 h-1.5 rounded-full',
                session.status === 'UPCOMING' 
                  ? 'bg-blue-500'
                  : session.status === 'ONGOING'
                  ? 'bg-success-500 animate-pulse'
                  : 'bg-gray-400'
              ]"
            ></span>
            {{ session.status }}
          </span>

          <!-- Title -->
          <h3 class="text-base font-semibold text-gray-900 dark:text-white group-hover:text-brand-600 transition-colors line-clamp-2 mb-1">
            {{ session.title }}
          </h3>

          <!-- Subject -->
          <p class="text-sm text-brand-500 dark:text-brand-400 font-medium mb-3">
            {{ session.subject }}
          </p>

          <!-- Meta info -->
          <div class="flex flex-col gap-1.5 text-xs text-gray-500 dark:text-gray-400">
            <div class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C6.5 6.253 2 10.998 2 17c0 5.523 4.477 10 10 10s10-4.477 10-10c0-6.002-4.5-10.747-10-10.747z" />
              </svg>
              {{ session.year }} • {{ session.semester }}
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {{ formatDate(session.date) }}
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ session.time }} • {{ session.duration }}
            </div>
            <div class="flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {{ session.createdBy }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ─── Create Session Modal ─── -->
    <transition name="fade">
      <div
        v-if="showModal"
        class="fixed inset-0 z-99999 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        @click.self="closeModal"
      >
        <div class="w-full max-w-lg bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden">
          <!-- Modal Header -->
          <div class="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Create Kuppi Session</h2>
            <button
              @click="closeModal"
              class="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Modal Form -->
          <form @submit.prevent="handleSubmit" class="px-6 py-5 space-y-4 max-h-[80vh] overflow-y-auto">
            <!-- Form Error -->
            <div
              v-if="formError"
              class="px-4 py-3 rounded-lg bg-error-50 border border-error-200 text-error-700 text-sm dark:bg-error-900/20"
            >
              {{ formError }}
            </div>

            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Title <span class="text-error-500">*</span>
              </label>
              <input
                id="kuppi-title"
                v-model="form.title"
                type="text"
                placeholder="e.g. Data Structures Revision"
                class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                required
              />
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Description <span class="text-error-500">*</span>
              </label>
              <textarea
                id="kuppi-description"
                v-model="form.description"
                rows="3"
                placeholder="Briefly describe what will be covered..."
                class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition resize-none"
                required
              ></textarea>
            </div>

            <!-- Subject -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Subject / Module <span class="text-error-500">*</span>
              </label>
              <input
                id="kuppi-subject"
                v-model="form.subject"
                type="text"
                placeholder="e.g. CS2020 — Algorithms"
                class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                required
              />
            </div>

            <!-- Year & Semester row -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Year <span class="text-error-500">*</span>
                </label>
                <input
                  id="kuppi-year"
                  v-model="form.year"
                  type="text"
                  placeholder="e.g. Year 2"
                  class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Semester <span class="text-error-500">*</span>
                </label>
                <input
                  id="kuppi-semester"
                  v-model="form.semester"
                  type="text"
                  placeholder="e.g. Semester 1"
                  class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <!-- Date, Time & Duration row -->
            <div class="grid grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Date <span class="text-error-500">*</span>
                </label>
                <input
                  id="kuppi-date"
                  v-model="form.date"
                  type="date"
                  class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Time <span class="text-error-500">*</span>
                </label>
                <input
                  id="kuppi-time"
                  v-model="form.time"
                  type="time"
                  class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  required
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Duration <span class="text-error-500">*</span>
                </label>
                <input
                  id="kuppi-duration"
                  v-model="form.duration"
                  type="text"
                  placeholder="e.g. 1.5 hours"
                  class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                  required
                />
              </div>
            </div>

            <!-- Teams Link -->
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Microsoft Teams Link <span class="text-error-500">*</span>
              </label>
              <input
                id="kuppi-teams-link"
                v-model="form.teamsLink"
                type="url"
                placeholder="https://teams.microsoft.com/l/meetup-join/..."
                class="w-full px-3 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition"
                required
              />
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-2">
              <button
                type="button"
                @click="closeModal"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                id="btn-submit-kuppi"
                type="submit"
                :disabled="submitting"
                class="px-5 py-2 text-sm font-medium text-white bg-brand-500 hover:bg-brand-600 disabled:opacity-60 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center gap-2"
              >
                <svg v-if="submitting" class="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                {{ submitting ? "Creating..." : "Create Session" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </transition>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import { useRouter } from "vue-router";
import { useKuppiSessionsStore } from "@/store/kuppiSessions";

const router = useRouter();
const { sessions, loading, error, fetchKuppiSessions, createKuppiSession } =
  useKuppiSessionsStore();

const showModal = ref(false);
const submitting = ref(false);
const formError = ref<string | null>(null);
const currentPageTitle = ref("Kuppi Sessions Duplicate");

const blankForm = () => ({
  title: "",
  description: "",
  subject: "",
  year: "",
  semester: "",
  date: "",
  time: "",
  duration: "",
  teamsLink: "",
});

const form = reactive(blankForm());

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

const closeModal = () => {
  showModal.value = false;
  formError.value = null;
  Object.assign(form, blankForm());
};

const handleSubmit = async () => {
  submitting.value = true;
  formError.value = null;

  const authUser = readAuthUser();
  const result = await createKuppiSession({
    ...form,
    createdBy: authUser?.username ?? "Unknown",
  });

  submitting.value = false;

  if (result) {
    closeModal();
  } else {
    formError.value = error.value ?? "Failed to create session. Please try again.";
  }
};

const goToDetail = (id: string) => {
  router.push(`/kuppi-sessions/${id}`);
};

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

onMounted(fetchKuppiSessions);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
</style>
