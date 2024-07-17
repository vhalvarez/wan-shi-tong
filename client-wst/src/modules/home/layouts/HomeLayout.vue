<template>
    <div class="container mx-auto">

        <!-- Header Navbar -->
        <top-menu />
        <!-- Router View -->
        <router-view />
    </div>

    <!-- Footer -->
</template>

<script setup lang="ts" >
import TopMenu from '../components/TopMenu.vue'
</script>
