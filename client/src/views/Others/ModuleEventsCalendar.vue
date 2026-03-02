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
            class="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            @click="showFilters = !showFilters"
          >
            <span>{{ showFilters ? 'Hide filters' : 'Show filters' }}</span>
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
            :disabled="loading"
            @click="reload"
          >
            Refresh
          </button>
        </div>
      </div>

      <!-- Filters -->
      <div
        v-if="showFilters"
        class="flex flex-wrap items-start gap-4 border-b border-gray-100 px-4 py-3 text-[11px] text-gray-600 dark:border-gray-800 dark:text-gray-300"
      >
        <div class="flex flex-col gap-1">
          <span class="font-medium text-[11px]">Module</span>
          <div
            class="flex max-h-24 max-w-xs flex-wrap gap-1 overflow-y-auto rounded-lg border border-gray-200 bg-white px-2 py-1 dark:border-gray-700 dark:bg-gray-900"
          >
            <label
              v-for="mod in userModules"
              :key="mod._id"
              class="inline-flex items-center gap-1 rounded px-1 py-0.5 text-[11px]"
            >
              <input
                v-model="selectedModuleIds"
                type="checkbox"
                class="h-3 w-3 rounded border-gray-300 text-brand-500 focus:ring-brand-500"
                :value="String(mod._id)"
              />
              <span class="truncate">
                {{ mod.module_name }} (Y{{ mod.year }} S{{ mod.semester }})
              </span>
            </label>
          </div>
          <span class="text-[10px] text-gray-400 dark:text-gray-500">
            Leave empty to show all modules.
          </span>
        </div>

        <div class="flex flex-col gap-1">
          <span class="font-medium text-[11px]">Title contains</span>
          <input
            v-model="searchText"
            type="text"
            placeholder="Search by title…"
            class="h-8 w-40 rounded-lg border border-gray-200 bg-white px-3 text-[11px] text-gray-700 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          />
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
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
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

const showFilters = ref(true);
const selectedModuleIds = ref<string[]>([]);
const searchText = ref<string>("");
const typeFilter = ref<"" | "lec" | "lab" | "assessment" | "exam">("");
const startDateFilter = ref<string>("");
const endDateFilter = ref<string>("");

const readAuthUser = (): AuthUser | null => {
  const raw = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (_err) {
    return null;
  }
};

const authUser = readAuthUser();

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

const typeColors: Record<string, string> = {
  lec: "Primary",
  lab: "Success",
  exam: "Danger",
  assessment: "Warning",
};

const buildCalendarEvent = (item: ModuleEvent) => {
  const start = item.startTime;
  const end = item.endTime;
  if (!start) return null;

  const typeKey = String(item.type ?? "").toLowerCase();
  const calendar = typeColors[typeKey] ?? "Primary";

  return {
    id: item._id ?? `${item.module_id}-${item.startTime}`,
    title: item.title,
    start,
    end,
    allDay: false,
    extendedProps: {
      calendar,
      type: item.type,
      description: item.description,
      moduleId: item.module_id,
    },
  };
};

const calendarEvents = computed(() => {
  const term = searchText.value.trim().toLowerCase();
  const selectedType = typeFilter.value;
  const startDate = startDateFilter.value ? new Date(startDateFilter.value) : null;
  const endDate = endDateFilter.value ? new Date(endDateFilter.value) : null;

  const filtered = events.value.filter((evt) => {
    if (selectedModuleIds.value.length > 0) {
      if (!selectedModuleIds.value.includes(String(evt.module_id))) {
        return false;
      }
    }

    if (selectedType && String(evt.type ?? "").toLowerCase() !== selectedType) {
      return false;
    }

    if (term && !String(evt.title ?? "").toLowerCase().includes(term)) {
      return false;
    }

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

  return filtered.map(buildCalendarEvent).filter(Boolean);
});

const renderEventContent = (eventInfo: any) => {
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
});

const reload = async () => {
  loading.value = true;
  error.value = null;
  try {
    if (authUser) {
      await fetchModulesForContext({
        specializationId: String((authUser as any)?.specialization_id ?? ""),
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
      .filter((item: any) => item && item.module_id && item.startTime);

    events.value = collected as ModuleEvent[];
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to load module events";
  } finally {
    loading.value = false;
  }
};

onMounted(reload);
</script>

