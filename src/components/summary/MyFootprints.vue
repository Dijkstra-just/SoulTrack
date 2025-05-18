<template>
  <div class="footprints-container">
    <div class="flex justify-between items-center mb-2">
      <h3 class="text-lg font-medium">我的足迹</h3>
      <div class="badge badge-primary">{{ mapStore.footprints.length }}</div>
    </div>

    <!-- 足迹列表 -->
    <div v-if="mapStore.footprints.length > 0" class="footprints-list">
      <ul class="menu bg-base-200 rounded-box">
        <li v-for="(footprint, index) in mapStore.footprints" :key="footprint._id || index">
          <a
            @click="showFootprintOnMap(footprint)"
            class="flex items-center p-2 hover:bg-base-300 rounded-lg"
          >
            <div class="flex items-center w-full">
              <!-- 图片 -->
              <div class="w-12 h-12 mr-3">
                <img
                  v-if="footprint.photos && footprint.photos.length > 0 && footprint.photos[0].url"
                  :src="footprint.photos[0].url"
                  class="w-full h-full object-cover rounded-lg"
                  alt="地点图片"
                />
                <div
                  v-else
                  class="w-full h-full bg-base-300 rounded-lg flex items-center justify-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 opacity-50"
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
              <div class="flex-1">
                <div class="font-medium text-base">{{ footprint.name }}</div>
                <div class="text-sm opacity-70 truncate">{{ footprint.address }}</div>
              </div>

              <!-- 删除按钮 -->
              <button
                class="btn btn-sm btn-circle btn-error btn-outline"
                @click.stop="deleteFootprint(footprint)"
                title="从足迹中移除"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12Z"
                  />
                </svg>
              </button>
            </div>
          </a>
        </li>
      </ul>
    </div>

    <!-- 无足迹提示 -->
    <div v-else class="text-center my-4 opacity-70">
      <p>您还没有添加任何足迹</p>
      <p class="text-sm">搜索地点并点击标记按钮添加</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useMapStore } from '../../stores/mapStore'

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

// 在地图上显示足迹
function showFootprintOnMap(footprint: any) {
  const place = {
    name: footprint.name,
    address: footprint.address,
    location: {
      lng: footprint.location.lng,
      lat: footprint.location.lat,
    },
  }
  mapStore.showPlaceOnMap(place)
}

// 删除足迹
async function deleteFootprint(footprint: any) {
  try {
    await mapStore.deleteFootprint(footprint._id)
    showNotification(`已从足迹中移除 ${footprint.name}`)
  } catch (error) {
    console.error('删除足迹失败:', error)
    showNotification('删除失败，请稍后重试', 'error')
  }
}

onMounted(async () => {
  // 获取用户足迹
  await mapStore.fetchFootprints()
})
</script>

<style scoped>
.footprints-container {
  margin-top: 20px;
  background-color: var(--bg-color);
  border-radius: 20px;
  padding: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  height: calc(100% - 120px);
  overflow-y: auto;
}

.footprints-list {
  max-height: calc(100% - 40px);
  overflow-y: auto;
}
</style>
