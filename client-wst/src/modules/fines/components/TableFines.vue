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
                            <label :for="'modal_check_' + fine.id">
                                <CheckIcon class="size-6 cursor-pointer text-green-500" />
                            </label>

                            <input type="checkbox" :id="'modal_check_' + fine.id" class="modal-toggle" />
                            <div class="modal text-center" role="dialog">
                                <div class="modal-box">
                                    <h3 class="text-lg font-bold">Pagar multa</h3>
                                    <p class="py-4">
                                        ¿Estas seguro que deseas cambiar el estado a "PAGADO"?
                                    </p>
                                    <button class="btn btn-primary w-full" @click="onPayFine(fine.id)">Pagar</button>
                                    <div class="modal-action">
                                        <label
                                            :for="'modal_check_' + fine.id"
                                            class="btn w-full btn-outline btn-error"
                                        >Cancelar</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <router-link :to="{ path: `users/${fine.id}` }">
                            <EyeIcon class="size-6 cursor-pointer text-blue-500" />
                        </router-link>

                        <TrashIcon class="size-6 cursor-pointer text-red-500" @click="onDeleteFine(fine.id)" />
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
import type { Fine } from '@/modules/users/interfaces/userbyid.interface'

interface Props {
    fines: Fine[]
}

defineProps<Props>()
const emits = defineEmits(['fine-deleted', 'fine-paid'])

const toast = useToast()

const onDeleteFine = async (fineId: number) => {
    try {
        await wstApi.delete(`/fines/${fineId}`)
        toast.success('Multa eliminada exitosamente.')
        emits('fine-deleted')
    } catch (error) {
        toast.error('Error al borrar la multa')
    }
}

const onPayFine = async (fineId: number) => {
    try {
        await wstApi.put(`/fines/pay`, { fineId })
        toast.success('Multa pagada exitosamente.')
        emits('fine-paid')
    } catch (error) {
        toast.error('Error al pagar la multa')
    }
}
</script>
