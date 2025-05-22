<script setup lang="ts">
import MyPOI from '../components/summary/MyPOI.vue'
import EchartsMap from '../components/summary/EchartsMap.vue'
import StatisticsCards from '../components/summary/StatisticsCards.vue'
import { ref, provide } from 'vue'

// 创建地图组件引用
const mapRef = ref(null)

// 提供地图组件引用给子组件
provide('mapComponent', mapRef)
</script>

<template>
  <div class="summary-view">
    <div class="map-container">
      <EchartsMap ref="mapRef" />
    </div>

    <div class="content-container">
      <!-- 统计卡片 -->
      <div class="statistics-container">
        <StatisticsCards />
      </div>
    </div>
  </div>
</template>

<style scoped>
.summary-view {
  display: flex;
  flex-direction: row;
  height: calc(100vh - 125px);
  position: relative;
  background-color: var(--bg-color);
  color: var(--text-color);
  padding: 0 10px;
}

.map-container {
  height: calc(100vh - 145px);
  width: 50%;
  margin: 10px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.content-container {
  width: 50%;
  margin: 10px;
  display: flex;
  flex-direction: column;
}

.statistics-container {
  background-color: var(--card-bg);
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow-y: auto;
}
</style>
