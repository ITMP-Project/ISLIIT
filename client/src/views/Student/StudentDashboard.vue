<template>
  <AdminLayout>
    <PageBreadcrumb :pageTitle="pageTitle" />

    <div class="space-y-5 sm:space-y-6">
      <!-- Summary cards -->
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ComponentCard title="Upcoming exams" className="shadow-none">
          <div class="flex items-start justify-between gap-3 text-sm">
            <div class="flex min-w-0 items-center gap-3">
              <div class="rounded-xl bg-red-50 p-2 text-red-700 dark:bg-red-900/40 dark:text-red-200">
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M3 9h18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M6 9v12a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M10 13h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M10 17h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
              </div>
              <div class="min-w-0">
                <div v-if="loading && !events.length" class="h-9 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 mt-1"></div>
                <p v-else class="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                  {{ upcomingExamsCount }}
                </p>
              </div>
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
              next 30 days
            </p>
          </div>
        </ComponentCard>

        <ComponentCard title="Upcoming assessments" className="shadow-none">
          <div class="flex items-start justify-between gap-3 text-sm">
            <div class="flex min-w-0 items-center gap-3">
              <div class="rounded-xl bg-amber-50 p-2 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200">
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div v-if="loading && !events.length" class="h-9 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 mt-1"></div>
              <p v-else class="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {{ upcomingAssessmentsCount }}
              </p>
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
              assignments / quizzes
            </p>
          </div>
        </ComponentCard>

        <ComponentCard title="Events this week" className="shadow-none">
          <div class="flex items-start justify-between gap-3 text-sm">
            <div class="flex min-w-0 items-center gap-3">
              <div class="rounded-xl bg-blue-50 p-2 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200">
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M7 11h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M7 15h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M7 19h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  <path d="M5 3h14a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div v-if="loading && !events.length" class="h-9 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 mt-1"></div>
              <p v-else class="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {{ thisWeekEventsCount }}
              </p>
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
              lec / lab / exam
            </p>
          </div>
        </ComponentCard>

        <ComponentCard title="Past events" className="shadow-none" desc="Lectures / labs / exams already completed.">
          <div class="flex items-start justify-between gap-3 text-sm">
            <div class="flex min-w-0 items-center gap-3">
              <div class="rounded-xl bg-gray-50 p-2 text-gray-700 dark:bg-dark-900 dark:text-gray-200">
                <svg viewBox="0 0 24 24" fill="none" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <div v-if="loading && !events.length" class="h-9 w-12 animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700 mt-1"></div>
              <p v-else class="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                {{ pastEventsCount }}
              </p>
            </div>
            <p class="text-[11px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
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
                  class="inline-flex items-center gap-2 rounded-full border px-3 py-1 font-medium transition"
                    :class="
                      activeQuickFilter === filter.id
                        ? 'border-brand-500 bg-brand-500/10 text-brand-600 dark:border-brand-400 dark:text-brand-300'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800'
                    "
                    @click="activeQuickFilter = filter.id"
                  >
                  <svg v-if="filter.id === 'lec'" viewBox="0 0 24 24" fill="none" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M4 19a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M6 2h12a2 2 0 0 1 2 2v17H6a2 2 0 0 0-2 2V4a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                  </svg>
                  <svg v-else-if="filter.id === 'lab'" viewBox="0 0 24 24" fill="none" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M2 2h8l-1 6v5l5 6v1H7v-1l5-6v-5l-1-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M14 2h8l-3 9v3l2 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else-if="filter.id === 'assessment'" viewBox="0 0 24 24" fill="none" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="none" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M7 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M7 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M7 16h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                    <path d="M5 3h14a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                    {{ filter.label }}
                  </button>
                </div>
                <button
                  type="button"
                  class="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-[11px] font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="loading"
                  @click="reload"
                >
                  <svg v-if="loading" class="h-3 w-3 animate-spin text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span v-if="loading">Loading...</span>
                  <span v-else>Refresh</span>
                </button>
              </div>

              <!-- upcoming list -->
              <div class="mt-4 space-y-2 max-h-80 overflow-y-auto custom-scrollbar">
                <div
                  v-if="loading && !upcomingList.length"
                  class="flex animate-pulse flex-col space-y-3"
                >
                  <div v-for="i in 3" :key="i" class="h-16 rounded-lg bg-gray-100 dark:bg-gray-800"></div>
                </div>

                <div
                  v-else-if="!upcomingList.length"
                  class="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-4 py-5 text-xs text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                >
                  <div class="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4 text-gray-500" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    No upcoming events for the selected filter.
                  </div>
                </div>

                <div
                  v-for="evt in upcomingList"
                  :key="evt._id"
                  class="flex items-start justify-between gap-3 rounded-lg border border-gray-100 bg-white px-3 py-2 text-xs shadow-sm transition hover:border-brand-200 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div class="flex min-w-0 items-start gap-3">
                    <div
                      class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg"
                      :class="evt.chipClass"
                      aria-hidden="true"
                    >
                      <svg
                        v-if="String(evt.type ?? '').toLowerCase() === 'lec'"
                        viewBox="0 0 24 24"
                        fill="none"
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M4 19a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M6 2h12a2 2 0 0 1 2 2v17H6a2 2 0 0 0-2 2V4a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg
                        v-else-if="String(evt.type ?? '').toLowerCase() === 'lab'"
                        viewBox="0 0 24 24"
                        fill="none"
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 2h8l-1 6v5l5 6v1H7v-1l5-6v-5l-1-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg
                        v-else-if="String(evt.type ?? '').toLowerCase() === 'assessment'"
                        viewBox="0 0 24 24"
                        fill="none"
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg
                        v-else
                        viewBox="0 0 24 24"
                        fill="none"
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M7 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M5 3h14a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="space-y-0.5 min-w-0">
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
                  v-if="loading && !nearDeadlineList.length"
                  class="flex animate-pulse flex-col space-y-2"
                >
                  <div v-for="i in 2" :key="i" class="h-14 rounded-lg bg-amber-100/50 dark:bg-amber-900/20"></div>
                </div>

                <div
                  v-else-if="!nearDeadlineList.length"
                  class="rounded-lg border border-dashed border-amber-200 bg-amber-50 px-3 py-3 text-[11px] text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-300"
                >
                  <div class="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    No deadlines in the next 7 days.
                  </div>
                </div>

                <div
                  v-for="evt in nearDeadlineList"
                  :key="evt._id"
                  class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-[11px] text-amber-800 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-200"
                >
                  <div class="flex items-start gap-3">
                    <div
                      class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg"
                      :class="evt.chipClass"
                      aria-hidden="true"
                    >
                      <svg
                        v-if="String(evt.type ?? '').toLowerCase() === 'exam'"
                        viewBox="0 0 24 24"
                        fill="none"
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M7 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M7 16h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M5 3h14a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg
                        v-else
                        viewBox="0 0 24 24"
                        fill="none"
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <p class="font-medium truncate">
                        {{ evt.title }}
                      </p>
                      <p class="mt-0.5 text-[11px] truncate">
                        {{ evt.whenLabel }} • {{ evt.moduleLabel }}
                      </p>
                      <p class="mt-0.5 font-medium">
                        Due {{ evt.timeUntil }}
                      </p>
                    </div>
                  </div>
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
                  v-if="loading && !recentPastList.length"
                  class="flex animate-pulse flex-col space-y-2"
                >
                  <div v-for="i in 2" :key="i" class="h-14 rounded-lg bg-gray-100 dark:bg-gray-800"></div>
                </div>

                <div
                  v-else-if="!recentPastList.length"
                  class="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-[11px] text-gray-500 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                >
                  <div class="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" fill="none" class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      <path d="M12 8v4l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    No events in the last 7 days.
                  </div>
                </div>

                <div
                  v-for="evt in recentPastList"
                  :key="evt._id"
                  class="rounded-lg border border-gray-100 bg-white px-3 py-2 text-[11px] text-gray-700 shadow-sm dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
                >
                  <div class="flex items-start gap-3">
                    <div
                      class="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg"
                      :class="evt.chipClass"
                      aria-hidden="true"
                    >
                      <svg
                        v-if="String(evt.type ?? '').toLowerCase() === 'lec'"
                        viewBox="0 0 24 24"
                        fill="none"
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M4 19a2 2 0 0 0 2 2h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M6 2h12a2 2 0 0 1 2 2v17H6a2 2 0 0 0-2 2V4a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg
                        v-else-if="String(evt.type ?? '').toLowerCase() === 'lab'"
                        viewBox="0 0 24 24"
                        fill="none"
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2 2h8l-1 6v5l5 6v1H7v-1l5-6v-5l-1-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg
                        v-else-if="String(evt.type ?? '').toLowerCase() === 'assessment'"
                        viewBox="0 0 24 24"
                        fill="none"
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9 11l3 3L22 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <svg
                        v-else
                        viewBox="0 0 24 24"
                        fill="none"
                        class="h-4 w-4"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M7 8h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M7 12h10" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M7 16h6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        <path d="M5 3h14a2 2 0 0 1 2 2v16l-4-2-4 2-4-2-4 2V5a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <p class="font-medium truncate">
                        {{ evt.title }}
                      </p>
                      <p class="mt-0.5 truncate">
                        {{ evt.whenLabel }} • {{ evt.moduleLabel }}
                      </p>
                      <p class="mt-0.5 text-[11px] text-gray-500 truncate">
                        {{ evt.timeUntil }}
                      </p>
                    </div>
                  </div>
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
  } catch {
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

const normalizeEventType = (value: unknown): "lec" | "lab" | "assessment" | "exam" => {
  const t = String(value ?? "").trim().toLowerCase();
  if (t === "lec" || t === "lecture") return "lec";
  if (t === "lab" || t === "practical") return "lab";
  if (t === "assessment" || t === "assignment" || t === "quiz") return "assessment";
  return "exam";
};

const parseMongoDateToIso = (value: unknown): string => {
  if (!value) return "";
  if (typeof value === "string") return value;

  if (typeof value === "object") {
    const maybe = value as Record<string, unknown>;
    const raw = maybe.$date;
    if (typeof raw === "string") return raw;
  }

  return "";
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
      type AuthUserWithSpecialization = AuthUser & { specialization_id?: string };
      await fetchModulesForContext({
        specializationId: String((authUser as AuthUserWithSpecialization)?.specialization_id ?? ""),
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
      .filter((item: unknown) => !!item && typeof item === "object")
      .map((item: unknown) => item as Record<string, unknown>)
      .map((rec) => {
        const startIso = parseMongoDateToIso(rec.startTime);
        const endIso = parseMongoDateToIso(rec.endTime);

        const startTime = startIso || "";
        const endTime = endIso || startTime;

        return {
          _id: typeof rec._id === "string" ? rec._id : undefined,
          module_id: String(rec.module_id ?? ""),
          title: String(rec.title ?? ""),
          type: normalizeEventType(rec.type) as ModuleEvent["type"],
          startTime,
          endTime,
          description: String(rec.description ?? ""),
          createdBy: String(rec.createdBy ?? ""),
        } satisfies ModuleEvent;
      })
      .filter((evt) => evt.module_id && evt.title && evt.startTime && evt.endTime);

    events.value = collected;
  } catch (err) {
    error.value = err instanceof Error ? err.message : "Failed to load events";
  } finally {
    loading.value = false;
  }
};

onMounted(reload);
</script>

