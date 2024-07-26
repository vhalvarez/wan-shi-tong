<template>
    <div class="flex justify-center my-5">
        <div className="join grid grid-cols-2">
            <button
                className="join-item btn btn-outline"
                @click="$router.push({ query: { page: page - 1 } })"
                :disabled="page === 1"
            >
                Anterior
            </button>
            <button
                className="join-item btn btn-outline"
                @click="$router.push({ query: { page: page + 1 } })"
                :disabled="hasMoreData"
            >
                Siguiente
            </button>
        </div>
    </div>
</template>

<script lang="ts" setup>
interface Props {
    page: number
    hasMoreData: boolean
}

defineProps<Props>()
</script>
