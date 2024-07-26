<template>
    <div class="mb-5">
        <ul
            className="menu bg-neutral-content rounded-box w-56"
            v-if="authStore.isAdmin && authStore.isAuthenticated"
        >
            <template v-for="(section, index) in menu.admin" :key="index">
                <li>
                    <h2 className="menu-title">{{ section.title }}</h2>
                    <ul>
                        <li v-for="(item, idx) in section.items" :key="idx">
                            <template v-if="Array.isArray(item)">
                                <details>
                                    <summary>{{ item[0] }}</summary>
                                    <ul>
                                        <li
                                            v-for="(subItem, subIdx) in item.slice(1)"
                                            :key="subIdx"
                                        >
                                            <a>{{ subItem }}</a>
                                        </li>
                                    </ul>
                                </details>
                            </template>
                            <template v-else>
                                <a>{{ item }}</a>
                            </template>
                        </li>
                    </ul>
                </li>
            </template>
        </ul>

        <ul
            className="menu bg-base-200 rounded-box w-56"
            v-if="authStore.isAuthenticated && !authStore.isAdmin"
        >
            <template v-for="(section, index) in menu.student" :key="index">
                <li>
                    <h2 className="menu-title">{{ section.title }}</h2>
                    <ul>
                        <li v-for="(item, idx) in section.items" :key="idx">
                            <template v-if="Array.isArray(item)">
                                <details>
                                    <summary>{{ item[0] }}</summary>
                                    <ul>
                                        <li
                                            v-for="(subItem, subIdx) in item.slice(1)"
                                            :key="subIdx"
                                        >
                                            <a>{{ subItem }}</a>
                                        </li>
                                    </ul>
                                </details>
                            </template>
                            <template v-else>
                                <a>{{ item }}</a>
                            </template>
                        </li>
                    </ul>
                </li>
            </template>
        </ul>

        <ul className="menu bg-base-200 rounded-box w-56" v-if="!authStore.isAuthenticated">
            <template v-for="(section, index) in menu.guest" :key="index">
                <li>
                    <h2 className="menu-title">{{ section.title }}</h2>
                    <ul>
                        <li v-for="(item, idx) in section.items" :key="idx">
                            <template v-if="Array.isArray(item)">
                                <details>
                                    <summary>{{ item[0] }}</summary>
                                    <ul>
                                        <li
                                            v-for="(subItem, subIdx) in item.slice(1)"
                                            :key="subIdx"
                                        >
                                            <a>{{ subItem }}</a>
                                        </li>
                                    </ul>
                                </details>
                            </template>
                            <template v-else>
                                <a>{{ item }}</a>
                            </template>
                        </li>
                    </ul>
                </li>
            </template>
        </ul>
    </div>
</template>

<script setup>
import { useAuthStore } from '@/modules/auth/stores/auth.store'

const authStore = useAuthStore()
const categories = [
    'Psicología',
    'Arte',
    'Historia',
    'Ciencia',
    'Matemáticas',
    'Física',
    'Literatura',
    'Sociología',
    'Química',
    'Biología',
    'Medicina',
    'Derecho',
    'Antropología',
    'Economía',
    'Lingüística',
    'Geografía',
    'Filosofía',
    'Educación',
    'Ingeniería',
    'Política'
]

const menu = {
    admin: [
        {
            title: 'Inicio',
            items: ['Lista de Libros']
        },
        {
            title: 'Usuarios',
            items: ['Lista de Usuarios', 'Agregar Nuevo Usuario', 'Roles y Permisos', 'Multas']
        },
        {
            title: 'Libros',
            items: ['Agregar Nuevo Libro', 'Editar un Libro', 'Eliminar un Libro', ['Categorias'].concat(categories)]
        },
        {
            title: 'Préstamos',
            items: ['Lista de Préstamos', 'Agregar Nuevo Préstamo']
        },
        {
            title: 'Reportes',
            items: ['Reporte de Préstamos', 'Reporte de Multas', 'Reporte de Reservas']
        }
    ],
    student: [
        {
            title: 'Libros',
            items: ['Lista de Libros', ['Categorias'].concat(categories)]
        },
        {
            title: 'Préstamos',
            items: ['Mis Préstamos', 'Solicitar Préstamo']
        },
        {
            title: 'Multas',
            items: ['Mis Multas']
        }
    ],
    guest: [
        {
            title: 'Libros',
            items: ['Lista de Libros', ['Categorias'].concat(categories)]
        }
    ]
}
</script>
