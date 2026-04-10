<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="currentPageTitle" />
    <div class="space-y-5 sm:space-y-6">
      <ComponentCard title="Student Services">
        <div class="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 pb-3 dark:border-gray-800">
          <div class="flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-full px-4 py-1.5 text-xs font-medium transition"
              :class="
                activeTab === 'student'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              "
              @click="activeTab = 'student'"
            >
              Student Request
            </button>
            <!-- <button
              type="button"
              class="rounded-full px-4 py-1.5 text-xs font-medium transition"
              :class="
                activeTab === 'helper'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              "
              @click="activeTab = 'helper'"
            >
              Helper Request
            </button>
            <button
              type="button"
              class="rounded-full px-4 py-1.5 text-xs font-medium transition"
              :class="
                activeTab === 'book'
                  ? 'bg-brand-500 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300'
              "
              @click="activeTab = 'book'"
            >
              Book Show Request
            </button> -->
          </div>
        </div>

        <div class="space-y-4">
          <div
            class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-gray-200 bg-gray-50/50 p-5 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-300"
          >
            <div class="flex flex-col gap-1.5">
              <span class="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-gray-100">
                Request Status
                <span
                  :class="[
                    'inline-flex items-center rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wider transition-colors',
                    statusClass,
                  ]"
                >
                  {{ statusLabel }}
                </span>
              </span>
              <div v-if="myRequest" class="flex flex-col gap-0.5">
                <span class="text-[11px] text-gray-500 dark:text-gray-400">
                  Last updated:
                  {{ myRequest.updatedAt ? new Date(myRequest.updatedAt).toLocaleString() : "—" }}
                </span>
                <span
                  v-if="myRequest.status === 'approved'"
                  class="text-[11px] font-medium text-emerald-600 dark:text-emerald-400"
                >
                  ✓ Your request has been approved by the administrator.
                </span>
              </div>
              <span v-else class="text-[11px] text-gray-500 dark:text-gray-400 italic">
                You have not submitted a student request yet. Please fill the form below.
              </span>
            </div>
          </div>

          <div
            v-if="successMessage"
            class="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300"
          >
            {{ successMessage }}
          </div>

          <div
            v-if="error"
            class="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-xs text-error-700 dark:border-error-900/60 dark:bg-error-950/40 dark:text-error-300"
          >
            {{ error }}
          </div>
        </div>

        <div v-if="activeTab === 'student'" class="mt-4">
          <form
            class="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:grid-cols-6"
            @submit.prevent="handleSubmit"
          >
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-xs font-medium text-gray-600 dark:text-gray-300"> Username </label>
              <input
                :value="username"
                type="text"
                class="h-11 rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                readonly
                disabled
              />
            </div>

            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
                Student ID
                <span class="text-[11px] font-normal text-gray-400">(optional)</span>
              </label>
              <input
                v-model.trim="form.studentId"
                type="text"
                placeholder="Eg: IT12345678"
                class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
              />
            </div>

            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-xs font-medium text-gray-600 dark:text-gray-300"> Faculty </label>
              <select
                v-model="form.faculty_id"
                class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
                required
              >
                <option value="" disabled>Select Faculty</option>
                <option v-for="f in faculties" :key="f._id" :value="f._id">
                  {{ f.faculty_name }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-1 md:col-span-3">
              <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
                Specialization
              </label>
              <select
                v-model="form.specialization_id"
                class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
                :disabled="!form.faculty_id"
                required
              >
                <option value="" disabled>Select Specialization</option>
                <option v-for="s in specializations" :key="s._id" :value="s._id">
                  {{ s.specialization_name }}
                </option>
              </select>
            </div>

            <div class="flex flex-col gap-1 md:col-span-1">
              <label class="text-xs font-medium text-gray-600 dark:text-gray-300"> Year </label>
              <select
                v-model.number="form.year"
                class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
                required
              >
                <option v-for="y in years" :key="y" :value="y">Year {{ y }}</option>
              </select>
            </div>

            <div class="flex flex-col gap-1 md:col-span-1">
              <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
                Semester
              </label>
              <select
                v-model.number="form.semester"
                class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
                required
              >
                <option v-for="s in semesters" :key="s" :value="s">Sem {{ s }}</option>
              </select>
            </div>

            <button
              type="submit"
              class="h-11 rounded-lg px-4 text-sm font-bold text-white transition-all md:col-span-2"
              :class="
                hasAnyRequest
                  ? myRequest?.status === 'approved'
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-amber-500 hover:bg-amber-600'
                  : 'bg-brand-500 hover:bg-brand-600'
              "
              :disabled="saving || !username || hasAnyRequest"
            >
              <div class="flex items-center justify-center gap-2">
                <span v-if="saving">Submitting...</span>
                <template v-else-if="myRequest?.status === 'approved'">
                  <span>Request Approved</span>
                </template>
                <template v-else-if="hasAnyRequest">
                  <span>Already Requested</span>
                </template>
                <span v-else>Submit Request</span>
              </div>
            </button>
          </form>
        </div>

        <div v-else-if="activeTab === 'helper'" class="mt-4">
          <div
            class="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
          >
            Helper Request form UI placeholder. Connect this to your helper-request API when
            available.
          </div>
          <form
            class="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:grid-cols-6"
            @submit.prevent
          >
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-xs font-medium text-gray-600 dark:text-gray-300"> Username </label>
              <input
                :value="username"
                type="text"
                class="h-11 rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                readonly
                disabled
              />
            </div>
            <div class="flex flex-col gap-1 md:col-span-4">
              <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
                Helper request details
              </label>
              <textarea
                rows="3"
                class="rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
                placeholder="Describe the help you need..."
              />
            </div>
            <button
              type="button"
              class="h-11 rounded-lg bg-gray-300 px-4 text-sm font-medium text-gray-700 md:col-span-2 dark:bg-gray-700 dark:text-gray-200"
              disabled
            >
              Submit (API not wired yet)
            </button>
          </form>
        </div>

        <div v-else-if="activeTab === 'book'" class="mt-4">
          <div
            class="mb-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
          >
            Book Show Request form UI placeholder. Connect this to your booking API when ready.
          </div>
          <form
            class="grid gap-3 rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/[0.03] md:grid-cols-6"
            @submit.prevent
          >
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-xs font-medium text-gray-600 dark:text-gray-300"> Username </label>
              <input
                :value="username"
                type="text"
                class="h-11 rounded-lg border border-gray-200 bg-gray-50 px-4 text-sm text-gray-700 outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                readonly
                disabled
              />
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
                Title / topic
              </label>
              <input
                type="text"
                class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
                placeholder="Eg: Project presentation"
              />
            </div>
            <div class="flex flex-col gap-1 md:col-span-2">
              <label class="text-xs font-medium text-gray-600 dark:text-gray-300"> Preferred date </label>
              <input
                type="date"
                class="h-11 rounded-lg border border-gray-200 bg-transparent px-4 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
              />
            </div>
            <div class="flex flex-col gap-1 md:col-span-6">
              <label class="text-xs font-medium text-gray-600 dark:text-gray-300">
                Additional information
              </label>
              <textarea
                rows="3"
                class="rounded-lg border border-gray-200 bg-transparent px-4 py-2 text-sm text-gray-700 outline-none transition focus:border-brand-500 dark:border-gray-700 dark:text-gray-200"
                placeholder="Add any notes for the booking..."
              />
            </div>
            <button
              type="button"
              class="h-11 rounded-lg bg-gray-300 px-4 text-sm font-medium text-gray-700 md:col-span-2 dark:bg-gray-700 dark:text-gray-200"
              disabled
            >
              Submit (API not wired yet)
            </button>
          </form>
        </div>

      </ComponentCard>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import { useStudentRequestsStore } from "@/store/studentRequests";

const currentPageTitle = ref("Student Request");
const activeTab = ref<"student" | "helper" | "book">("student");
const saving = ref(false);
const years = [1, 2, 3, 4];
const semesters = [1, 2];
const successMessage = ref("");

const readAuthUser = () => {
  const raw = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const authUser = readAuthUser();
const username = String(authUser?.username ?? "");
const form = ref({
  studentId: "",
  faculty_id: "",
  specialization_id: "",
  year: 1,
  semester: 1,
});

const {
  faculties,
  specializations,
  myRequest,
  error,
  fetchFaculties,
  fetchSpecializations,
  fetchMyRequest,
  submitStudentRequest,
} = useStudentRequestsStore();

const hasAnyRequest = computed(() => Boolean(myRequest.value));
const statusLabel = computed(() => {
  const status = String(myRequest.value?.status ?? "Not Submitted");
  return status;
});

const statusClass = computed(() => {
  const status = myRequest.value?.status;
  if (!status) return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700";
  if (status === "approved") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800";
  }
  if (status === "pending") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800";
  }
  if (status === "rejected") {
    return "bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-400 border border-rose-200 dark:border-rose-800";
  }
  return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border border-gray-200 dark:border-gray-700";
});

watch(
  () => form.value.faculty_id,
  async (next) => {
    form.value.specialization_id = "";
    if (next) {
      await fetchSpecializations(next);
    } else {
      specializations.value = [];
    }
  }
);

const hydrateFromRequest = async () => {
  const req = myRequest.value;
  if (!req) return;
  form.value.studentId = String(req.studentId ?? "");
  form.value.faculty_id = String(req.faculty_id ?? "");
  if (form.value.faculty_id) {
    await fetchSpecializations(form.value.faculty_id);
  }
  form.value.specialization_id = String(req.specialization_id ?? "");
  form.value.year = Number(req.year ?? 1);
  form.value.semester = Number(req.semester ?? 1);
};

const handleSubmit = async () => {
  saving.value = true;
  successMessage.value = "";
  const saved = await submitStudentRequest({
    username,
    studentId: form.value.studentId,
    faculty_id: form.value.faculty_id,
    specialization_id: form.value.specialization_id,
    year: Number(form.value.year),
    semester: Number(form.value.semester),
  });
  if (saved) {
    await fetchMyRequest(username);
    await hydrateFromRequest();
    successMessage.value = "Student request submitted successfully.";
  } else if (!error.value) {
    successMessage.value = "Student request failed. Please try again.";
  }
  saving.value = false;
};

onMounted(async () => {
  await fetchFaculties();
  if (username) {
    await fetchMyRequest(username);
    await hydrateFromRequest();
  }
});
</script>

