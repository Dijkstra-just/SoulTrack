<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <NavBar />

  <main>
    <RouterView />
  </main>
</template>

<style scoped>
main {
  padding-top: 30px; /* 为固定定位的导航栏留出空间 */
  min-height: 100vh;
}
</style>
