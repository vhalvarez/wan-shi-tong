<template>
    <!-- Header Navbar -->
    <top-menu />
    
    <!-- Router View -->
    <main class="container mx-auto flex min-h-[calc(100vh-180px)] mt-5">
        <left-menu />
        <router-view />
    </main>

    <!-- Footer -->
    <custom-footer />

</template>

<script setup>
import TopMenu from '@/modules/home/components/TopMenu.vue'
import LeftMenu from '@/modules/home/components/LeftMenu.vue'
import CustomFooter from '@/modules/home/components/CustomFooter.vue'
</script>
