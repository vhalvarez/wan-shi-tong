<template>
    <div class="flex flex-col justify-center w-full">
        <div v-if="!books" class="text-center h-[500px]">
            <LoadingSpinner />
        </div>

        <div v-else>
            <BookList :books="books" />

            <ButtonPagination :has-more-data="!!books && books.length < 9" :page="page" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { getBooksAction } from '@/modules/books/actions'
import BookList from '@/modules/books/components/BookList.vue'
import ButtonPagination from '@/modules/common/components/ButtonPagination.vue'
import { useQueryClient, useQuery } from '@tanstack/vue-query'
import { ref, watch, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import LoadingSpinner from '../../common/components/LoadingSpinner.vue'

const route = useRoute()
const page = ref(Number(route.query.page || 1))
const queryClient = useQueryClient()

const {
    data: books = [],
    isPending,
    isLoading
} = useQuery({
    queryKey: ['books', { page: page }],
    queryFn: () => getBooksAction(page.value)
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
        queryKey: ['books', { page: page.value + 1 }],
        queryFn: () => getBooksAction(page.value + 1)
    })
})
</script>
