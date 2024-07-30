<template>
    <h2 class="text-xl lg:text-4xl w-full text-center p-4 font-bold">{{ title }}</h2>
</template>

<script setup lang="ts">
interface Props {
    title: String
}

defineProps<Props>()
</script>
