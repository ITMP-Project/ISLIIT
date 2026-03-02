<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="flex items-center gap-3 rounded-full px-2 py-1 text-gray-700 transition
             hover:bg-gray-100 focus:outline-none focus-visible:ring-2
             focus-visible:ring-brand-500 dark:text-gray-300 dark:hover:bg-white/5"
      type="button"
      aria-haspopup="menu"
      :aria-expanded="dropdownOpen"
      @click.prevent="toggleDropdown"
    >
      <span
        class="flex h-11 w-11 items-center justify-center rounded-full bg-brand-500
               text-sm font-semibold text-white shadow-sm"
      >
        {{ userInitials }}
      </span>

      <div class="flex items-center gap-1">
        <span class="block max-w-[120px] truncate font-medium text-theme-sm">
          {{ authUser?.username || 'User' }}
        </span>
        <ChevronDownIcon
          class="h-4 w-4 transition-transform duration-200"
          :class="{ 'rotate-180': dropdownOpen }"
        />
      </div>
    </button>

    <transition
      enter-active-class="transition ease-out duration-150"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-100"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <div
        v-if="dropdownOpen"
        class="absolute right-0 mt-3 w-[260px] rounded-2xl border border-gray-200
               bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
        role="menu"
      >
        <div class="flex items-center gap-3 border-b border-gray-200 px-2 pb-3 dark:border-gray-800">
          <span
            class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500
                   text-xs font-semibold text-white"
          >
            {{ userInitials }}
          </span>
          <div class="space-y-1">
            <span class="block text-theme-sm font-medium text-gray-800 dark:text-white">
              {{ authUser?.username || 'User' }}
            </span>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="chip in roleChips"
                :key="chip.label"
                class="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                :class="chip.class"
              >
                {{ chip.label }}
              </span>
            </div>
          </div>
        </div>

        <ul class="mt-3 flex flex-col gap-1">
          <li v-for="item in menuItems" :key="item.href">
            <router-link
              :to="item.href"
              class="group flex items-center gap-3 rounded-xl px-3 py-2 text-theme-sm font-medium
                     text-gray-700 transition hover:bg-gray-100 hover:text-gray-900
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500
                     dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
              role="menuitem"
            >
              <component
                :is="item.icon"
                class="h-5 w-5 text-gray-400 transition group-hover:text-gray-700
                       dark:text-gray-500 dark:group-hover:text-gray-300"
              />
              <span>{{ item.text }}</span>
            </router-link>
          </li>
        </ul>

        <button
          type="button"
          class="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-theme-sm font-medium
                 text-red-600 transition hover:bg-red-50 focus-visible:outline-none
                 focus-visible:ring-2 focus-visible:ring-red-500 dark:text-red-400
                 dark:hover:bg-red-500/10"
          @click="handleSignOut"
          role="menuitem"
        >
          <LogoutIcon class="h-5 w-5" />
          <span>Sign out</span>
        </button>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ChevronDownIcon, LogoutIcon, UserCircleIcon } from '@/icons'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthUser } from '@/composables/useAuthUser'

const router = useRouter()

const dropdownOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const { authUser, userInitials, roleChips } = useAuthUser()

const menuItems = [
  { href: '/profile', icon: UserCircleIcon, text: 'Profile' },
]

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value
}

const closeDropdown = () => {
  dropdownOpen.value = false
}

const handleSignOut = () => {
  localStorage.removeItem('authUser')
  sessionStorage.removeItem('authUser')
  closeDropdown()
  router.push('/signin')
}

const handleClickOutside = (event: Event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    closeDropdown()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
