<template>
  <aside
    :class="[
      'fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-99999 border-r border-gray-200',
      {
        'lg:w-[290px]': isExpanded || isMobileOpen || isHovered,
        'lg:w-[90px]': !isExpanded && !isHovered,
        'translate-x-0 w-[290px]': isMobileOpen,
        '-translate-x-full': !isMobileOpen,
        'lg:translate-x-0': true,
      },
    ]"
    @mouseenter="!isExpanded && (isHovered = true)"
    @mouseleave="isHovered = false"
  >
    <div :class="['py-8 flex', !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start']">
      <router-link to="/">
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="dark:hidden"
          src="/images/logo/logo.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img
          v-if="isExpanded || isHovered || isMobileOpen"
          class="hidden dark:block"
          src="/images/logo/logo-dark.svg"
          alt="Logo"
          width="150"
          height="40"
        />
        <img v-else src="/images/logo/logo-icon.svg" alt="Logo" width="32" height="32" />
      </router-link>
    </div>

    <div class="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
      <nav class="mb-6">
        <div class="flex flex-col gap-4">
          <div v-for="(menuGroup, groupIndex) in menuGroups" :key="groupIndex">
            <h2
              :class="[
                'mb-4 text-xs uppercase flex leading-[20px] text-gray-400',
                !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start',
              ]"
            >
              <template v-if="isExpanded || isHovered || isMobileOpen">
                {{ menuGroup.title }}
              </template>
              <HorizontalDots v-else />
            </h2>

            <ul class="flex flex-col gap-4">
              <li v-for="(item, index) in menuGroup.items" :key="item.name">
                <button
                  v-if="item.subItems"
                  @click="toggleSubmenu(groupIndex, index)"
                  :class="[
                    'menu-item group w-full',
                    {
                      'menu-item-active': isSubmenuOpen(groupIndex, index),
                      'menu-item-inactive': !isSubmenuOpen(groupIndex, index),
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isSubmenuOpen(groupIndex, index)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>

                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ item.name }}
                  </span>

                  <ChevronDownIcon
                    v-if="isExpanded || isHovered || isMobileOpen"
                    :class="[
                      'ml-auto w-5 h-5 transition-transform duration-200',
                      {
                        'rotate-180 text-brand-500': isSubmenuOpen(groupIndex, index),
                      },
                    ]"
                  />
                </button>

                <router-link
                  v-else-if="item.path"
                  :to="item.path"
                  :class="[
                    'menu-item group',
                    {
                      'menu-item-active': isActive(item.path),
                      'menu-item-inactive': !isActive(item.path),
                    },
                    !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start',
                  ]"
                >
                  <span
                    :class="[
                      isActive(item.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive',
                    ]"
                  >
                    <component :is="item.icon" />
                  </span>

                  <span v-if="isExpanded || isHovered || isMobileOpen" class="menu-item-text">
                    {{ item.name }}
                  </span>
                </router-link>

                <transition
                  @enter="startTransition"
                  @after-enter="endTransition"
                  @before-leave="startTransition"
                  @after-leave="endTransition"
                >
                  <div
                    v-show="
                      isSubmenuOpen(groupIndex, index) && (isExpanded || isHovered || isMobileOpen)
                    "
                  >
                    <ul class="mt-2 space-y-1 ml-9">
                      <li
                        v-for="subItem in item.subItems"
                        :key="subItem.name"
                        v-show="!subItem.adminOnly || isAdmin"
                      >
                        <router-link
                          :to="subItem.path"
                          :class="[
                            'menu-dropdown-item',
                            {
                              'menu-dropdown-item-active': isActive(subItem.path),
                              'menu-dropdown-item-inactive': !isActive(subItem.path),
                            },
                          ]"
                        >
                          {{ subItem.name }}

                          <span class="flex items-center gap-1 ml-auto">
                            <span
                              v-if="subItem.new"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(subItem.path),
                                  'menu-dropdown-badge-inactive': !isActive(subItem.path),
                                },
                              ]"
                            >
                              new
                            </span>

                            <span
                              v-if="subItem.pro"
                              :class="[
                                'menu-dropdown-badge',
                                {
                                  'menu-dropdown-badge-active': isActive(subItem.path),
                                  'menu-dropdown-badge-inactive': !isActive(subItem.path),
                                },
                              ]"
                            >
                              pro
                            </span>
                          </span>
                        </router-link>
                      </li>
                    </ul>
                  </div>
                </transition>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import {
  GridIcon,
  UserCircleIcon,
  DocsIcon,
  ChevronDownIcon,
  HorizontalDots,
  ListIcon,
  ShieldCheckIcon,
  UsersIcon,
} from '../../icons'

import BoxCubeIcon from '@/icons/BoxCubeIcon.vue'
import ChatIcon from '@/icons/ChatIcon.vue'
import { useSidebar } from '@/composables/useSidebar'
import { useAuthUser } from '@/composables/useAuthUser'

const route = useRoute()
const { isExpanded, isMobileOpen, isHovered, openSubmenu } = useSidebar()
const { authUser } = useAuthUser()

const isAdmin = computed(() => {
  const user = authUser.value
  const roles = Array.isArray(user?.roles)
    ? user.roles
    : Array.isArray(user?.role)
      ? user.role
      : user?.role
        ? [user.role]
        : []

  return roles.some((role) => String(role).toLowerCase() === 'admin')
})

const menuGroups = [
  {
    title: 'Menu',
    items: [
      {
        icon: GridIcon,
        name: 'User Profile',
        path: '/profile',
        name: 'Modules Sessions',
        subItems: [
          {
            icon: GridIcon,
            name: 'My Dashboard',
            path: '/',
            pro: false,
          },
          {
            icon: UserCircleIcon,
            name: 'My Timetable',
            path: '/my-module-timetable',
            pro: false,
          },
          {
            icon: GridIcon,
            name: 'My Modules',
            path: '/my-modules',
            pro: false,
          },
          // {
          //   icon: CalenderIcon,
          //   name: 'Student Time Table',
          //   path: '/timetable',
          // },
          // {
          //   icon: GridIcon,
          //   name: 'Ecommerce Overview',
          //   path: '/',
          //   pro: false,
          // },
        ],
      },

      // {
      //   icon: CalenderIcon,
      //   name: 'Calendar',
      //   path: '/calendar',
      // },
      {
        icon: ChatIcon,
        name: 'Kuppi Sessions',
        subItems: [
          { name: 'Browse Kuppi Sessions', path: '/kuppi-sessions', pro: false },
          { name: 'Create a Kuppi Session', path: '/kuppi-sessions/create', pro: false },
        ],
      },
      {
        name: 'Connect U',
        icon: ListIcon,
        subItems: [
          { name: 'Mental Support', path: '/connect-u/mental-health', pro: false },
          { name: 'Academic Support', path: '/connect-u/academic-support', pro: false },
          { name: 'Academic Admin', path: '/admin/academic', pro: false, adminOnly: true },
        ],
      },
      {
        icon: DocsIcon,
        name: 'Peer Point',
        subItems: [
          { name: 'Document Printing', path: '/peerpoint/printing', pro: false },
          { name: 'Faculty Documents', path: '/peerpoint/documents', pro: false },
          { name: 'Faculty Stationery Kits', path: '/peerpoint/kits', pro: false },
        ],
      },
      {
        icon: ShieldCheckIcon,
        name: 'Admin Management',
        subItems: [
          // { name: "Kuppi Sessions", path: "/kuppi-sessions-duplicate", pro: false },
          // { name: "Comments Table", path: "/comments-table", pro: false },

          {
            icon: GridIcon,
            name: 'Module Events (Admin)',
            path: '/admin/module-events',
            pro: false,
            adminOnly: true,
          },
          {
            icon: BoxCubeIcon,
            name: 'Student Requests (Admin)',
            path: '/admin-student-requests',
            pro: false,
            adminOnly: true,
          },
          {
            icon: BoxCubeIcon,
            name: 'Role Management',
            path: '/role-management',
            pro: false,
            adminOnly: true,
          },
        ],
      },
      {
        icon: UsersIcon,
        name: 'Student Management',
        subItems: [
          {
            icon: BoxCubeIcon,
            name: 'Submit Request',
            path: '/student-request',
            pro: false,
          },
          // {
          //   icon: CalenderIcon,
          //   name: 'Calendar',
          //   path: '/calendar',
          //   pro: false,
          // },
          // {
          //   icon: UserCircleIcon,
          //   name: 'Profile',
          //   path: '/profile',
          //   pro: false,
          // },
        ],
      },
      {
        icon: UserCircleIcon,
        name: 'User Profile',
        path: '/profile',
      },

      // {
      //   name: 'Forms',
      //   icon: ListIcon,
      //   subItems: [
      //     {
      //       icon: ListIcon,
      //       name: 'Form Elements',
      //       path: '/form-elements',
      //       pro: false,
      //     },
      //   ],
      // },
      // {
      //   name: 'Tables',
      //   icon: TableIcon,
      //   subItems: [
      //     {
      //       icon: TableIcon,
      //       name: 'Basic Tables',
      //       path: '/basic-tables',
      //       pro: false,
      //     },
      //   ],
      // },
      // {
      //   name: 'Pages',
      //   icon: PageIcon,
      //   subItems: [
      //     {
      //       icon: PageIcon,
      //       name: 'Blank Page',
      //       path: '/blank',
      //       pro: false,
      //     },
      //     {
      //       icon: PageIcon,
      //       name: '404 Page',
      //       path: '/error-404',
      //       pro: false,
      //     },
      //   ],
      // },
    ],
  },
  // {
  //   title: 'Others',
  //   items: [
  //     {
  //       icon: PieChartIcon,
  //       name: 'Charts',
  //       subItems: [
  //         {
  //           icon: PieChartIcon,
  //           name: 'Line Chart',
  //           path: '/line-chart',
  //           pro: false,
  //         },
  //         {
  //           icon: PieChartIcon,
  //           name: 'Bar Chart',
  //           path: '/bar-chart',
  //           pro: false,
  //         },
  //       ],
  //     },
  //     {
  //       icon: BoxCubeIcon,
  //       name: 'UI Elements',
  //       subItems: [
  //         {
  //           icon: BoxCubeIcon,
  //           name: 'Alerts',
  //           path: '/alerts',
  //           pro: false,
  //         },
  //         {
  //           icon: BoxCubeIcon,
  //           name: 'Avatars',
  //           path: '/avatars',
  //           pro: false,
  //         },
  //         {
  //           icon: BoxCubeIcon,
  //           name: 'Badge',
  //           path: '/badge',
  //           pro: false,
  //         },
  //         {
  //           icon: BoxCubeIcon,
  //           name: 'Buttons',
  //           path: '/buttons',
  //           pro: false,
  //         },
  //         {
  //           icon: BoxCubeIcon,
  //           name: 'Images',
  //           path: '/images',
  //           pro: false,
  //         },
  //         {
  //           icon: BoxCubeIcon,
  //           name: 'Videos',
  //           path: '/videos',
  //           pro: false,
  //         },
  //       ],
  //     },
  //     {
  //       icon: PlugInIcon,
  //       name: 'Authentication',
  //       subItems: [
  //         {
  //           icon: PlugInIcon,
  //           name: 'Sign In',
  //           path: '/signin',
  //           pro: false,
  //         },
  //         {
  //           icon: PlugInIcon,
  //           name: 'Sign Up',
  //           path: '/signup',
  //           pro: false,
  //         },
  //       ],
  //     },
  //   ],
  // },
]

const isActive = (path) => route.path === path

const toggleSubmenu = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`
  openSubmenu.value = openSubmenu.value === key ? null : key
}

const isAnySubmenuRouteActive = computed(() => {
  return menuGroups.some((group) =>
    group.items.some(
      (item) => item.subItems && item.subItems.some((subItem) => isActive(subItem.path)),
    ),
  )
})

const isSubmenuOpen = (groupIndex, itemIndex) => {
  const key = `${groupIndex}-${itemIndex}`
  return (
    openSubmenu.value === key ||
    (isAnySubmenuRouteActive.value &&
      menuGroups[groupIndex].items[itemIndex].subItems?.some((subItem) => isActive(subItem.path)))
  )
}

const startTransition = (el) => {
  el.style.height = 'auto'
  const height = el.scrollHeight
  el.style.height = '0px'
  el.offsetHeight
  el.style.height = `${height}px`
}

const endTransition = (el) => {
  el.style.height = ''
}
</script>
