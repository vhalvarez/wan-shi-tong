<template>
    <div class="overflow-x-auto">
        <table class="table">
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
                        <router-link :to="{ path: `users/${user.id}` }">
                            <EyeIcon class="size-6 cursor-pointer text-blue-500" />
                        </router-link>

                        <router-link :to="{ path: `users/edit/${user.id}` }">
                            <PencilSquareIcon class="size-6 cursor-pointer text-yellow-500" />
                        </router-link>

                        <TrashIcon
                            class="size-6 cursor-pointer text-red-500"
                            @click="deleteUser(user.id)"
                        />
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
import { ref } from 'vue'
import { PencilSquareIcon, TrashIcon, EyeIcon } from '@heroicons/vue/24/solid'
import type { User } from '../interfaces/users.interface'
import { wstApi } from '@/api/wstApi'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'

interface Props {
    users: User[]
}

defineProps<Props>()

const toast = useToast()
const router = useRouter()

const deleteUser = async (userId: number) => {
    try {
        await wstApi.delete(`/users/${userId}`)
        // // Filtrar la lista de usuarios para eliminar el usuario eliminado
        // users.value = users.value.filter((user) => user.id !== userId)
        toast.success('Usuario desactivado correctamente.')
    } catch (error) {
        console.error('Error al eliminar el usuario:', error)
    }
}
</script>
