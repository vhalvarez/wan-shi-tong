<template>
    <div class="mb-5 hidden md:block">
        <ul
            class="menu bg-neutral-content rounded-box w-56"
            v-if="authStore.isAdmin && authStore.isAuthenticated"
        >
            <template v-for="(section, index) in menu.admin" :key="index">
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
                                            <a :href="subItem.link">{{ subItem.name }}</a>
                                        </li>
                                    </ul>
                                </details>
                            </template>
                            <template v-else>
                                <a :href="item.link">{{ item.name }}</a>
                            </template>
                        </li>
                    </ul>
                </li>
            </template>
        </ul>

        <ul
            class="menu bg-base-200 rounded-box w-56"
            v-if="authStore.isAuthenticated && !authStore.isAdmin"
        >
            <template v-for="(section, index) in menu.student" :key="index">
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
                                            <a :href="subItem.link">{{ subItem.name }}</a>
                                        </li>
                                    </ul>
                                </details>
                            </template>
                            <template v-else>
                                <a :href="item.link">{{ item.name }}</a>
                            </template>
                        </li>
                    </ul>
                </li>
            </template>
        </ul>

        <ul class="menu bg-base-200 rounded-box w-56" v-if="!authStore.isAuthenticated">
            <template v-for="(section, index) in menu.guest" :key="index">
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
                                            <Router :href="subItem.link">{{ subItem.name }}</Router>
                                        </li>
                                    </ul>
                                </details>
                            </template>
                            <template v-else>
                                <a :href="item.link">{{ item.name }}</a>
                            </template>
                        </li>
                    </ul>
                </li>
            </template>
        </ul>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { useAuthStore } from '@/modules/auth/stores/auth.store'
import { getCategoriesAction } from '@/modules/categories/actions/get-categories.action'
import { useQuery } from '@tanstack/vue-query'

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
                { name: 'Lista de Libros', link: '/admin/books' },
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
</script>
