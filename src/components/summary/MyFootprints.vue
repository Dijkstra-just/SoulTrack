<template>
  <div v-if="show" class="modal-backdrop" @click.self="closeModal">
    <div class="footprints-container">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl font-bold text-primary">我的足迹</h3>
        <div class="flex items-center gap-2">
          <div class="badge badge-primary badge-lg">{{ mapStore.footprints.length }}</div>
          <button class="btn btn-sm btn-circle btn-primary" @click.stop="closeModal" title="关闭">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>

      <!-- 足迹列表 -->
      <div v-if="mapStore.footprints.length > 0" class="footprints-list">
        <ul class="menu bg-base-200 rounded-box">
          <li v-for="(footprint, index) in mapStore.footprints" :key="footprint._id || index">
            <a
              @click="showFootprintOnMap(footprint)"
              class="flex items-center p-3 hover:bg-base-300 rounded-lg transition-colors duration-200 mb-2 border border-base-300"
            >
              <div class="flex items-center w-full">
                <!-- 图片 -->
                <div class="w-16 h-16 mr-4 flex-shrink-0">
                  <img
                    v-if="
                      footprint.photos && footprint.photos.length > 0 && footprint.photos[0].url
                    "
                    :src="footprint.photos[0].url"
                    class="w-full h-full object-cover rounded-lg shadow-sm"
                    alt="地点图片"
                  />
                  <div
                    v-else
                    class="w-full h-full bg-base-300 rounded-lg flex items-center justify-center shadow-sm"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="h-8 w-8 text-primary opacity-70"
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
                <div class="flex-1 min-w-0">
                  <div class="font-semibold text-lg text-base-content">{{ footprint.name }}</div>
                  <div class="text-sm text-base-content/70 truncate mt-1">
                    {{ footprint.address }}
                  </div>
                </div>

                <!-- 删除按钮 -->
                <button
                  class="btn btn-sm btn-circle btn-error btn-outline ml-2 hover:bg-error hover:text-white transition-colors duration-200"
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
      <div v-else class="text-center my-8 py-6 bg-base-200 rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-12 w-12 mx-auto text-base-content/50 mb-3"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"
          />
        </svg>
        <p class="text-lg font-medium text-base-content">您还没有添加任何足迹</p>
        <p class="text-sm text-base-content/70 mt-2">搜索地点并点击标记按钮添加</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineProps, defineEmits } from 'vue'
import { useEchartMapStore } from '../../stores/echartMapStore'

const props = defineProps({
  show: Boolean,
})
// 使用地图状态管理
const mapStore = useEchartMapStore()
const emit = defineEmits(['close'])
const closeModal = () => {
  emit('close')
}
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
.modal-backdrop {
  margin-top: 35px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  backdrop-filter: blur(2px);
}

.footprints-container {
  /* background-color: hsl(var(--b1) / var(--tw-bg-opacity, 1)); */
  background-color: var(--card-bg);
  color: hsl(var(--bc) / var(--tw-text-opacity, 1));
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow:
    0 10px 25px -5px rgba(0, 0, 0, 0.2),
    0 8px 10px -6px rgba(0, 0, 0, 0.1);
  width: 90%;
  max-width: 600px;
  max-height: 95vh;
  overflow-y: auto;
  border: 1px solid hsl(var(--b3) / var(--tw-border-opacity, 0.2));
}

.footprints-list {
  margin-left: 25px;
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  padding: 0.5rem 0;
  margin-top: 0.5rem;
}

.footprints-list::-webkit-scrollbar {
  width: 6px;
}

.footprints-list::-webkit-scrollbar-track {
  background: hsl(var(--b3) / 0.2);
  border-radius: 8px;
}

.footprints-list::-webkit-scrollbar-thumb {
  background: hsl(var(--p) / 0.5);
  border-radius: 8px;
}

.footprints-list::-webkit-scrollbar-thumb:hover {
  background: hsl(var(--p) / 0.7);
}
</style>
