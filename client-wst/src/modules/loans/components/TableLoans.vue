<template>
    <div class="overflow-x-auto">
        <table class="table">
            <thead>
                <tr>
                    <th></th>
                    <th>Estado</th>
                    <th>Fecha de Devolución</th>
                    <th>Libro</th>
                    <th>Fecha de Préstamo</th>
                    <th>Usuario</th>
                    <th>Correo</th>
                    <th>Cedula</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="loan in loans" :key="loan.id">
                    <th>{{ loan.id }}</th>
                    <td :class="loan.estado === 'prestado' ? 'badge badge-accent' : 'badge badge-primary'">
                        {{ loan.estado === 'prestado' ? 'Prestado' : 'Devuelto' }}
                    </td>
                    <td class="capitalize">{{ loan.fecha_devolucion ? new Date(loan.fecha_devolucion).toLocaleDateString() : '' }}</td>
                    <td class="capitalize">{{ loan.book.titulo }}</td>
                    <td class="capitalize">{{ new Date(loan.fecha_prestamo).toLocaleDateString() }}</td>
                    <td class="capitalize">{{ loan.user.name }}</td>
                    <td class="capitalize">{{ loan.user.email }}</td>
                    <td class="capitalize">{{ loan.user.cedula }}</td>

                    <td class="flex gap-2">
                        <div v-if="loan.estado === 'prestado'">
                            <label :for="'modal_check_loans' + loan.id">
                                <CheckIcon class="size-6 cursor-pointer text-green-500" />
                            </label>

                            <input type="checkbox" :id="'modal_check_loans' + loan.id" class="modal-toggle" />
                            <div class="modal text-center" role="dialog">
                                <div class="modal-box">
                                    <h3 class="text-lg font-bold">Devolución</h3>
                                    <p class="py-4">
                                        ¿Estas seguro que deseas cambiar el estado a "DEVUELTO"?
                                    </p>
                                    <button class="btn btn-primary w-full" @click="onReturnLoan(loan.id)">Si</button>
                                    <div class="modal-action">
                                        <label
                                            :for="'modal_check_loans' + loan.id"
                                            class="btn w-full btn-outline btn-error"
                                        >No</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <router-link :to="{ path: `users/${loan.user.id}` }">
                            <EyeIcon class="size-6 cursor-pointer text-blue-500" />
                        </router-link>

                        <TrashIcon class="size-6 cursor-pointer text-red-500" @click="onDeleteLoan(loan.id)" />
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <th></th>
                    <th>Estado</th>
                    <th>Fecha de Devolución</th>
                    <th>Libro</th>
                    <th>Fecha de Préstamo</th>
                    <th>Usuario</th>
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
import type { Loan } from '../interfaces/loans.interface';

interface Props {
    loans: Loan[]
}

defineProps<Props>()
const emits = defineEmits(['loan-deleted', 'loan-returned'])

const toast = useToast()

const onDeleteLoan = async (loanId: number) => {
    try {
        await wstApi.delete(`/loans/${loanId}`)
        toast.success('Préstamo eliminado exitosamente.')
        emits('loan-deleted')
    } catch (error) {
        toast.error('Error al borrar el préstamo')
    }
}

const onReturnLoan = async (loanId: number) => {
    try {
        await wstApi.put(`/loans/${loanId}/return`)
        toast.success('Préstamo devuelto exitosamente.')
        emits('loan-returned')
    } catch (error) {
        toast.error('Error al devolver el préstamo')
    }
}
</script>
