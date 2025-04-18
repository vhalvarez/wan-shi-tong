import isAdminGuard from '@/modules/auth/guards/is-admin.guard'
import isAuthenticatedGuard from '@/modules/auth/guards/is-authenticated.guard'
import UsersList from '@/modules/users/views/UsersList.vue'
import type { RouteRecordRaw } from 'vue-router'

export const adminRoutes: RouteRecordRaw = {
    path: '/admin',
    name: 'admin',
    beforeEnter: [isAdminGuard],
    redirect: { name: 'home'},
    component: () => import('@/modules/admin/layouts/AdminLayout.vue'),
    children: [
        {
            path: 'users',
            name: 'users-list',
            component: UsersList
        },
        {
            path: 'users/:userId',
            name: 'user-id',
            props: true,
            beforeEnter: [isAuthenticatedGuard],
            component: () => import('@/modules/users/views/UserView.vue'),
        },
        {
            path: 'users/edit/:userId',
            name: 'edit-user-id',
            props: true,
            
            component: () => import('@/modules/users/views/EditUser.vue'),
        },
        {
            path: 'fines',
            name: 'fines-list',
            props: true,
            component: () => import('@/modules/fines/views/FinesView.vue'),
        },
        {
            path: 'loans',
            name: 'loans-list',
            props: true,
            component: () => import('@/modules/loans/views/LoansView.vue'),
        },
        {
            path: 'books',
            name: 'books-list',
            props: true,
            component: () => import('@/modules/books/views/BookList.vue'),
        },

        
    ]
}
