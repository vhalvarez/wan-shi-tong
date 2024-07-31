<template>
    <div class="flex flex-col justify-center w-full ml-5">
        <div v-if="!fines" class="text-center h-[500px]">
            <LoadingSpinner />
        </div>

        <div v-else>
            <CustomTitle :title="'Listado de Multas'" />

            <div class="flex justify-center p-4">
                <label for="my_modal_6" class="btn btn-primary">Crear Multa</label>

                <input type="checkbox" id="my_modal_6" class="modal-toggle" ref="modalToggle" />
                <form class="modal" role="dialog" @submit.prevent="onCreateFine">
                    <div class="modal-box text-center">
                        <h3 class="text-lg font-bold">Crear Multa</h3>

                        <label class="input input-bordered flex items-center gap-2 my-3">
                            Email
                            <input
                                type="text"
                                class="grow"
                                placeholder="admin@example.com"
                                v-model="myForm.email"
                                ref="emailInputRef"
                                required
                            />
                        </label>

                        <label class="input input-bordered flex items-center gap-2">
                            Monto (en USD)
                            <input
                                type="number"
                                min="10"
                                class="grow"
                                placeholder="2000"
                                v-model="myForm.monto"
                                ref="montoInputRef"
                                required
                            />
                        </label>

                        <button
                            class="btn btn-primary w-full mt-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-400"
                            :disabled="isSubmitting"
                        >
                            <template v-if="isSubmitting">
                                <span class="loading loading-spinner"></span>
                            </template>
                            <template v-else> Enviar </template>
                        </button>

                        <div class="modal-action">
                            <label for="my_modal_6" class="btn btn-outline btn-error w-full"
                                >Cancelar</label
                            >
                        </div>
                    </div>
                </form>
            </div>

            <TableFines
                :fines="fines"
                @fine-deleted="invalidateFinesQuery"
                @fine-paid="invalidateFinesQuery"
            />

            <ButtonPagination :has-more-data="!!fines && fines.length < 9" :page="page" />
        </div>
    </div>
</template>

<script setup lang="ts">
import CustomTitle from '@/modules/common/components/CustomTitle.vue'
import LoadingSpinner from '@/modules/common/components/LoadingSpinner.vue'
import TableFines from '../components/TableFines.vue'
import { useRoute } from 'vue-router'
import { reactive, ref, watch, watchEffect } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { getFinesAction } from '../actions/get-fines.action'
import ButtonPagination from '@/modules/common/components/ButtonPagination.vue'
import { useToast } from 'vue-toastification'
import { wstApi } from '@/api/wstApi'

const route = useRoute()
const toast = useToast()
const page = ref(Number(route.query.page || 1))
const queryClient = useQueryClient()

const {
    data: fines = [],
    isPending,
    isLoading
} = useQuery({
    queryKey: ['fines', { page: page }],
    queryFn: () => getFinesAction(page.value)
})

watch(
    () => route.query.page,
    (newPage) => {
        page.value = Number(newPage || 1)

        window.scrollTo({ top: 0, behavior: 'smooth' })
    }
)

watchEffect(() => {
    queryClient.prefetchQuery({
        queryKey: ['fines', { page: page.value + 1 }],
        queryFn: () => getFinesAction(page.value + 1)
    })
})

const emailInputRef = ref<HTMLInputElement | null>(null)
const montoInputRef = ref<HTMLInputElement | null>(null)
const modalToggle = ref<HTMLInputElement | null>(null)

const myForm = reactive({
    email: '',
    monto: ''
})

const isSubmitting = ref(false)

const onCreateFine = async () => {
    if (myForm.email === '') {
        toast.error('El correo no puede estar vacío.')
        return emailInputRef.value?.focus()
    }

    if (myForm.monto === '') {
        toast.error('El monto no puede estar vacío.')
        return montoInputRef.value?.focus()
    }

    isSubmitting.value = true

    try {
        const ok = await wstApi.post('/fines', { monto: myForm.monto, email: myForm.email })

        toast.success('Multa creada exitosamente.')

        // Cerrar el modal
        if (modalToggle.value) {
            modalToggle.value.checked = false
        }

        // Invalidar la consulta para actualizar la tabla
        queryClient.invalidateQueries(['fines', { page: page.value }])
    } catch (error) {
        toast.error('Error al crear la multa')
    } finally {
        isSubmitting.value = false
    }
}

const invalidateFinesQuery = () => {
    queryClient.invalidateQueries(['fines', { page: page.value }])
}
</script>
