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

<script setup lang="ts">
import TopMenu from '../components/TopMenu.vue'
import LeftMenu from '../components/LeftMenu.vue'
import CustomFooter from '../components/CustomFooter.vue'
</script>
