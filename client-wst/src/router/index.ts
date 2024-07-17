import { authRoutes } from '@/modules/auth/routes'
import { createRouter, createWebHistory } from 'vue-router'
import HomeLayout from '@/modules/home/layouts/HomeLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
        path: '/',
        name: 'home',
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
  ]
})

export default router
