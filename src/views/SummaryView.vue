<script setup lang="ts">
import MyPOI from '../components/summary/MyPOI.vue'
import MyMap from '../components/summary/MyMap.vue'
import MyFootprints from '../components/summary/MyFootprints.vue'
import { ref, provide } from 'vue'

// 创建地图组件引用
const mapRef = ref(null)

// 提供地图组件引用给子组件
provide('mapComponent', mapRef)
</script>

<template>
  <div class="summary-view">
    <div class="map-container">
      <MyMap ref="mapRef" />
    </div>

    <div class="poi-container">
      <MyPOI />
      <MyFootprints />
    </div>
  </div>
</template>

<style scoped>
.summary-view {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 125px);
  position: relative; /* 添加相对定位，作为悬浮按钮的参考 */
  background-color: var(--bg-color);
  color: var(--text-color);
}

.map-container {
  height: calc(100vh - 165px);
  width: 50%;
  margin: 20px 10px 20px 20px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.poi-container {
  width: 50%;
  margin: 20px 20px 20px 0;
  display: flex;
  flex-direction: column;
  /* height: calc(100vh - 165px); */
}
</style>
