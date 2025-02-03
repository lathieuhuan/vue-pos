import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/ViewHome/ViewHome.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/orders-management",
      name: "orders-management",
      component: () => import("../views/ViewOrderManager/ViewOrderManager.vue"),
    },
  ],
});

export default router;
