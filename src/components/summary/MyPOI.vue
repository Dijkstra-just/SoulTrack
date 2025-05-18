<template>
  <div class="poi-container">
    <!-- 通知提示 -->
    <div v-if="notification.show" class="toast toast-top toast-center z-50">
      <div class="alert" :class="notification.type === 'success' ? 'alert-success' : 'alert-error'">
        <span>{{ notification.message }}</span>
      </div>
    </div>
    <div class="search-box">
      <label class="input input-bordered w-full flex items-center gap-2">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor"
          >
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </g>
        </svg>
        <input
          type="search"
          class="grow"
          placeholder="搜索地点、景点、餐厅等"
          id="searchInput"
          v-model="mapStore.searchText"
          @input="debouncedSearch"
        />
        <kbd class="kbd kbd-sm">⌘</kbd>
        <kbd class="kbd kbd-sm">K</kbd>
      </label>
    </div>

    <!-- 加载指示器 -->
    <div v-if="mapStore.isLoading" class="flex justify-center my-4">
      <span class="loading loading-spinner loading-md text-primary"></span>
    </div>

    <!-- 搜索结果列表 -->
    <div
      v-if="mapStore.places.length > 0 && !mapStore.isLoading"
      class="search-result mt-2 w-180 max-h-60 overflow-y-auto"
    >
      <ul class="menu bg-base-200 rounded-box">
        <li v-for="(place, index) in mapStore.places" :key="index">
          <a @click="showPlace(place)" class="flex items-center p-2 hover:bg-base-300 rounded-lg">
            <div class="flex items-center w-full">
              <!-- 图片 -->
              <div class="w-16 h-16 mr-3">
                <img
                  v-if="place.photos && place.photos.length > 0"
                  :src="place.photos[0].url"
                  class="w-full h-full object-cover rounded-lg"
                  alt="地点图片"
                />
                <div
                  v-else
                  class="w-full h-full bg-base-300 rounded-lg flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-8 w-8 opacity-50"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fill="currentColor"
                      d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"
                    />
                  </svg>
                </div>
              </div>

              <!-- 信息 -->
              <div class="flex-1 w-full">
                <div class="font-medium text-base">{{ place.name }}</div>
                <div class="text-sm opacity-70 truncate">{{ place.address }}</div>
                <div v-if="place.tel" class="text-xs opacity-60">{{ place.tel }}</div>
              </div>

              <!-- 操作按钮组 -->
              <div class="flex flex-col gap-1">
                <!-- 详情按钮 -->
                <button class="btn btn-sm btn-ghost" @click.stop="showPlace(place)">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M8.59 16.59L13.17 12L8.59 7.41L10 6l6 6l-6 6l-1.41-1.41z"
                    />
                  </svg>
                </button>

                <!-- 收藏按钮 -->
                <button
                  class="btn btn-sm btn-circle"
                  :class="isPlaceSaved(place) ? 'btn-primary' : 'btn-outline btn-primary'"
                  @click.stop="toggleSavePlace(place)"
                  title="添加到我的足迹"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <!-- 无结果提示 -->
    <div
      v-if="mapStore.searchText && !mapStore.isLoading && mapStore.places.length === 0"
      class="text-center my-4 opacity-70"
    >
      未找到相关地点
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useMapStore } from '../../stores/mapStore'
import { useDebounceFn } from '@vueuse/core'

// 使用地图状态管理
const mapStore = useMapStore()

// 通知状态
const notification = ref({
  show: false,
  message: '',
  type: 'success',
})

// 显示通知
function showNotification(message: string, type: 'success' | 'error' = 'success') {
  notification.value = {
    show: true,
    message,
    type,
  }

  // 3秒后自动关闭
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// 防抖处理搜索请求
const debouncedSearch = useDebounceFn(() => {
  if (mapStore.searchText.trim()) {
    mapStore.searchPlaces(mapStore.searchText)
  } else {
    mapStore.places = []
  }
}, 300)

// 显示地点在地图上
function showPlace(place: any) {
  mapStore.showPlaceOnMap(place)
}

// 判断地点是否已保存为足迹
function isPlaceSaved(place: any) {
  return mapStore.footprints.some(
    (fp) => fp.location.lng === place.location.lng && fp.location.lat === place.location.lat,
  )
}

// 切换保存/删除足迹状态
async function toggleSavePlace(place: any) {
  try {
    // 检查是否已保存
    const existingFootprint = mapStore.footprints.find(
      (fp) => fp.location.lng === place.location.lng && fp.location.lat === place.location.lat,
    )

    if (existingFootprint) {
      // 如果已保存，则删除
      await mapStore.deleteFootprint(existingFootprint._id)
      showNotification(`已从足迹中移除 ${place.name}`)
    } else {
      // 如果未保存，则添加
      await mapStore.saveFootprint(place)
      showNotification(`已添加 ${place.name} 到我的足迹`)
    }
  } catch (error) {
    console.error('切换足迹状态失败:', error)
    showNotification('操作失败，请稍后重试', 'error')
  }
}

onMounted(async () => {
  // 确保地图已初始化
  await mapStore.initMap()
  // 获取用户足迹
  await mapStore.fetchFootprints()
})
</script>

<style scoped></style>
