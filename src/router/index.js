import { createRouter, createWebHistory } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useAuthStore } from '@/stores/auth'
import { ROLES } from '@/utils/jwt'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true, title: 'Iniciar sesión' }
  },
  {
    path: '/',
    component: () => import('@/layouts/AppLayout.vue'),
    children: [
      { path: '', redirect: { name: 'dashboard' } },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('@/views/DashboardView.vue'),
        meta: { title: 'Dashboard', roles: [ROLES.SUPERVISOR, ROLES.OPERADOR] }
      },
      {
        path: 'venta',
        name: 'venta',
        component: () => import('@/views/VentaView.vue'),
        meta: { title: 'Nueva venta', roles: [ROLES.OPERADOR] }
      },
      {
        path: 'consultas',
        name: 'consultas',
        component: () => import('@/views/ConsultasView.vue'),
        meta: { title: 'Consulta de transacciones', roles: [ROLES.OPERADOR] }
      },
      {
        path: 'cancelaciones',
        name: 'cancelaciones',
        component: () => import('@/views/CancelacionesView.vue'),
        meta: { title: 'Cancelaciones y devoluciones', roles: [ROLES.SUPERVISOR] }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { public: true, title: 'Página no encontrada' }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 })
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  const toast = useToast()

  if (to.name === 'login' && auth.isAuthenticated) {
    return { name: 'dashboard' }
  }

  if (to.meta.public) return true

  if (!auth.isAuthenticated) {
    if (auth.token) {
      auth.logout()
      toast.warning('Tu sesión expiró. Inicia sesión nuevamente.')
    }
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  const allowed = to.matched.every((record) => auth.hasRole(record.meta.roles ?? []))
  if (!allowed) {
    toast.error(`Acceso no autorizado: tu rol (${auth.role}) no tiene permiso para "${to.meta.title}".`)
    return { name: 'dashboard' }
  }

  return true
})

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} | E-Global` : 'E-Global'
})

export default router
