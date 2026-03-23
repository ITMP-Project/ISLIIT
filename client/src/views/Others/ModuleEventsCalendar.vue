<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div
      class="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]"
    >
      <div
        class="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3 dark:border-gray-800"
      >
        <div class="space-y-0.5">
          <p class="text-sm font-medium text-gray-800 dark:text-gray-100">
            {{ headerTitle }}
          </p>
          <p class="text-[11px] text-gray-500 dark:text-gray-400">
            Combined timetable for your modules (lectures, labs, exams).
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-[12px] font-medium text-brand-600 transition hover:bg-brand-50 hover:text-brand-700 dark:border-gray-700 dark:bg-gray-900 dark:text-brand-400 dark:hover:bg-gray-800 dark:hover:text-brand-300"
            @click="showExportModal = true"
          >
            <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Send Timetable
          </button>
          <button
            type="button"
            class="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:hover:bg-gray-800"
            @click="showFilters = !showFilters"
            :aria-label="showFilters ? 'Hide filters' : 'Show filters'"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4 text-gray-700 dark:text-gray-200"
              aria-hidden="true"
            >
              <path
                d="M4 6h16M7 12h10M10 18h4"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div
        v-if="showFilters"
        class="flex flex-wrap items-start gap-4 border-b border-gray-100 px-4 py-3 text-[11px] text-gray-600 dark:border-gray-800 dark:text-gray-300"
      >
        <div ref="moduleDropdownRef" class="relative flex flex-col gap-1">
          <span class="font-medium text-[11px]">Module</span>
          <div class="relative">
            <input
              v-model="moduleSearch"
              type="text"
              placeholder="Search modules…"
              @focus="moduleDropdownOpen = true"
              @input="moduleDropdownOpen = true"
              @keydown.enter.prevent="onModuleEnter"
              :class="`h-8 w-64 max-w-xs rounded-lg border bg-white px-3 pr-9 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 ${
                moduleDropdownOpen ? 'border-brand-500/60' : 'border-gray-200'
              }`"
            />

            <button
              v-if="moduleSearch"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Clear module search"
              @click="clearModuleSearch"
            >
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div
            v-if="moduleDropdownOpen"
            class="absolute z-20 mt-1 max-h-56 w-64 max-w-xs overflow-y-auto rounded-lg border border-gray-200 bg-white py-1 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <button
              v-if="selectedModuleIds.length"
              type="button"
              class="w-full px-2 py-1 text-left text-[11px] text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
              @click="clearSelectedModules"
            >
              Clear selection
            </button>

            <button
              v-for="mod in filteredUserModules"
              :key="String(mod._id)"
              type="button"
              class="flex w-full items-center gap-2 px-2 py-1.5 text-left text-[11px] hover:bg-gray-50 dark:hover:bg-gray-800"
              @click="toggleModule(String(mod._id))"
            >
              <input
                type="checkbox"
                :checked="selectedModuleIds.includes(String(mod._id))"
                class="h-3.5 w-3.5 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                @change.prevent
              />
              <span class="truncate text-gray-800 dark:text-gray-200">
                {{ mod.module_name }} (Y{{ mod.year }} S{{ mod.semester }})
              </span>
            </button>

            <div
              v-if="!filteredUserModules.length"
              class="px-3 py-2 text-[11px] text-gray-500 dark:text-gray-400"
            >
              No matching modules.
            </div>
          </div>

          <div v-if="selectedModules.length" class="mt-2 flex max-w-xs flex-wrap gap-1">
            <span
              v-for="mod in selectedModules"
              :key="String(mod._id)"
              class="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-2 py-0.5 text-[11px] text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
            >
              <span class="truncate">
                {{ mod.module_name }} (Y{{ mod.year }} S{{ mod.semester }})
              </span>
              <button
                type="button"
                class="rounded-full px-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-400"
                aria-label="Remove module filter"
                @click="removeModule(String(mod._id))"
              >
                ×
              </button>
            </span>
          </div>
          <span class="text-[10px] text-gray-400 dark:text-gray-500">
            Leave empty to show all modules.
          </span>
        </div>

        <div ref="titleDropdownRef" class="relative flex flex-col gap-1">
          <span class="font-medium text-[11px]">Title contains</span>
          <div class="relative">
            <input
              v-model="searchText"
              type="text"
              placeholder="Search by title…"
              @focus="titleDropdownOpen = true"
              @input="titleDropdownOpen = true"
              @keydown.enter.prevent="onTitleEnter"
              @keydown.esc="titleDropdownOpen = false"
              :class="`h-8 w-40 max-w-xs rounded-lg border border-gray-200 bg-white px-3 pr-9 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200`"
            />

            <button
              v-if="searchText"
              type="button"
              class="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-800"
              aria-label="Clear title search"
              @click="clearTitleSearch"
            >
              <svg viewBox="0 0 24 24" class="h-3.5 w-3.5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </button>
          </div>

          <div
            v-if="titleDropdownOpen && titleSuggestions.length"
            class="absolute z-20 mt-1 w-96 max-w-[70vw] overflow-hidden rounded-lg border border-gray-200 bg-white py-1 shadow-sm dark:border-gray-700 dark:bg-gray-900"
          >
            <button
              v-for="s in titleSuggestions"
              :key="`${s.title}-${s.moduleId}`"
              type="button"
              class="block w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800"
              @click="selectTitleSuggestion(s)"
            >
              <div class="truncate text-[11px] font-medium text-gray-800 dark:text-gray-200">
                {{ s.title }}
              </div>
              <div v-if="s.moduleLabel" class="truncate text-[10px] text-gray-500 dark:text-gray-400">
                {{ s.moduleLabel }}
              </div>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-1">
          <span class="font-medium text-[11px]">Type</span>
          <select
            v-model="typeFilter"
            class="h-8 min-w-[130px] rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="">All types</option>
            <option value="lec">Lecture</option>
            <option value="lab">Lab</option>
            <option value="assessment">Assessment</option>
            <option value="exam">Exam</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <span class="font-medium text-[11px]">Start date</span>
          <input
            v-model="startDateFilter"
            type="date"
            class="h-8 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          />
        </div>

        <div class="flex flex-col gap-1">
          <span class="font-medium text-[11px]">End date</span>
          <input
            v-model="endDateFilter"
            type="date"
            class="h-8 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          />
        </div>
      </div>

      <div v-if="loading" class="px-4 py-3 text-xs text-gray-500 dark:text-gray-400">
        Loading module events...
      </div>
      <div v-else-if="error" class="px-4 py-3 text-xs text-error-600 dark:text-error-400">
        {{ error }}
      </div>
      <div
        v-else-if="!calendarEvents.length"
        class="px-4 py-5 text-xs text-gray-500 dark:text-gray-400"
      >
        No module events found. Once events are created for your modules, they will appear here.
      </div>

      <div v-if="calendarEvents.length" class="custom-calendar">
        <FullCalendar ref="calendarRef" class="min-h-screen" :options="calendarOptions" />
      </div>

      <!-- Hover details card -->
      <div
        v-if="hoverCardOpen && hoverEvent"
        :style="hoverCardStyle"
        class="pointer-events-none fixed z-[100000] w-[320px] max-w-[calc(100vw-24px)] rounded-2xl border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-800 dark:bg-gray-900"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p class="truncate text-sm font-semibold text-gray-900 dark:text-white/90">
              {{ hoverEvent.title }}
            </p>
            <p class="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
              {{ formatHoverTime(hoverEvent.start) }} {{ hoverEvent.end ? '→ ' + formatHoverTime(hoverEvent.end) : '' }}
            </p>
          </div>
        </div>

        <div class="mt-2 flex flex-wrap items-center gap-2">
          <span
            class="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
            :class="typeBadgeClassForEvent"
          >
            {{ formatHoverType(hoverEvent.extendedProps.type) }}
          </span>
          <span v-if="hoverModuleLabel" class="text-[11px] text-gray-500 dark:text-gray-400">
            {{ hoverModuleLabel }}
          </span>
        </div>

        <div class="mt-3 rounded-xl border border-gray-100 bg-gray-50 p-2 dark:border-gray-800 dark:bg-white/[0.03]">
          <p class="line-clamp-3 text-[11px] leading-relaxed text-gray-700 dark:text-gray-200">
            {{ hoverEvent.extendedProps.description || "No description available." }}
          </p>
        </div>
      </div>
    </div>

    <Modal v-if="isEventDetailsOpen" @close="closeEventDetails">
      <template #body>
        <div
          class="no-scrollbar relative w-full max-w-[720px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="min-w-0 flex-1">
              <h3 class="truncate text-lg font-semibold text-gray-800 dark:text-white/90">
                {{ selectedEvent?.title || "Event details" }}
              </h3>

              <div class="mt-2 flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium"
                  :class="typeBadgeClass"
                >
                  {{ selectedEventTypeLabel }}
                </span>

                <span v-if="selectedModuleLabel" class="text-[11px] text-gray-500 dark:text-gray-400">
                  {{ selectedModuleLabel }}
                </span>
              </div>
            </div>

            <button
              type="button"
              class="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-white/[0.03]"
              @click="closeEventDetails"
            >
              Close
            </button>
          </div>

          <div class="mt-6 grid gap-4 sm:grid-cols-2">
            <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <div class="text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Start
              </div>
              <div class="mt-1 text-[12px] font-medium text-gray-800 dark:text-gray-200">
                {{ formatDateTime(selectedEvent?.start) }}
              </div>
            </div>
            <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <div class="text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                End
              </div>
              <div class="mt-1 text-[12px] font-medium text-gray-800 dark:text-gray-200">
                {{ formatDateTime(selectedEvent?.end) }}
              </div>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <div class="text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Type
              </div>
              <div class="mt-1 text-[12px] font-medium text-gray-800 dark:text-gray-200">
                {{ selectedEventTypeLabel }}
              </div>
            </div>

            <div class="rounded-xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
              <div class="text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Module ID
              </div>
              <div class="mt-1 break-all text-[12px] font-medium text-gray-800 dark:text-gray-200">
                {{ selectedEvent?.extendedProps?.moduleId || "N/A" }}
              </div>
            </div>
          </div>

          <div class="mt-5 rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div class="text-[10px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Description
            </div>
            <p class="mt-2 whitespace-pre-wrap text-[12px] leading-relaxed text-gray-800 dark:text-gray-200">
              {{ selectedEvent?.extendedProps?.description || "No description available." }}
            </p>
          </div>
        </div>
      </template>
    </Modal>
    <Modal v-if="showExportModal" @close="showExportModal = false">
      <template #body>
        <div class="no-scrollbar relative w-full max-w-[400px] overflow-y-auto rounded-3xl bg-white p-6 dark:bg-gray-900 lg:p-8">
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-lg font-semibold text-gray-800 dark:text-white/90">
              Export Timetable
            </h3>
            <button
              type="button"
              class="rounded-lg p-1 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              @click="showExportModal = false"
            >
              <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div class="flex flex-col gap-1.5">
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Select Range</span>
              <select
                v-model="exportPeriod"
                class="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-700 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
              >
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>
            </div>
            
            <button
              type="button"
              class="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-500 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              @click="exportToPDF"
            >
              <svg class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Download PDF
            </button>
          </div>
        </div>
      </template>
    </Modal>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import Modal from "@/components/profile/Modal.vue";
import type { AuthUser, Module, ModuleEvent } from "@/ts/mongo";
import { useModuleEventsStore } from "@/store/moduleEvents";
import { useUserModulesStore } from "@/store/userModules";

const pageTitle = ref("My Module Timetable");
const calendarRef = ref();

const { apiUrl } = useModuleEventsStore();
const { modules, fetchModulesForContext } = useUserModulesStore();

const events = ref<ModuleEvent[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const showExportModal = ref(false);
const exportPeriod = ref<"today" | "week" | "month">("week");

const showFilters = ref(true);
const selectedModuleIds = ref<string[]>([]);
const selectedModules = computed<Module[]>(() =>
  userModules.value.filter((m) => selectedModuleIds.value.includes(String(m._id ?? "")))
);

const searchText = ref<string>("");
const moduleSearch = ref<string>("");
const moduleDropdownOpen = ref(false);
const titleDropdownOpen = ref(false);

const typeFilter = ref<"" | "lec" | "lab" | "assessment" | "exam">("");
const startDateFilter = ref<string>("");
const endDateFilter = ref<string>("");

const moduleDropdownRef = ref<HTMLElement | null>(null);
const titleDropdownRef = ref<HTMLElement | null>(null);

const readAuthUser = (): AuthUser | null => {
  const raw = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

type AuthUserWithSpecialization = AuthUser & { specialization_id?: string };
const authUser = readAuthUser() as AuthUserWithSpecialization | null;

const headerTitle = computed(() =>
  authUser?.username ? `Timetable for ${authUser.username}` : "My module timetable"
);

const userModuleIds = computed<string[]>(() =>
  Array.isArray(authUser?.modules)
    ? authUser!.modules.map((id) => String(id)).filter(Boolean)
    : []
);

const userModules = computed<Module[]>(() =>
  modules.value.filter((mod) => userModuleIds.value.includes(String(mod._id ?? "")))
);

const filteredUserModules = computed<Module[]>(() => {
  const term = moduleSearch.value.trim().toLowerCase();
  if (!term) return userModules.value;
  return userModules.value.filter((mod) =>
    String(mod.module_name ?? "").toLowerCase().includes(term)
  );
});

const typeColors: Record<string, string> = {
  lec: "Primary",
  lab: "Success",
  exam: "Danger",
  assessment: "Warning",
};

type CalendarEventExtendedProps = {
  calendar: string;
  type: ModuleEvent["type"] | string;
  description: string;
  moduleId: string;
};

type CalendarEventInput = {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay: false;
  extendedProps: CalendarEventExtendedProps;
};

const buildCalendarEvent = (item: ModuleEvent): CalendarEventInput | undefined => {
  const start = item.startTime;
  const end = item.endTime;
  if (!start) return undefined;

  const typeKey = String(item.type ?? "").toLowerCase();
  const calendar = typeColors[typeKey] ?? "Primary";

  return {
    id: item._id ?? `${item.module_id}-${item.startTime}`,
    title: item.title,
    start,
    end: end || undefined,
    allDay: false,
    extendedProps: {
      calendar,
      type: item.type,
      description: item.description,
      moduleId: item.module_id,
    },
  };
};

const baseFilteredEvents = computed(() => {
  const selectedType = typeFilter.value;
  const startDate = startDateFilter.value ? new Date(startDateFilter.value) : null;
  const endDate = endDateFilter.value ? new Date(endDateFilter.value) : null;

  return events.value.filter((evt) => {
    if (selectedModuleIds.value.length > 0) {
      if (!selectedModuleIds.value.includes(String(evt.module_id))) return false;
    }

    if (selectedType && String(evt.type ?? "").toLowerCase() !== selectedType) return false;

    if (startDate || endDate) {
      const start = new Date(evt.startTime);
      if (Number.isNaN(start.getTime())) return false;

      if (startDate && start < startDate) return false;
      if (endDate) {
        const endBoundary = new Date(endDate);
        endBoundary.setHours(23, 59, 59, 999);
        if (start > endBoundary) return false;
      }
    }

    return true;
  });
});

const calendarEvents = computed(() => {
  const term = searchText.value.trim().toLowerCase();
  const filtered = baseFilteredEvents.value.filter((evt) => {
    if (!term) return true;
    return String(evt.title ?? "").toLowerCase().includes(term);
  });

  return filtered.map(buildCalendarEvent).filter((e): e is CalendarEventInput => Boolean(e));
});

type RenderEventContentInfo = {
  timeText: string;
  event: {
    title: string;
    extendedProps: {
      calendar?: string;
    };
  };
};

const renderEventContent = (eventInfo: RenderEventContentInfo) => {
  const calendarLevel = eventInfo.event.extendedProps.calendar || "Primary";
  const colorClass = `fc-bg-${String(calendarLevel).toLowerCase()}`;
  return {
    html: `
      <div class="event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm">
        <div class="fc-daygrid-event-dot"></div>
        <div class="fc-event-time">${eventInfo.timeText}</div>
        <div class="fc-event-title">${eventInfo.event.title}</div>
      </div>
    `,
  };
};

const toggleModule = (moduleId: string) => {
  if (!moduleId) return;
  const id = String(moduleId);
  const exists = selectedModuleIds.value.includes(id);
  selectedModuleIds.value = exists
    ? selectedModuleIds.value.filter((x) => x !== id)
    : [...selectedModuleIds.value, id];
};

const removeModule = (moduleId: string) => {
  const id = String(moduleId);
  selectedModuleIds.value = selectedModuleIds.value.filter((x) => x !== id);
};

const clearSelectedModules = () => {
  selectedModuleIds.value = [];
  moduleSearch.value = "";
  moduleDropdownOpen.value = false;
};

const clearModuleSearch = () => {
  moduleSearch.value = "";
  moduleDropdownOpen.value = false;
};

const onModuleEnter = () => {
  const matches = filteredUserModules.value;
  if (matches.length === 1 && String(matches[0]._id)) {
    toggleModule(String(matches[0]._id));
    moduleSearch.value = "";
    moduleDropdownOpen.value = false;
  }
};

type TitleSuggestion = {
  title: string;
  moduleId: string;
  moduleLabel?: string;
};

const titleSuggestions = computed<TitleSuggestion[]>(() => {
  const q = searchText.value.trim().toLowerCase();
  if (!q) return [];

  const result: TitleSuggestion[] = [];
  const seenTitles = new Set<string>();

  for (const evt of baseFilteredEvents.value) {
    const title = String(evt.title ?? "");
    if (!title.toLowerCase().includes(q)) continue;

    // Keep suggestions unique by title so the dropdown feels usable.
    if (seenTitles.has(title)) continue;
    seenTitles.add(title);

    const module = userModules.value.find((m) => String(m._id) === String(evt.module_id));
    result.push({
      title,
      moduleId: String(evt.module_id),
      moduleLabel: module ? `${module.module_name} (Y${module.year} S${module.semester})` : "",
    });

    if (result.length >= 8) break;
  }

  return result;
});

const selectTitleSuggestion = (s: TitleSuggestion) => {
  searchText.value = s.title;
  titleDropdownOpen.value = false;
};

const onTitleEnter = () => {
  if (titleSuggestions.value.length === 1) {
    selectTitleSuggestion(titleSuggestions.value[0]);
  }
};

const clearTitleSearch = () => {
  searchText.value = "";
  titleDropdownOpen.value = false;
};

type CalendarEventApi = {
  title: string;
  start?: Date | null;
  end?: Date | null;
  extendedProps: {
    calendar?: string;
    type?: ModuleEvent["type"] | string;
    description?: string;
    moduleId?: string;
  };
};

const selectedEvent = ref<CalendarEventApi | null>(null);
const isEventDetailsOpen = ref(false);

const exportToPDF = () => {
  const doc = new jsPDF();
  
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let startDate = startOfToday;
  let endDate = new Date(startOfToday.getTime());
  
  let periodLabel = "Today";

  if (exportPeriod.value === "today") {
    endDate.setDate(endDate.getDate() + 1);
    periodLabel = "Today";
  } else if (exportPeriod.value === "week") {
    const day = startDate.getDay();
    const diff = startDate.getDate() - day + (day === 0 ? -6 : 1);
    startDate = new Date(startDate.setDate(diff));
    endDate = new Date(startDate.getTime());
    endDate.setDate(endDate.getDate() + 7);
    periodLabel = "This Week";
  } else if (exportPeriod.value === "month") {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    periodLabel = "This Month";
  }
  
  const selectedEvents = baseFilteredEvents.value.filter((evt) => {
    const start = new Date(evt.startTime);
    return start >= startDate && start < endDate;
  });

  selectedEvents.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  
  doc.setFontSize(18);
  doc.text(`Timetable - ${periodLabel}`, 14, 22);
  
  if (authUser?.username) {
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Student: ${authUser.username}`, 14, 30);
  }

  const tableData = selectedEvents.map((evt) => {
    const start = new Date(evt.startTime);
    const end = evt.endTime ? new Date(evt.endTime) : null;
    
    // Format options for nice output
    const timeOptions: Intl.DateTimeFormatOptions = { 
        weekday: 'short', month: 'short', day: 'numeric', 
        hour: '2-digit', minute: '2-digit' 
    };
    const justTimeOptions: Intl.DateTimeFormatOptions = { 
        hour: '2-digit', minute: '2-digit' 
    };

    const timeStr = end ? 
      `${start.toLocaleString(undefined, timeOptions)} - ${end.toLocaleTimeString(undefined, justTimeOptions)}` : 
      `${start.toLocaleString(undefined, timeOptions)}`;
    
    const mod = userModules.value.find((m) => String(m._id) === String(evt.module_id));
    const moduleStr = mod ? `${mod.module_name} (Y${mod.year} S${mod.semester})` : "N/A";
    
    return [
      timeStr,
      evt.title || "Event",
      moduleStr,
      evt.type ? evt.type.charAt(0).toUpperCase() + evt.type.slice(1) : "Event"
    ];
  });
  
  autoTable(doc, {
    startY: 36,
    head: [["Time", "Event", "Module", "Type"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [66, 133, 244] },
    alternateRowStyles: { fillColor: [245, 248, 250] },
    margin: { top: 36 }
  });
  
  doc.save(`Timetable_${periodLabel.replace(" ", "_")}.pdf`);
  showExportModal.value = false;
};

const closeEventDetails = () => {
  isEventDetailsOpen.value = false;
  selectedEvent.value = null;
};

const handleEventClick = (clickInfo: { event: CalendarEventApi }) => {
  selectedEvent.value = clickInfo.event;
  isEventDetailsOpen.value = true;
};

const formatDateTime = (d?: Date | null) => {
  if (!d) return "N/A";
  try {
    return d.toLocaleString();
  } catch {
    return "N/A";
  }
};

const selectedEventTypeLabel = computed(() => {
  const raw = selectedEvent.value?.extendedProps?.type ?? "";
  if (!raw) return "Event";
  const s = String(raw);
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
});

const selectedModuleLabel = computed(() => {
  const moduleId = selectedEvent.value?.extendedProps?.moduleId;
  if (!moduleId) return "";
  const mod = userModules.value.find((m) => String(m._id) === String(moduleId));
  if (!mod) return "";
  return `${mod.module_name} (Y${mod.year} S${mod.semester})`;
});

const typeBadgeClass = computed(() => {
  const typeKey = String(selectedEvent.value?.extendedProps?.type ?? "").toLowerCase();
  const color = typeColors[typeKey] ?? "Primary";

  const base = "border-gray-200 dark:border-gray-800";
  const map: Record<string, string> = {
    Primary: "bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-500/10 dark:text-brand-300",
    Success: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300",
    Warning: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-300",
    Danger: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300",
  };

  return `${base} ${map[color] ?? map.Primary}`;
});

const hoverCardOpen = ref(false);
const hoverEvent = ref<CalendarEventApi | null>(null);
const hoverCardX = ref(0);
const hoverCardY = ref(0);

const hoverCardStyle = computed(() => ({
  left: `${hoverCardX.value}px`,
  top: `${hoverCardY.value}px`,
}));

const formatHoverTime = (d?: Date | null) => formatDateTime(d ?? null);

const formatHoverType = (raw?: CalendarEventApi["extendedProps"]["type"] | null) => {
  const t = String(raw ?? "").trim();
  if (!t) return "Event";
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
};

const typeBadgeClassForEvent = computed(() => {
  const typeKey = String(hoverEvent.value?.extendedProps?.type ?? "").toLowerCase();
  const color = typeColors[typeKey] ?? "Primary";

  const base = "border-gray-200 dark:border-gray-800";
  const map: Record<string, string> = {
    Primary: "bg-brand-50 text-brand-700 border-brand-200 dark:bg-brand-500/10 dark:text-brand-300",
    Success: "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300",
    Warning: "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-500/10 dark:text-yellow-300",
    Danger: "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300",
  };

  return `${base} ${map[color] ?? map.Primary}`;
});

const hoverModuleLabel = computed(() => {
  const moduleId = hoverEvent.value?.extendedProps?.moduleId;
  if (!moduleId) return "";
  const mod = userModules.value.find((m) => String(m._id) === String(moduleId));
  if (!mod) return "";
  return `${mod.module_name} (Y${mod.year} S${mod.semester})`;
});

const handleEventMouseEnter = (info: { jsEvent: MouseEvent; event: CalendarEventApi }) => {
  hoverEvent.value = info.event;
  hoverCardOpen.value = true;

  if (typeof window === "undefined") return;

  const cardW = 320;
  const cardH = 170;
  const pad = 14;

  const x = Math.min(info.jsEvent.clientX + pad, window.innerWidth - cardW - pad);
  const y = Math.min(info.jsEvent.clientY + pad, window.innerHeight - cardH - pad);

  hoverCardX.value = Math.max(pad, x);
  hoverCardY.value = Math.max(pad, y);
};

const handleEventMouseLeave = () => {
  hoverCardOpen.value = false;
  hoverEvent.value = null;
};

const calendarOptions = reactive({
  plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  headerToolbar: {
    left: "prev,next today",
    center: "title",
    right: "dayGridMonth,timeGridWeek,timeGridDay",
  },
  events: calendarEvents,
  selectable: false,
  eventContent: renderEventContent,
  eventClick: handleEventClick,
  eventMouseEnter: handleEventMouseEnter,
  eventMouseLeave: handleEventMouseLeave,
});

const reload = async () => {
  loading.value = true;
  error.value = null;
  try {
    if (authUser) {
      await fetchModulesForContext({
        specializationId: String(authUser?.specialization_id ?? ""),
      });
    }

    const user = authUser;
    const moduleIds = Array.isArray(user?.modules)
      ? user!.modules.map((id) => String(id)).filter(Boolean)
      : [];

    if (!moduleIds.length) {
      events.value = [];
      return;
    }

    const responses = await Promise.all(
      moduleIds.map((id) =>
        fetch(`${apiUrl}/api/modules/${encodeURIComponent(id)}/events`).then((r) => r.json())
      )
    );

    const collected = responses
      .flat()
      .filter((item: unknown) => {
        if (!item || typeof item !== "object") return false;
        const rec = item as Record<string, unknown>;
        return typeof rec.module_id === "string" && typeof rec.startTime === "string";
      });

    events.value = collected as ModuleEvent[];
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to load module events";
  } finally {
    loading.value = false;
  }
};

watch(searchText, (val) => {
  if (!val.trim()) titleDropdownOpen.value = false;
});

watch(showFilters, (v) => {
  if (!v) {
    moduleDropdownOpen.value = false;
    titleDropdownOpen.value = false;
  }
});

const onDocumentMouseDown = (e: MouseEvent) => {
  const target = e.target as Node | null;
  if (!target) return;

  const modEl = moduleDropdownRef.value;
  if (modEl && moduleDropdownOpen.value && !modEl.contains(target)) moduleDropdownOpen.value = false;

  const titleEl = titleDropdownRef.value;
  if (titleEl && titleDropdownOpen.value && !titleEl.contains(target)) titleDropdownOpen.value = false;
};

onMounted(() => {
  reload();
  document.addEventListener("mousedown", onDocumentMouseDown);
});

onBeforeUnmount(() => {
  document.removeEventListener("mousedown", onDocumentMouseDown);
});
</script>

