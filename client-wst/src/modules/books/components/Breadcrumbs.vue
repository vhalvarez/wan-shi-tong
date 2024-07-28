<template>
    <div className="breadcrumbs text-sm lg:w-4/5 mx-auto flex py-4">
        <ul>
            <li><RouterLink :to="{ name: 'home' }">Inicio</RouterLink></li>
            <li>
                <a>{{ category }}</a>
            </li>
            <li class="capitalize font-bold">{{ titulo }}</li>
        </ul>
    </div>
</template>

<script setup lang="ts">
interface Props {
    category: string
    titulo: string
    categoryId: string
}

defineProps<Props>()
</script>
