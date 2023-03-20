import { createRouter, createWebHistory } from "vue-router";
import { useUserStore } from "@/store/user";
// import enums from "@/composables/enums";

const routes = [
  {
    path: "/",
    name: "login",
    component: () => import("@/pages/LoginPage"),
  },
  {
    path: "/signup",
    name: "signup",
    component: () => import("@/pages/SignUp"),
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: () => import("@/pages/doctor/ResetPassword"),
  },
  {
    path: "/",
    component: () => import("@/pages/PracticeDashboard"),
    children: [

      {
        path: "dashboard",
        name: "dashboard",
        component: () => import("@/pages/DashBoard"),
      },
      {
        path: "/profile",
        name: "profile",
        component: () => import("@/pages/PatientDetail"),
      },
      {
        path: "/settings",
        name: "settings",
        component: () => import("@/pages/PatientSettings"),
      },
      {
        path: "notifications",
        name: "notifications",
        component: () => import("@/pages/notification/NotificationsMain"),
      },
      {
        path: "patients",
        component: () => import("@/pages/RouterView"),
        children: [
          {
            path: "",
            name: "all-patients",
            component: () => import("@/pages/AllPatients"),
          },
          {
            path: "patient-detail/:id",
            name: "patient-detail",
            component: () => import("@/pages/PatientDetail"),
          },
          {
            path: "searchpatient",
            name: "searchpatient",
            component: () => import("@/pages/patient/SearchPatient"),
          },
        ],
      },
      {
        path: "doctors",
        component: () => import("@/pages/RouterView"),
        children: [
          {
            path: "",
            meta: { permissions: ["practice"] },
            component: () => import("@/pages/AllDoctors"),
            name: "doctors",
          },
          {
            path: ":id",
            name: "doctor-detail",
            component: () => import("@/pages/DoctorDetail"),
            meta: { permissions: ["practice"] },
          },
        ],
      },
      {
        path: "configurations",
        name: "configurations",
        component: () => import("@/pages/ConfigurationMain"),
      },
      {
        path: "appointments",
        component: () => import("@/pages/routerview/RouterView"),
        children: [
          {
            path: '',
            name: "all-appointments",
            meta: { permissions: ["practice"] },
            component: () => import("@/pages/AllAppointments"),
          },
          {
            path: "detail/:id",
            name: "appointment-detail",
            component: () => import("@/pages/vitals"),
            meta: { permissions: ["practice"] },
          },
          {
            path: "create-appointment",
            name: "create-appointment",
            component: () => import("@/pages/CreateAppointment"),
            meta: { permissions: ["practice"] },
          },
        ],
      },
      {
        path: "/activitylog",
        name: "activitylog",
        component: () => import("@/pages/ActivityLog"),
        meta: { permissions: ["practice"] },
      },
      {
        path: "staff",
        component: () => import("@/pages/RouterView"),
        children: [
          {
            path: "",
            component: () => import("@/pages/AllStaff"),
          },
          {
            path: "register-staff",
            name: "staff-registration",
            component: () => import("@/pages/RegisterStaff"),
          },
          {
            path: "detail/:id",
            name: 'staff-details',
            component: () => import("@/pages/StaffDetail"),
          },
          {
            path: "update/:id",
            name: "update-staff",
            component: () => import("@/pages/UpdateStaff"),
          },
        ],
      },
    ],
  },
  {
    path: "/doctor",
    name: "doctor-dashboard",
    component: () => import("@/pages/PracticeDashboard"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});
const loginRoutes = ["login", "signup", 'reset-password'];
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  const token = userStore.$state.loginUser.token ? true : false;
  // let password_not_reset = false;
  // let registration_not_completed = false;
  // let kyc_status_not_approved = false;
  // let is_allowed = true;
  // let dashboard = "";

  // if (token) {
  //   password_not_reset =
  //     token && userStore.loginUser.is_password_reset == false;
  //   registration_not_completed =
  //     token &&
  //     userStore.loginUser.role == enums.permissions.doctor.role &&
  //     userStore.loginUser.account_registration == false;
  //   kyc_status_not_approved =
  //     token &&
  //     userStore.loginUser.role == enums.permissions.doctor.role &&
  //     userStore.loginUser.kyc_status != "Accepted";
  //   is_allowed =
  //     to.meta && to.meta.permissions
  //       ? to.meta.permissions.includes(userStore.loginUser.role)
  //       : true;
  //   dashboard =
  //     userStore.loginUser.role == "doctor" ? "doctor-dashboard" : "dashboard";
  // }

  if (!loginRoutes.includes(to.name) && !token) {
    next({ name: "login" });
  }
  else {
    next();
  }
  //  else {
  //   if (to.name !== "reset-password" && password_not_reset) {
  //     next({ name: "reset-password" });
  //   } else if (to.name == "reset-password" && password_not_reset) {
  //     next();
  //   } else if (to.name !== "doctor-main" && registration_not_completed) {
  //     next({ name: "doctor-main" });
  //   } else if (to.name == "doctor-main" && registration_not_completed) {
  //     next();
  //   } else if (to.name !== "kyc-approval" && kyc_status_not_approved) {
  //     next({ name: "kyc-approval" });
  //   } else if (to.name == "kyc-approval" && kyc_status_not_approved) {
  //     next();
  //   } else if (!is_allowed && to.name !== dashboard) next({ name: dashboard });
  //   else if (!is_allowed && to.name == dashboard) next();
  //   else {
  //     next();
  //   }
  // }
});

export default router;
