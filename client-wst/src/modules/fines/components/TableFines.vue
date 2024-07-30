<template>
    <div class="overflow-x-auto">
        <table class="table">
            <thead>
                <tr>
                    <th></th>
                    <th>Estado</th>
                    <th>Monto</th>
                    <th>Fecha de la Multa</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Cedula</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="fine in fines" :key="fine.id">
                    <th>{{ fine.id }}</th>
                    <td :class="fine.pagada ? 'badge badge-primary' : 'badge badge-accent'">
                        {{ fine.pagada ? 'Pagada' : 'No pagada' }}
                    </td>
                    <td>{{ fine.monto.toFixed(2) }} $</td>
                    <td>{{ new Date(fine.fecha_multa).toLocaleDateString() }}</td>
                    <td>{{ fine.user.name }}</td>
                    <td>{{ fine.user.email }}</td>
                    <td>{{ fine.user.cedula }}</td>

                    <td class="flex gap-2">
                        <div v-if="!fine.pagada">
                            <label htmlFor="my_modal_check">
                                <CheckIcon class="size-6 cursor-pointer text-green-500"
                            /></label>

                            <input type="checkbox" id="my_modal_check" className="modal-toggle" />
                            <div className="modal text-center" role="dialog">
                                <div className="modal-box">
                                    <h3 className="text-lg font-bold">Pagar multa</h3>
                                    <p className="py-4">
                                        ¿Estas seguro que deseas cambiar el estado a "PAGADO"?
                                    </p>
                                    <button class="btn btn-primary w-full">Pagar</button>
                                    <div className="modal-action">
                                        <label
                                            htmlFor="my_modal_check"
                                            className="btn  w-full btn-outline btn-error"
                                            >Cancelar</label
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>

                        <router-link :to="{ path: `users/${fine.id}` }">
                            <EyeIcon class="size-6 cursor-pointer text-blue-500" />
                        </router-link>

                        <TrashIcon class="size-6 cursor-pointer text-red-500" />
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th></th>
                    <th>Monto</th>
                    <th>Fecha de la Multa</th>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Cedula</th>
                </tr>
            </tfoot>
        </table>
    </div>
</template>

<script setup lang="ts">
import { TrashIcon, EyeIcon, CheckIcon } from '@heroicons/vue/24/solid'
import { wstApi } from '@/api/wstApi'
import { useToast } from 'vue-toastification'
import { useRouter } from 'vue-router'
import type { Fine } from '@/modules/users/interfaces/userbyid.interface'

interface Props {
    fines: Fine[]
}

defineProps<Props>()

const toast = useToast()
const router = useRouter()

// const deleteUser = async (userId: number) => {
//     try {
//         await wstApi.delete(`/users/${userId}`)
//         // // Filtrar la lista de usuarios para eliminar el usuario eliminado
//         // users.value = users.value.filter((user) => user.id !== userId)
//         toast.success('Usuario desactivado correctamente.')
//     } catch (error) {
//         console.error('Error al eliminar el usuario:', error)
//     }
// }
</script>
