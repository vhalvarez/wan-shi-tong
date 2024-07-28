<template>
    <div class="flex flex-col justify-center w-full ml-5">
        <div v-if="!users" class="text-center h-[500px]">
            <LoadingSpinner />
        </div>

        <div v-else class="">
            <TableUsers :users="users" />

            <ButtonPagination :has-more-data="!!users && users.length < 9" :page="page" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQuery, useQueryClient } from '@tanstack/vue-query'
import TableUsers from '../components/TableUsers.vue'
import { getUsersAction } from '../actions'
import LoadingSpinner from '@/modules/common/components/LoadingSpinner.vue'
import { ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import ButtonPagination from '@/modules/common/components/ButtonPagination.vue'

const route = useRoute()
const page = ref(Number(route.query.page || 1))
const queryClient = useQueryClient()

const { data: users = [] } = useQuery({
    queryKey: ['users', { page: page }],
    queryFn: () => getUsersAction(page.value)
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
        queryKey: ['users', { page: page.value + 1 }],
        queryFn: () => getUsersAction(page.value + 1)
    })
})
</script>
