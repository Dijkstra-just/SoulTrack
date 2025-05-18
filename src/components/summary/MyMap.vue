<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useMapStore } from '../../stores/mapStore'

// 使用地图状态管理
const mapStore = useMapStore()

onMounted(async () => {
  // 初始化高德地图
  await mapStore.initMap()

  // 初始化地图实例
  mapStore.initMapInstance('container')

  // 获取并显示用户足迹
  await mapStore.fetchFootprints()
})
</script>

<style scoped>
#container {
  padding: 0px;
  margin: 0 0;
  height: 100%;
  width: 100%;
  border-radius: 20px;
}
</style>
