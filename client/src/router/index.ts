import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 };
  },
  routes: [
    {
      path: "/",
      name: "Ecommerce",
      component: () => import("../views/Ecommerce.vue"),
      meta: {
        title: "eCommerce Dashboard",
      },
    },
     {
      path: "/timetable",
      name: "Student Time Table",
      component: () => import("../views/Others/StdCalendar.vue"),
      meta: {
        title: "Student Time Table",
      },
    },
    {
      path: "/calendar",
      name: "Calendar",
      component: () => import("../views/Others/Calendar.vue"),
      meta: {
        title: "Calendar",
      },
    },
    {
      path: "/profile",
      name: "Profile",
      component: () => import("../views/Others/UserProfile.vue"),
      meta: {
        title: "Profile",
      },
    },
    {
      path: "/form-elements",
      name: "Form Elements",
      component: () => import("../views/Forms/FormElements.vue"),
      meta: {
        title: "Form Elements",
      },
    },
    {
      path: "/basic-tables",
      name: "Kuppi Sessions",
      component: () => import("../views/Tables/BasicTables.vue"),
      meta: {
        title: "Kuppi Sessions",
      },
    },
    {
      path: "/kuppi-sessions-duplicate",
      name: "KuppiSessionsDuplicate",
      component: () => import("../views/Tables/KuppiSessionsDuplicate.vue"),
      meta: {
        title: "Kuppi Sessions",
      },
    },
    {
      path: "/mongo-table",
      name: "Mongo Table",
      component: () => import("../views/Tables/MongoTable.vue"),
      meta: {
        title: "Mongo Table",
      },
    },
    {
      path: "/users-table",
      name: "Users Table",
      component: () => import("../views/Tables/UsersTable.vue"),
      meta: {
        title: "Users Table",
      },
    },
    {
      path: "/products-table",
      name: "Products Table",
      component: () => import("../views/Tables/ProductsTable.vue"),
      meta: {
        title: "Products Table",
      },
    },
    {
      path: "/comments-table",
      name: "Comments Table",
      component: () => import("../views/Tables/CommentsTable.vue"),
      meta: {
        title: "Comments Table",
      },
    },
    {
      path: "/role-management",
      name: "Role Management",
      component: () => import("../views/Admin/RoleManagement.vue"),
      meta: {
        title: "Role Management",
        requiresAdmin: true,
      },
    },
    {
      path: "/line-chart",
      name: "Line Chart",
      component: () => import("../views/Chart/LineChart/LineChart.vue"),
    },
    {
      path: "/bar-chart",
      name: "Bar Chart",
      component: () => import("../views/Chart/BarChart/BarChart.vue"),
    },
    {
      path: "/alerts",
      name: "Alerts",
      component: () => import("../views/UiElements/Alerts.vue"),
      meta: {
        title: "Alerts",
      },
    },
    {
      path: "/avatars",
      name: "Avatars",
      component: () => import("../views/UiElements/Avatars.vue"),
      meta: {
        title: "Avatars",
      },
    },
    {
      path: "/badge",
      name: "Badge",
      component: () => import("../views/UiElements/Badges.vue"),
      meta: {
        title: "Badge",
      },
    },

    {
      path: "/buttons",
      name: "Buttons",
      component: () => import("../views/UiElements/Buttons.vue"),
      meta: {
        title: "Buttons",
      },
    },

    {
      path: "/images",
      name: "Images",
      component: () => import("../views/UiElements/Images.vue"),
      meta: {
        title: "Images",
      },
    },
    {
      path: "/videos",
      name: "Videos",
      component: () => import("../views/UiElements/Videos.vue"),
      meta: {
        title: "Videos",
      },
    },
    {
      path: "/blank",
      name: "Blank",
      component: () => import("../views/Pages/BlankPage.vue"),
      meta: {
        title: "Blank",
      },
    },

    {
      path: "/kuppi-sessions",
      name: "Kuppi Sessions",
      component: () => import("../views/KuppiSessions/KuppiSessionsList.vue"),
      meta: {
        title: "Kuppi Sessions",
      },
    },
    {
      path: "/kuppi-sessions/:id",
      name: "Kuppi Session Detail",
      component: () => import("../views/KuppiSessions/KuppiSessionDetail.vue"),
      meta: {
        title: "Kuppi Session Detail",
      },
    },

    {
      path: "/error-404",
      name: "404 Error",
      component: () => import("../views/Errors/FourZeroFour.vue"),
      meta: {
        title: "404 Error",
      },
    },

    {
      path: "/signin",
      name: "Signin",
      component: () => import("../views/Auth/Signin.vue"),
      meta: {
        title: "Signin",
      },
    },
    {
      path: "/signup",
      name: "Signup",
      component: () => import("../views/Auth/Signup.vue"),
      meta: {
        title: "Signup",
      },
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("../views/Errors/FourZeroFour.vue"),
      meta: {
        title: "404 Error",
      },
    },
  ],
});

export default router;
import { createRouter, createWebHistory } from 'vue-router'

/* ----------------------------- Helper functions ----------------------------- */
const readAuthUser = () => {
  const raw = localStorage.getItem('authUser') || sessionStorage.getItem('authUser')
  if (!raw) return null

  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

const isAdminUser = () => {
  const user = readAuthUser()

  const roles = Array.isArray(user?.roles)
    ? user.roles
    : Array.isArray(user?.role)
<<<<<<< HEAD
    ? user.role
    : user?.role
    ? [user.role]
    : [];
  return roles.some((role: string) => String(role).toLowerCase() === "admin");
};
=======
      ? user.role
      : user?.role
        ? [user.role]
        : []
>>>>>>> 8378b680edcd58b1235eb9c0a0db6e102c0a14ff

  return roles.some(role => String(role).toLowerCase() === 'admin')
}

/* --------------------------------- Router ---------------------------------- */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to, from, savedPosition) {
    return savedPosition || { left: 0, top: 0 }
  },
  routes: [
    // {
    //   path: '/',
    //   name: 'Ecommerce',
    //   component: () => import('../views/Ecommerce.vue'),
    //   meta: { title: 'eCommerce Dashboard' },
    // },

    // Student
    {
      path: '/',
      name: 'StudentDashboard',
      component: () => import('../views/Student/StudentDashboard.vue'),
      meta: { title: 'Student Dashboard' },
    },

    // PeerPoint
    {
      path: '/peerpoint',
      name: 'PeerPointDashboard',
      component: () => import('../views/PeerPoint/PeerPointDashboard.vue'),
      meta: { title: 'Peer Point Dashboard' },
    },
    {
      path: '/peerpoint/upload',
      name: 'UploadAIAssistance',
      component: () => import('../views/PeerPoint/UploadSection.vue'),
      meta: { title: 'Upload & AI Assistance' },
    },
    {
      path: '/peerpoint/eco',
      name: 'EcoFriendlyOptions',
      component: () => import('../views/PeerPoint/EcoOptions.vue'),
      meta: { title: 'Eco-Friendly Options' },
    },
    {
      path: '/peerpoint/customize',
      name: 'OrderCustomization',
      component: () => import('../views/PeerPoint/OrderCustomization.vue'),
      meta: { title: 'Order Customization' },
    },
    {
      path: '/peerpoint/printing',
      name: 'DocumentPrinting',
      component: () => import('../views/PeerPoint/DocumentPrinting.vue'),
      meta: { title: 'Document Printing' },
    },
    {
      path: '/peerpoint/documents',
      name: 'FacultyDocuments',
      component: () => import('../views/PeerPoint/FacultyDocuments.vue'),
      meta: { title: 'Faculty Documents' },
    },
    {
      path: '/peerpoint/payment',
      name: 'PaymentPage',
      component: () => import('../views/PeerPoint/PaymentPage.vue'),
      meta: { title: 'Payment Page' },
    },
    {
      path: '/peerpoint/kits',
      name: 'FacultyStationeryKits',
      component: () => import('../views/PeerPoint/FacultyKits.vue'),
      meta: { title: 'Faculty Stationery Kits' },
    },

    // Calendar & Timetable
    {
      path: '/calendar',
      name: 'Calendar',
      component: () => import('../views/Others/Calendar.vue'),
      meta: { title: 'Calendar' },
    },
    {
      path: '/timetable',
      name: 'StudentTimeTable',
      component: () => import('../views/Others/StdCalendar.vue'),
      meta: { title: 'Student Time Table' },
    },
    {
      path: '/my-module-timetable',
      name: 'MyModuleTimetable',
      component: () => import('../views/Others/ModuleEventsCalendar.vue'),
      meta: { title: 'My Module Timetable' },
    },

    // Profile & Forms
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('../views/Others/UserProfile.vue'),
      meta: { title: 'Profile' },
    },
    {
      path: '/form-elements',
      name: 'FormElements',
      component: () => import('../views/Forms/FormElements.vue'),
      meta: { title: 'Form Elements' },
    },
    {
      path: '/student-request',
      name: 'StudentRequest',
      component: () => import('../views/Forms/StudentRequestForm.vue'),
      meta: { title: 'Student Request' },
    },

    // Tables
    {
      path: '/basic-tables',
      name: 'BasicTables',
      component: () => import('../views/Tables/BasicTables.vue'),
      meta: { title: 'Basic Tables' },
    },
    {
      path: '/mongo-table',
      name: 'MongoTable',
      component: () => import('../views/Tables/MongoTable.vue'),
      meta: { title: 'Mongo Table' },
    },
    {
      path: '/users-table',
      name: 'UsersTable',
      component: () => import('../views/Tables/UsersTable.vue'),
      meta: { title: 'Users Table' },
    },
    {
      path: '/products-table',
      name: 'ProductsTable',
      component: () => import('../views/Tables/ProductsTable.vue'),
      meta: { title: 'Products Table' },
    },
    {
      path: '/my-modules',
      name: 'MyModules',
      component: () => import('../views/Tables/MyModules.vue'),
      meta: { title: 'My Modules' },
    },
    {
      path: '/comments-table',
      name: 'CommentsTable',
      component: () => import('../views/Tables/CommentsTable.vue'),
      meta: { title: 'Comments Table' },
    },

    // Admin
    {
      path: '/role-management',
      name: 'RoleManagement',
      component: () => import('../views/Admin/RoleManagement.vue'),
      meta: { title: 'Role Management', requiresAdmin: true },
    },
    {
      path: '/admin/module-events',
      name: 'ModuleEventsAdmin',
      component: () => import('../views/Admin/ModuleEventsAdmin.vue'),
      meta: { title: 'Module Events Admin', requiresAdmin: true },
    },
    {
      path: '/admin-student-requests',
      name: 'AdminStudentRequests',
      component: () => import('../views/Admin/StudentRequests.vue'),
      meta: { title: 'Admin Student Requests', requiresAdmin: true },
    },

    // Charts
    {
      path: '/line-chart',
      name: 'LineChart',
      component: () => import('../views/Chart/LineChart/LineChart.vue'),
      meta: { title: 'Line Chart' },
    },
    {
      path: '/bar-chart',
      name: 'BarChart',
      component: () => import('../views/Chart/BarChart/BarChart.vue'),
      meta: { title: 'Bar Chart' },
    },

    // ConnectU
    {
      path: '/connect-u/mental-health',
      name: 'MentalHealthSupport',
      component: () => import('../views/ConnectU/PHelperList.vue'),
      meta: { title: 'Mental Health Support' },
    },
    {
      path: '/connect-u/mental-health/apply',
      name: 'BecomeAHelper',
      component: () => import('../views/ConnectU/BecomeHelper.vue'),
      meta: { title: 'Become a Helper' },
    },
    {
      path: '/connect-u/mental-health/admin',
      name: 'AdminValidateHelpers',
      component: () => import('../views/ConnectU/AdminHelperValidation.vue'),
      meta: { title: 'Admin Validation' },
    },
    {
      path: '/connect-u/chat/:conversationId',
      name: 'ChatConsultation',
      component: () => import('../views/ConnectU/ChatView.vue'),
      meta: { title: 'Consultation' },
    },
    {
      path: '/connect-u/messages',
      name: 'ChatInbox',
      component: () => import('../views/ConnectU/ChatInbox.vue'),
      meta: { title: 'My Messages' },
    },
    {
      path: '/connect-u/mental-health/:id',
      name: 'PsychologicalHelperProfile',
      component: () => import('../views/ConnectU/PHelperProfile.vue'),
      meta: { title: 'Helper Profile' },
    },

    // UI
    {
      path: '/alerts',
      name: 'Alerts',
      component: () => import('../views/UiElements/Alerts.vue'),
      meta: { title: 'Alerts' },
    },
    {
      path: '/avatars',
      name: 'Avatars',
      component: () => import('../views/UiElements/Avatars.vue'),
      meta: { title: 'Avatars' },
    },
    {
      path: '/badge',
      name: 'Badge',
      component: () => import('../views/UiElements/Badges.vue'),
      meta: { title: 'Badge' },
    },
    {
      path: '/buttons',
      name: 'Buttons',
      component: () => import('../views/UiElements/Buttons.vue'),
      meta: { title: 'Buttons' },
    },
    {
      path: '/images',
      name: 'Images',
      component: () => import('../views/UiElements/Images.vue'),
      meta: { title: 'Images' },
    },
    {
      path: '/videos',
      name: 'Videos',
      component: () => import('../views/UiElements/Videos.vue'),
      meta: { title: 'Videos' },
    },

    // Pages & Auth
    {
      path: '/blank',
      name: 'Blank',
      component: () => import('../views/Pages/BlankPage.vue'),
      meta: { title: 'Blank' },
    },
    {
      path: '/signin',
      name: 'Signin',
      component: () => import('../views/Auth/Signin.vue'),
      meta: { title: 'Signin', public: true },
    },
    {
      path: '/signup',
      name: 'Signup',
      component: () => import('../views/Auth/Signup.vue'),
      meta: { title: 'Signup', public: true },
    },
    {
      path: '/error-404',
      name: 'Error404',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: { title: '404 Error', public: true },
    },

    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/Errors/FourZeroFour.vue'),
      meta: { title: '404 Error', public: true },
    },
  ],
})

/* ------------------------------ Navigation guard ----------------------------- */
router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title || 'TailAdmin'} | TailAdmin`

  const isPublicRoute = to.matched.some(record => record.meta.public === true)
  const hasUser = Boolean(readAuthUser())

  if (!isPublicRoute && !hasUser) {
    next({ path: '/signin', query: { redirect: to.fullPath } })
    return
  }

  if (isPublicRoute && hasUser && (to.path === '/signin' || to.path === '/signup')) {
    next({ path: '/' })
    return
  }

  if (to.matched.some(record => record.meta.requiresAdmin) && !isAdminUser()) {
    next({ path: '/' })
    return
  }

  next()
})

export default router