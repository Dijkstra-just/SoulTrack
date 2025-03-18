<template>
  <div id="container"></div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { useTripStore } from '../stores/tripStore'
const tripStore = useTripStore()

let map = null as any //高德地图实例
let AMap = null as any //高德地图对象

onMounted(() => {
  ;(window as any)._AMapSecurityConfig = {
    securityJsCode: '716c1b7208213ed166290c741460f4cf',
  }

  // Load AMap and plugins
  AMapLoader.load({
    key: 'a616248301c4b1c75d266f578e4de415', // Your developer key
    version: '2.0', // The version of the JSAPI
    plugins: ['AMap.Scale'], // Ensure the Scale plugin is loaded
  })
    .then((loadedAMap) => {
      AMap = loadedAMap

      // Initialize the map
      map = new AMap.Map('container', {
        viewMode: '3D', // 3D map view mode
        zoom: 4.8, // Initial zoom level
        center: [103.834228, 36.060798], // Initial center position
        mapStyle: 'amap://styles/macaron', // Map style
      })
    })
    .catch((e) => {
      console.error('AMap failed to load:', e)
    })
})
//创建一个 Marker 实例：
onUnmounted(() => {
  map?.destroy()
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
