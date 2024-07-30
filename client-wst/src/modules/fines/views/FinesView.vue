<template>
    <div class="flex flex-col justify-center w-full ml-5">
        <div v-if="!fines" class="text-center h-[500px]">
            <LoadingSpinner />
        </div>

        <div v-else>
            <CustomTitle :title="'Listado de Multas'" />

            <div class="flex justify-center p-4">
                
                <RouterLink :to="{}">
                    <div class="btn btn-primary">Crear Multa</div>
                </RouterLink>
            </div>

            <TableFines :fines="fines" />

            <ButtonPagination :has-more-data="!!fines && fines.length < 9" :page="page" />
        </div>
    </div>
</template>

<script setup lang="ts">
import CustomTitle from '@/modules/common/components/CustomTitle.vue'
import LoadingSpinner from '@/modules/common/components/LoadingSpinner.vue'
import TableFines from '../components/TableFines.vue'
import { useRoute } from 'vue-router'
import { ref, watch, watchEffect } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { getFinesAction } from '../actions/get-fines.action'
import ButtonPagination from '@/modules/common/components/ButtonPagination.vue'

const route = useRoute()
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
</script>
