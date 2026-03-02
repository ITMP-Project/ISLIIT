<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="space-y-5 sm:space-y-6">
      <!-- Summary cards -->
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ComponentCard title="Upcoming exams" className="shadow-none">
          <div class="flex items-baseline justify-between text-sm">
            <p class="text-3xl font-semibold text-gray-900 dark:text-gray-100">
              {{ upcomingExamsCount }}
            </p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              next 30 days
            </p>
          </div>
        </ComponentCard>

        <ComponentCard title="Upcoming assessments" className="shadow-none">
          <div class="flex items-baseline justify-between text-sm">
            <p class="text-3xl font-semibold text-gray-900 dark:text-gray-100">
              {{ upcomingAssessmentsCount }}
            </p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              assignments / quizzes
            </p>
          </div>
        </ComponentCard>

        <ComponentCard title="Events this week" className="shadow-none">
          <div class="flex items-baseline justify-between text-sm">
            <p class="text-3xl font-semibold text-gray-900 dark:text-gray-100">
              {{ thisWeekEventsCount }}
            </p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              lec / lab / exam
            </p>
          </div>
        </ComponentCard>

        <ComponentCard title="Past events" className="shadow-none" desc="Lectures / labs / exams already completed.">
          <div class="flex items-baseline justify-between text-sm">
            <p class="text-3xl font-semibold text-gray-900 dark:text-gray-100">
              {{ pastEventsCount }}
            </p>
            <p class="text-[11px] text-gray-500 dark:text-gray-400">
              since semester start
            </p>
          </div>
        </ComponentCard>
      </div>

      <!-- Filters + main content -->
      <div class="grid gap-4 lg:grid-cols-3">
        <div class="lg:col-span-2 space-y-4">
          <ComponentCard
            title="My upcoming schedule"
            desc="See what is coming next and stay ahead of deadlines."
          >
            <template #default>
              <!-- quick filters -->
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div class="flex flex-wrap gap-2 text-[11px]">
                  <button
                    v-for="filter in quickFilters"
                    :key="filter.id"
                    type="button"
                    class="inline-flex items-center gap-1 rounded-full border px-3 py-1 font-medium transition"
                    :class="
                      activeQuickFilter === filter.id
                        ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:border-brand-400 dark:text-brand-300'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                    "
                    @click="activeQuickFilter = filter.id"
                  >
                    {{ filter.label }}
                  </button>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
                  :disabled="loading"
                  @click="reload"
                >
                  Refresh
                </button>
              </div>

              <!-- upcoming list -->
              <div class="mt-4 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                <div
                  v-if="!upcomingList.length && !loading"
                  class="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                >
                  No upcoming events for the selected filter.
                </div>

                <div
                  v-for="evt in upcomingList"
                  :key="evt._id"
                  class="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs shadow-sm transition hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div class="space-y-0.5">
                    <p class="font-semibold text-gray-800 dark:text-gray-100">
                      {{ evt.title }}
                    </p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">
                      <span class="capitalize">{{ evt.typeLabel }}</span>
                      •
                      {{ evt.moduleLabel }}
                    </p>
                    <p class="text-[11px] text-gray-500 dark:text-gray-400">
                      {{ evt.whenLabel }}
                    </p>
                  </div>
                  <span
                    class="mt-0.5 inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                    :class="evt.chipClass"
                  >
                    {{ evt.timeUntil }}
                  </span>
                </div>
              </div>
            </template>
          </ComponentCard>
        </div>

        <div class="space-y-4">
          <ComponentCard
            title="Near deadlines"
            desc="Assessments and exams due in the next 7 days."
          >
            <template #default>
              <div class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                <div
                  v-if="!nearDeadlineList.length && !loading"
                  class="rounded-lg border border-dashed border-amber-200 bg-amber-50 px-3 py-3 text-[11px] text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"
                >
                  No deadlines in the next 7 days.
                </div>

                <div
                  v-for="evt in nearDeadlineList"
                  :key="evt._id"
                  class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  <p class="font-medium">
                    {{ evt.title }}
                  </p>
                  <p class="mt-0.5 text-[11px]">
                    {{ evt.whenLabel }} • {{ evt.moduleLabel }}
                  </p>
                  <p class="mt-0.5 font-medium">
                    Due {{ evt.timeUntil }}
                  </p>
                </div>
              </div>
            </template>
          </ComponentCard>

          <ComponentCard
            title="Completed events"
            desc="Recent lectures, labs, and exams in the past 7 days."
          >
            <template #default>
              <div class="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                <div
                  v-if="!recentPastList.length && !loading"
                  class="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-[11px] text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                >
                  No events in the last 7 days.
                </div>

                <div
                  v-for="evt in recentPastList"
                  :key="evt._id"
                  class="rounded-lg border border-gray-100 bg-white px-3 py-2 text-[11px] text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                >
                  <p class="font-medium">
                    {{ evt.title }}
                  </p>
                  <p class="mt-0.5">
                    {{ evt.whenLabel }} • {{ evt.moduleLabel }}
                  </p>
                  <p class="mt-0.5 text-[11px] text-gray-500">
                    {{ evt.timeUntil }}
                  </p>
                </div>
              </div>
            </template>
          </ComponentCard>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import AdminLayout from "@/components/layout/AdminLayout.vue";
import PageBreadcrumb from "@/components/common/PageBreadcrumb.vue";
import ComponentCard from "@/components/common/ComponentCard.vue";
import type { AuthUser, Module, ModuleEvent } from "@/ts/mongo";
import { useUserModulesStore } from "@/store/userModules";
import { useModuleEventsStore } from "@/store/moduleEvents";

const pageTitle = ref("Student Overview");

const { modules, fetchModulesForContext } = useUserModulesStore();
const { apiUrl } = useModuleEventsStore();

const loading = ref(false);
const error = ref<string | null>(null);
const events = ref<ModuleEvent[]>([]);

const quickFilters = [
  { id: "all", label: "All events" },
  { id: "lec", label: "Lectures" },
  { id: "lab", label: "Labs" },
  { id: "assessment", label: "Assessments" },
  { id: "exam", label: "Exams" },
] as const;

type QuickFilterId = (typeof quickFilters)[number]["id"];

const activeQuickFilter = ref<QuickFilterId>("all");

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

const userModuleIds = computed<string[]>(() =>
  Array.isArray(authUser?.modules)
    ? authUser!.modules.map((id) => String(id)).filter(Boolean)
    : []
);

const moduleById = computed<Record<string, Module>>(() => {
  const map: Record<string, Module> = {};
  for (const mod of modules.value) {
    const id = String(mod._id ?? "");
    if (!id) continue;
    map[id] = mod;
  }
  return map;
});

const now = () => new Date();

const upcomingExamsCount = computed(() => {
  const today = now();
  const in30 = new Date();
  in30.setDate(today.getDate() + 30);
  return events.value.filter((evt) => {
    if (String(evt.type).toLowerCase() !== "exam") return false;
    const start = new Date(evt.startTime);
    return start >= today && start <= in30;
  }).length;
});

const upcomingAssessmentsCount = computed(() => {
  const today = now();
  const in30 = new Date();
  in30.setDate(today.getDate() + 30);
  return events.value.filter((evt) => {
    const type = String(evt.type).toLowerCase();
    if (!["assessment"].includes(type)) return false;
    const start = new Date(evt.startTime);
    return start >= today && start <= in30;
  }).length;
});

const thisWeekEventsCount = computed(() => {
  const today = now();
  const in7 = new Date();
  in7.setDate(today.getDate() + 7);
  return events.value.filter((evt) => {
    const start = new Date(evt.startTime);
    return start >= today && start <= in7;
  }).length;
});

const pastEventsCount = computed(() => {
  const today = now();
  return events.value.filter((evt) => {
    const end = new Date(evt.endTime || evt.startTime);
    return end < today;
  }).length;
});

const formatWhenLabel = (evt: ModuleEvent) => {
  const start = new Date(evt.startTime);
  const end = evt.endTime ? new Date(evt.endTime) : null;
  const datePart = start.toLocaleDateString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const timePart = start.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  if (!end) {
    return `${datePart} • ${timePart}`;
  }
  const endTime = end.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${datePart} • ${timePart} – ${endTime}`;
};

const formatTimeUntil = (evt: ModuleEvent) => {
  const start = new Date(evt.startTime);
  const diffMs = start.getTime() - now().getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
  if (diffMs < 0) {
    if (Math.abs(diffDays) <= 1) return "finished";
    return `${Math.abs(diffDays)} day(s) ago`;
  }
  if (diffDays === 0) return "today";
  if (diffDays === 1) return "tomorrow";
  return `in ${diffDays} day(s)`;
};

const normalizeTypeLabel = (type: string | undefined) => {
  const t = String(type ?? "").toLowerCase();
  if (t === "lec") return "Lecture";
  if (t === "lab") return "Lab";
  if (t === "exam") return "Exam";
  if (t === "assessment") return "Assessment";
  return "Event";
};

const chipClassForEvent = (evt: ModuleEvent) => {
  const t = String(evt.type ?? "").toLowerCase();
  if (t === "exam") {
    return "bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-200";
  }
  if (t === "assessment") {
    return "bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200";
  }
  if (t === "lab") {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200";
  }
  return "bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200";
};

const decorateEvent = (evt: ModuleEvent) => {
  const mod = moduleById.value[String(evt.module_id)] as Module | undefined;
  return {
    ...evt,
    typeLabel: normalizeTypeLabel(String(evt.type)),
    moduleLabel: mod
      ? `${mod.module_name} • Year ${mod.year}, Sem ${mod.semester}`
      : String(evt.module_id),
    whenLabel: formatWhenLabel(evt),
    timeUntil: formatTimeUntil(evt),
    chipClass: chipClassForEvent(evt),
  };
};

const sortedEvents = computed(() =>
  [...events.value].sort(
    (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  )
);

const upcomingList = computed(() => {
  const today = now();
  const filtered = sortedEvents.value.filter((evt) => {
    const start = new Date(evt.startTime);
    if (start < today) return false;
    const t = String(evt.type ?? "").toLowerCase();
    if (activeQuickFilter.value === "all") return true;
    return t === activeQuickFilter.value;
  });
  return filtered.slice(0, 20).map(decorateEvent);
});

const nearDeadlineList = computed(() => {
  const today = now();
  const in7 = new Date();
  in7.setDate(today.getDate() + 7);
  const filtered = sortedEvents.value.filter((evt) => {
    const start = new Date(evt.startTime);
    if (start < today || start > in7) return false;
    const t = String(evt.type ?? "").toLowerCase();
    return t === "exam" || t === "assessment";
  });
  return filtered.slice(0, 10).map(decorateEvent);
});

const recentPastList = computed(() => {
  const today = now();
  const sevenAgo = new Date();
  sevenAgo.setDate(today.getDate() - 7);
  const filtered = sortedEvents.value.filter((evt) => {
    const end = new Date(evt.endTime || evt.startTime);
    return end >= sevenAgo && end < today;
  });
  return filtered.slice(0, 10).map(decorateEvent);
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

    const moduleIds = userModuleIds.value;
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
      .filter((item: any) => item && item.module_id && item.startTime) as ModuleEvent[];

    events.value = collected;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to load events";
  } finally {
    loading.value = false;
  }
};

onMounted(reload);
</script>

