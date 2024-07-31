<template>
    <div class="container mx-auto sticky z-10">
        <div class="navbar bg-primary md:rounded-xl md:my-4">
            <div class="navbar-start">
                <div class="dropdown">
                    <div tabindex="0" role="button" class="btn btn-ghost lg:hidden">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M4 6h16M4 12h8m-8 6h16"
                            />
                        </svg>
                    </div>

                    <!-- Menú responsive -->
                    <ul
                        tabindex="0"
                        class="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
                    >
                        <template v-for="(section, index) in currentMenu" :key="index">
                            <li>
                                <h2 class="menu-title">{{ section.title }}</h2>
                                <ul>
                                    <li v-for="(item, idx) in section.items" :key="idx">
                                        <template v-if="Array.isArray(item) && item[0] === 'Categorias'">
                                            <details>
                                                <summary>{{ item[0] }}</summary>
                                                <ul>
                                                    <li
                                                        v-for="(subItem, subIdx) in item.slice(1)"
                                                        :key="subIdx"
                                                    >
                                                        <RouterLink :to="subItem.link">{{ subItem.name }}</RouterLink>
                                                    </li>
                                                </ul>
                                            </details>
                                        </template>
                                        <template v-else>
                                            <RouterLink :to="item.link">{{ item.name }}</RouterLink>
                                        </template>
                                    </li>
                                </ul>
                            </li>
                        </template>
                    </ul>
                </div>
                <RouterLink :to="{ name: 'home' }">
                    <img src="../../../assets/img/logo_white.png" alt="Logo" class="w-16 md:w-24" />
                </RouterLink>
            </div>
            <div class="navbar-center hidden lg:flex w-2/4">
                
            </div>
            <div class="navbar-end gap-2">
                <template v-if="!authStore.isAuthenticated">
                    <RouterLink :to="{ name: 'login' }" class="">Ingresa</RouterLink>
                    <RouterLink :to="{ name: 'register' }" class="btn btn-primary-content"
                        >Unete</RouterLink
                    >
                </template>

                <template v-if="authStore.isAuthenticated">
                    <div class="dropdown dropdown-end z-10">
                        <div
                            tabIndex="1"
                            role="button"
                            class="btn btn-ghost btn-circle avatar flex"
                        >
                            <div class="w-10 rounded-full">
                                <img
                                    alt="User image"
                                    src="https://upload.wikimedia.org/wikipedia/commons/9/99/Sample_User_Icon.png"
                                />
                            </div>
                        </div>
                        <ul
                            tabIndex="1"
                            class="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-4 shadow gap-4"
                        >
                            <button @click="authStore.logout()" class="btn bg-error">Salir</button>
                        </ul>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { getCategoriesAction } from '@/modules/categories/actions/get-categories.action'
import { useQuery } from '@tanstack/vue-query'
import { RouterLink } from 'vue-router'

interface Category {
    id: number
    name: string
}

interface MenuItem {
    name: string
    link: string
}

const authStore = useAuthStore()

const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => getCategoriesAction(),
    initialData: []
})

const formatCategories = (categories: Category[]): MenuItem[] => {
    return categories.map((category) => ({
        name: category.name,
        link: `/categories/${category.id}/books`
    }))
}

const menu = ref({
    admin: [
        {
            title: 'Inicio',
            items: [{ name: 'Libros', link: '/' }, ['Categorias']]
        },
        {
            title: 'Usuarios',
            items: [{ name: 'Lista de Usuarios', link: '/admin/users' }]
        },
        {
            title: 'Multas',
            items: [{ name: 'Lista de Multas', link: '/admin/fines' }]
        },
        {
            title: 'Libros',
            items: [
                { name: 'Lista de Libros', link: '/admin/users' },
                { name: 'Agregar Nuevo Libro', link: '/admin/libros/nuevo' }
            ]
        },
        {
            title: 'Préstamos',
            items: [{ name: 'Lista de Préstamos', link: '/admin/loans' }]
        }
    ] as { title: string; items: (string | MenuItem[])[] }[],
    student: [
        {
            title: 'Inicio',
            items: [{ name: 'Libros', link: `/` }, ['Categorias']]
        },
        {
            title: 'Perfil',
            items: [{ name: 'Ver mi perfil', link: `/admin/users/${authStore.user?.id}` }]
        }
    ] as { title: string; items: (string | MenuItem[])[] }[],
    guest: [
        {
            title: 'Inicio',
            items: [{ name: 'Lista de Libros', link: '/' }, ['Categorias']]
        }
    ] as { title: string; items: (string | MenuItem[])[] }[]
})

watchEffect(() => {
    const formattedCategories = formatCategories(categories.value)
    const adminInicio = menu.value.admin.find((section) => section.title === 'Inicio')
    if (adminInicio) {
        adminInicio.items[1] = ['Categorias', ...formattedCategories]
    }
    menu.value.student[0].items[1] = ['Categorias', ...formattedCategories]
    menu.value.guest[0].items[1] = ['Categorias', ...formattedCategories]
})

const currentMenu = computed(() => {
    if (authStore.isAuthenticated) {
        if (authStore.isAdmin) {
            return menu.value.admin
        } else {
            return menu.value.student
        }
    } else {
        return menu.value.guest
    }
})
</script>
