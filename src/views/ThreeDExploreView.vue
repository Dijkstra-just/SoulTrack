<template>
  <div class="three-d-explore-view">
    <div class="iframe-container">
      <div v-if="isLoading" class="loading-overlay">
        <div class="loading-spinner"></div>
        <p>正在加载3D内容...</p>
      </div>
      <iframe
        src="https://love.dijkstra-jhd.cn"
        frameborder="0"
        @load="handleIframeLoad"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      >
      </iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const iframeLoaded = ref(false)
const isLoading = ref(true)

const handleIframeLoad = () => {
  iframeLoaded.value = true
  isLoading.value = false
}
</script>

<style scoped>
.three-d-explore-view {
  margin-top: 25px;
  text-align: center;
  height: 100%;
}

.iframe-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 50px);
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.iframe-container iframe {
  width: 100%;
  height: 100%;
  border: none;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 10;
}

.loading-spinner {
  border: 5px solid #f3f3f3;
  border-top: 5px solid #42b983;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
