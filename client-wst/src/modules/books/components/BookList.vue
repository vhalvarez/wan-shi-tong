<template>
    <!-- Product List -->
    <section class="w-full mb-5 lg:ml-3 sm:flex sm:flex-col xs:flex xs:justify-center ">
        <!-- Book Card -->
        <div
            class="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-3 animate__animated animate__fadeIn"
        >
            <BookCard v-for="book in books" :key="book.id" :book="book" />
        </div>
    </section>
</template>

<script setup lang="ts">
import type { Book } from '../interfaces/books.interface'
import BookCard from './BookCard.vue'

interface Props {
    books: Book[]
}

defineProps<Props>()
</script>
