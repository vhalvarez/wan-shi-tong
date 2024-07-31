<template>
    <div class="flex flex-col justify-center w-full ml-5">
        <div v-if="!loans" class="text-center h-[500px]">
            <LoadingSpinner />
        </div>

        <div v-else>
            <CustomTitle :title="'Listado de Préstamos'" />

            <TableLoans
                :loans="loans"
                @loan-deleted="invalidateLoansQuery"
                @loan-returned="invalidateLoansQuery"
            />

            <ButtonPagination :has-more-data="!!loans && loans.length < 10" :page="page" />
        </div>
    </div>
</template>

<script setup lang="ts">
import CustomTitle from '@/modules/common/components/CustomTitle.vue'
import LoadingSpinner from '@/modules/common/components/LoadingSpinner.vue'
import { getLoansAction } from '../actions/get-loans.action'
import { useRoute } from 'vue-router'
import { ref, watch, watchEffect } from 'vue'
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import ButtonPagination from '@/modules/common/components/ButtonPagination.vue'

import TableLoans from '../components/TableLoans.vue'

const route = useRoute()

const page = ref(Number(route.query.page || 1))
const queryClient = useQueryClient()

const { data: loans = [] } = useQuery({
    queryKey: ['loans', { page: page }],
    queryFn: () => getLoansAction(page.value)
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
        queryKey: ['loans', { page: page.value + 1 }],
        queryFn: () => getLoansAction(page.value + 1)
    })
})

const invalidateLoansQuery = () => {
    queryClient.invalidateQueries(['loans', { page: page.value }])
}
</script>
