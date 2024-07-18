import { authRoutes } from '@/modules/auth/routes'
import { createRouter, createWebHistory } from 'vue-router'
import HomeLayout from '@/modules/home/layouts/HomeLayout.vue'
import { adminRoutes } from '@/modules/admin/routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        name: 'library',
        component: HomeLayout,
        children: [
            {
                path: '',
                name: 'home',
                component: () => import('@/modules/home/views/HomeView.vue'),
            },
        ],
    },

    authRoutes,
    adminRoutes
  ]
})

export default router
