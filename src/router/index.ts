import { defineRouter } from '#q-app';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';

import routes from './routes';
import { getToken } from '@/services/AuthService';




export default defineRouter((/* { store, ssrContext } */) => {
  const createHistory = import.meta.env.QUASAR_SERVER
    ? createMemoryHistory
    : import.meta.env.QUASAR_VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(import.meta.env.QUASAR_VUE_ROUTER_BASE),
  });
  
  
  Router.beforeEach((to, from, next) => {
    const isAuthenticated = getToken()
    const requiresAuth = to.meta.requiresAuth

    if(requiresAuth && !isAuthenticated) {
      next('/login')
    } else if (to.path === '/login' && isAuthenticated) {
      next('/tasks')
    } else {
      next()
    }
  })

  return Router;
});
