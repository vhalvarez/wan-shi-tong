<template>
    <div className="overflow-x-auto">
        <table className="table ">
            <thead>
                <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Cedula</th>
                    <th>Fecha Registro</th>
                    <th>Estado</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <th>{{ user.id }}</th>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.cedula }}</td>
                    <td>{{ user.fecha_registro }}</td>
                    <td :class="user.active ? 'badge badge-primary' : 'badge badge-accent'">
                        {{ user.active ? 'Activo' : 'Inactivo' }}
                    </td>
                    <td>{{ user.roles }}</td>
                    <td class="flex gap-2">
                        <router-link :to="{path: `/users/${user.id}`}"><EyeIcon class="size-6 cursor-pointer text-blue-500"/></router-link>

                        <router-link :to="{path: `/users/edit/${user.id}`}">
                            <PencilSquareIcon class="size-6 cursor-pointer text-yellow-500" />
                        </router-link>

                       
                        <router-link :to="{}"> <TrashIcon class="size-6 cursor-pointer text-red-500" /></router-link>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th></th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Cedula</th>
                    <th>Fecha Registro</th>
                    <th>Estado</th>
                    <th>Rol</th>
                    <th>Acciones</th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script setup lang="ts">
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/vue/24/solid'
import type { User } from '../interfaces/users.interface'

interface Props {
    users: User[]
}

defineProps<Props>()
</script>
