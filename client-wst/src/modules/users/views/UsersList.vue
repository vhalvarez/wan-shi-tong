<template>
    <div class="flex flex-col justify-center w-full">
        <div v-if="!users" class="text-center h-[500px]">
            <LoadingSpinner />
        </div>

        <div v-else class="flex justify-center">
            <TableUsers :users="users" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { useQuery } from '@tanstack/vue-query'
import TableUsers from '../components/TableUsers.vue'
import { getUsersAction } from '../actions'
import LoadingSpinner from '@/modules/common/components/LoadingSpinner.vue'

const { data: users = [] } = useQuery({
    queryKey: ['users'],
    queryFn: () => getUsersAction()
})
</script>

<style lang="scss" scoped></style>
