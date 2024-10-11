import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/orders-management',
      name: 'orders-management',
      component: () => import('../views/OrdersManageView/OrdersManageView.vue'),
    },
  ],
});

export default router;
