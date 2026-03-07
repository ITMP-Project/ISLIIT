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
      path: "/connect-u/mental-health",
      name: "Mental Health Support",
      component: () => import("../views/ConnectU/PHelperList.vue"),
      meta: {
        title: "Mental Health Support",
      },
    },
    {
      path: "/connect-u/mental-health/:id",
      name: "Psychological Helper Profile",
      component: () => import("../views/ConnectU/PHelperProfile.vue"),
      meta: {
        title: "Helper Profile",
      },
    },
    {
      path: "/basic-tables",
      name: "Basic Tables",
      component: () => import("../views/Tables/BasicTables.vue"),
      meta: {
        title: "Basic Tables",
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

const readAuthUser = () => {
  const raw = localStorage.getItem("authUser") || sessionStorage.getItem("authUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
};

const isAdminUser = () => {
  const user = readAuthUser();
  const roles = Array.isArray(user?.roles)
    ? user.roles
    : Array.isArray(user?.role)
      ? user.role
      : user?.role
        ? [user.role]
        : [];
  return roles.some((role: any) => String(role).toLowerCase() === "admin");
};

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`;

  const isPublicRoute =
    to.path === "/signin" || to.path === "/signup" || to.path === "/error-404";
  const hasUser = Boolean(readAuthUser());

  if (!isPublicRoute && !hasUser) {
    next({ path: "/signin", query: { redirect: to.fullPath } });
    return;
  }

  if (isPublicRoute && hasUser) {
    next({ path: "/" });
    return;
  }

  if (to.meta.requiresAdmin && !isAdminUser()) {
    next({ path: "/" });
    return;
  }

  next();
});
