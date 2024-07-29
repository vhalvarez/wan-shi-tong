<template>
    <router-link :to="{ name: 'home' }" class="flex gap-3 pb-4 hover:text-primary"
        ><ArrowLeftCircleIcon class="size-6 text-secondary hover:text-primary" />
        Volver</router-link
    >
</template>

<script setup lang="ts">
import { ArrowLeftCircleIcon } from '@heroicons/vue/24/solid'
</script>


