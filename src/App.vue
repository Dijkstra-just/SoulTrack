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
  margin-top: 75px; /* 为固定定位的导航栏留出空间 */
  min-height: calc(100vh - 80px);
}
</style>
