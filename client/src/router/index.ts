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
      path: "/peerpoint",
      name: "Peer Point Dashboard",
      component: () => import("../views/PeerPoint/PeerPointDashboard.vue"),
      meta: {
        title: "Peer Point Dashboard",
      },
    },
    {
      path: "/peerpoint/upload",
      name: "Upload & AI Assistance",
      component: () => import("../views/PeerPoint/UploadSection.vue"),
      meta: {
        title: "Upload & AI Assistance",
      },
    },
    {
      path: "/peerpoint/eco",
      name: "Eco-Friendly Options",
      component: () => import("../views/PeerPoint/EcoOptions.vue"),
      meta: {
        title: "Eco-Friendly Options",
      },
    },
    {
      path: "/peerpoint/customize",
      name: "Order Customization",
      component: () => import("../views/PeerPoint/OrderCustomization.vue"),
      meta: {
        title: "Order Customization",
      },
    },
    {
      path: "/peerpoint/printing",
      name: "Document Printing",
      component: () => import("../views/PeerPoint/DocumentPrinting.vue"),
      meta: {
        title: "Document Printing",
      },
    },
    {
      path: "/peerpoint/documents",
      name: "Faculty Documents",
      component: () => import("../views/PeerPoint/FacultyDocuments.vue"),
      meta: {
        title: "Faculty Documents",
      },
    },
    {
      path: "/peerpoint/payment",
      name: "Payment Page",
      component: () => import("../views/PeerPoint/PaymentPage.vue"),
      meta: {
        title: "Payment Page",
      },
    },
    {
      path: "/peerpoint/kits",
      name: "Faculty Stationery Kits",
      component: () => import("../views/PeerPoint/FacultyKits.vue"),
      meta: {
        title: "Faculty Stationery Kits",
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
  ],
});

export default router;

router.beforeEach((to, from, next) => {
  document.title = `Vue.js ${to.meta.title} | TailAdmin - Vue.js Tailwind CSS Dashboard Template`;
  next();
});
