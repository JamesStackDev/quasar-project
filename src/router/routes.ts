import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('@/pages/IndexPage.vue'), meta: { requiresAuth: true } },
      {
        path: 'tasks',
        component: () => import('@/pages/TasksPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'tasks/:id',
        component: () => import('@/pages/TaskDetailPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'all-tasks',
        component: () => import('@/pages/AllTasksPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'tasks/new',
        component: () => import('@/pages/TaskFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'tasks/:id/edit',
        component: () => import('@/pages/TaskFormPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/layouts/components/AuthLayout.vue'),
    children: [{ path: '', component: () => import('@/pages/auth/LoginPage.vue') }],
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('@/pages/ErrorNotFound.vue'),
  },
];

export default routes;
