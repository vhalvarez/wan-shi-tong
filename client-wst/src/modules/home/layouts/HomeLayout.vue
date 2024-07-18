<template>
   
        <!-- Header Navbar -->
        <top-menu />
        <!-- Router View -->
        <main class="mx-auto max-w-screen-xl px-4 pb-24 min-h-[calc(100vh-180px)] mt-10">
            <router-view />
        </main>

        <!-- Footer -->
        <!-- <custom-footer /> -->
    
</template>

<script setup lang="ts">
import TopMenu from '../components/TopMenu.vue'
import CustomFooter from '../components/CustomFooter.vue'
</script>
