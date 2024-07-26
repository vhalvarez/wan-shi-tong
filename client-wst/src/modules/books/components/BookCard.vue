<template>
    <div
        class="bg-neutral-content rounded-xl overflow-hidden  hover:scale-105 hover:shadow-2xl hover:bg-white transform duration-500 cursor-pointer"
    >
        <div class="p-4">
            <span
                class="bg-secondary py-2 px-4 text-sm font-semibold text-white rounded-full cursor-pointer"
                >{{ book.category }}</span
            >
            <h1 class="mt-4 text-3xl font-bold hover:underline cursor-pointer capitalize">
                {{ book.titulo }}
            </h1>
            <p class="mt-2 font-sans text-gray-700">by {{ book.autor }}</p>
        </div>
        <div class="relative">
            <img
                :src="
                    book.portada
                        ? book.portada
                        : 'https://www.hachette.co.nz/graphics/CoverNotAvailable.jpg'
                "
                :alt="book.titulo"
                class="h-[400px] object-cover"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Book } from '../interfaces/books.interface'

interface Props {
    book: Book
}

defineProps<Props>()
</script>
