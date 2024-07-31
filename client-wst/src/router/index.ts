import { authRoutes } from '@/modules/auth/routes'
import { createRouter, createWebHistory } from 'vue-router'
import HomeLayout from '@/modules/home/layouts/HomeLayout.vue'
import HomeView from '@/modules/home/views/HomeView.vue'
import NotFound404 from '@/modules/common/pages/NotFound404.vue'
import { adminRoutes } from '@/modules/admin/routes'
import isAuthenticatedGuard from '@/modules/auth/guards/is-authenticated.guard'

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
            {
                path: '/book/:bookId',
                name: 'book-id',
                props: true,
                component: () => import('@/modules/books/views/BookView.vue'),
            },
            {
                path: '/categories/:categoryId/books',
                name: 'category-books',
                props: true,
                component: () => import('@/modules/categories/views/CategoriesView.vue'),
            },
            // {
            //     path: '/user/:userId',
            //     name: 'user-id',
            //     props: true,
            //     beforeEnter: [isAuthenticatedGuard],
            //     component: () => import('@/modules/users/views/UserView.vue'),
            // },
            
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
