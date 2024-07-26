import { authRoutes } from '@/modules/auth/routes'
import { createRouter, createWebHistory } from 'vue-router'
import HomeLayout from '@/modules/home/layouts/HomeLayout.vue'
import HomeView from '@/modules/home/views/HomeView.vue'
import NotFound404 from '@/modules/common/pages/NotFound404.vue'
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
                component: HomeView,
            },
        ],
    },

    authRoutes,
    adminRoutes,

    // Not Found
    {
        path: '/:pathMatch(.*)*',
        component: NotFound404
    }
  ]
})

export default router
