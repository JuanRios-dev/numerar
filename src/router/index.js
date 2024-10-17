import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/AuthStore'

const routes = [
  /* AUTHENTICATION */
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Auth/AuthLogin.vue'),
    meta: {
      requiredAuth: false
    }
  },

  /* VISTA PRINCIPAL */
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    meta: {
      requiredAuth: true
    }
  },

  /* CRUD */
  {
    path: '/customers',
    name: 'customers',
    component: () => import('@/views/CustomerViews/CustomerTable.vue'),
    meta: {
      requiredAuth: true
    }
  },

  {
    path: '/providers',
    name: 'providers',
    component: () => import('@/views/ProviderViews/ProviderTable.vue'),
    meta: {
      requiredAuth: true
    }
  },

  {
    path: '/products',
    name: 'products',
    component: () => import('@/views/ProductViews/ProductTable.vue'),
    meta: {
      requiredAuth: true
    }
  },

  {
    path: '/companies',
    name: 'companies',
    component: () => import('@/views/CompanyViews/CompanyTable.vue'),
    meta: {
      requiredAuth: true
    }
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();
  const isAuthenticated = auth.isAuthenticated;
  const needAuth = to.meta.requiredAuth;

  const path = to.path.toLowerCase(); // Convertir la ruta a minúsculas

  if (path === '/login' && isAuthenticated) {
    next('/');
  } 
  else if (needAuth && !isAuthenticated) {
    next('/login');
  } 
  else {
    next();
  }
});

export default router