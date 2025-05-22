<template>
  <div class="statistics-cards">
    <!-- 通知提示 -->
    <div v-if="notification.show" class="toast toast-top toast-center z-50">
      <div class="alert" :class="notification.type === 'success' ? 'alert-success' : 'alert-error'">
        <span>{{ notification.message }}</span>
      </div>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
      <!-- 国家数量卡片 -->
      <div class="stat-card bg-base-200 rounded-xl p-4 shadow-sm">
        <div class="text-4xl font-bold">{{ statistics.countries }}</div>
        <div class="text-sm opacity-70">国家</div>
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-50" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93c0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41c0 2.08-.8 3.97-2.1 5.39z"
            />
          </svg>
        </div>
      </div>

      <!-- 城市数量卡片 -->
      <div class="stat-card bg-base-200 rounded-xl p-4 shadow-sm">
        <div class="text-4xl font-bold">{{ statistics.cities }}</div>
        <div class="text-sm opacity-70">城市</div>
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-50" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M15 11V5l-3-3l-3 3v2H3v14h18V11h-6zm-8 8H5v-2h2v2zm0-4H5v-2h2v2zm0-4H5V9h2v2zm6 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V9h2v2zm0-4h-2V5h2v2zm6 12h-2v-2h2v2zm0-4h-2v-2h2v2z"
            />
          </svg>
        </div>
      </div>

      <!-- 地点数量卡片 -->
      <div class="stat-card bg-base-200 rounded-xl p-4 shadow-sm" @click="showPlaces">
        <div class="text-4xl font-bold">{{ statistics.places }}</div>
        <div class="text-sm opacity-70">地点</div>
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-50" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"
            />
          </svg>
        </div>
      </div>

      <!-- 出行最多的季节 -->
      <div class="stat-card bg-base-200 rounded-xl p-4 shadow-sm">
        <div class="text-4xl font-bold">{{ statistics.topSeason }}</div>
        <div class="text-sm opacity-70">出行最多的季节</div>
        <div class="stat-icon">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 opacity-50" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-1V1m-1 11h-5v5h5v-5Z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- 2x2 网格布局 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      <!-- 去过最远的地方 -->
      <div class="stat-card bg-base-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-bold">去过最远的地方</div>
            <div class="text-2xl mt-1">{{ statistics.farthestPlace.name }}</div>
            <div class="text-sm opacity-70">{{ statistics.farthestPlace.address }}</div>
          </div>
          <div class="stat-date bg-warning text-warning-content px-3 py-1 rounded-full text-sm">
            {{ statistics.farthestPlace.date }}
          </div>
        </div>
        <div class="flex justify-between items-end mt-2">
          <div class="text-sm opacity-70">
            国家/COUNTRY
            <div class="font-medium opacity-100">{{ statistics.farthestPlace.country }}</div>
          </div>
          <div class="text-sm opacity-70">
            地点/POINT
            <div class="font-medium opacity-100">{{ statistics.farthestPlace.point }}</div>
          </div>
        </div>
      </div>

      <!-- 去过海拔最高的地方 -->
      <div class="stat-card bg-base-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-bold">去过海拔最高的地方</div>
            <div class="text-2xl mt-1">{{ statistics.highestPlace.name }}</div>
            <div class="text-sm opacity-70">{{ statistics.highestPlace.address }}</div>
          </div>
          <div class="stat-altitude bg-error text-error-content px-3 py-1 rounded-full text-sm">
            {{ statistics.highestPlace.altitude }}m
          </div>
        </div>
        <div class="flex justify-between items-end mt-2">
          <div class="text-sm opacity-70">
            日期/DATE
            <div class="font-medium opacity-100">{{ statistics.highestPlace.date }}</div>
          </div>
        </div>
      </div>

      <!-- 去过最南的地方 -->
      <div class="stat-card bg-base-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-bold">去过最南的地方</div>
            <div class="text-2xl mt-1">{{ statistics.southernmostPlace.name }}</div>
            <div class="text-sm opacity-70">{{ statistics.southernmostPlace.address }}</div>
          </div>
          <div class="stat-date bg-info text-info-content px-3 py-1 rounded-full text-sm">
            {{ statistics.southernmostPlace.date }}
          </div>
        </div>
        <div class="flex justify-between items-end mt-2">
          <div class="text-sm opacity-70">
            纬度/LATITUDE
            <div class="font-medium opacity-100">{{ statistics.southernmostPlace.latitude }}°N</div>
          </div>
          <div class="text-sm opacity-70">
            日期/DATE
            <div class="font-medium opacity-100">{{ statistics.southernmostPlace.date }}</div>
          </div>
        </div>
      </div>

      <!-- 去过最北的地方 -->
      <div class="stat-card bg-base-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <div class="text-lg font-bold">去过最北的地方</div>
            <div class="text-2xl mt-1">{{ statistics.northernmostPlace.name }}</div>
            <div class="text-sm opacity-70">{{ statistics.northernmostPlace.address }}</div>
          </div>
          <div class="stat-date bg-success text-success-content px-3 py-1 rounded-full text-sm">
            {{ statistics.northernmostPlace.date }}
          </div>
        </div>
        <div class="flex justify-between items-end mt-2">
          <div class="text-sm opacity-70">
            纬度/LATITUDE
            <div class="font-medium opacity-100">{{ statistics.northernmostPlace.latitude }}°N</div>
          </div>
          <div class="text-sm opacity-70">
            日期/DATE
            <div class="font-medium opacity-100">{{ statistics.northernmostPlace.date }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 去过类型最多的地方（独占一行） -->
    <div class="grid grid-cols-1 gap-4 mb-4">
      <div class="stat-card bg-base-200 rounded-xl p-4 shadow-sm">
        <div class="flex items-center justify-between mb-2">
          <div>
            <div class="text-lg font-bold">去过类型最多的地方</div>
            <div class="text-2xl mt-1">{{ statistics.mostTypePlace.name }}</div>
            <div class="text-sm opacity-70">{{ statistics.mostTypePlace.address }}</div>
          </div>
          <div class="stat-date bg-primary text-primary-content px-3 py-1 rounded-full text-sm">
            {{ statistics.mostTypePlace.type }}
          </div>
        </div>
        <div class="flex justify-between items-end mt-2">
          <div class="text-sm opacity-70">
            数量/COUNT
            <div class="font-medium opacity-100">{{ statistics.mostTypePlace.count }}</div>
          </div>
          <div class="text-sm opacity-70">
            日期/DATE
            <div class="font-medium opacity-100">{{ statistics.mostTypePlace.date }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分享按钮 -->
    <!-- <div class="flex justify-center mt-6">
      <button class="btn btn-primary" @click="shareFootprints">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
          />
        </svg>
        分享我的足迹
      </button>
    </div> -->
  </div>

  <!-- 编辑行程模态框 -->
  <MyFootprints :show="showFootprintsModal" @close="showFootprintsModal = false" />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useEchartMapStore } from '../../stores/echartMapStore'
import MyFootprints from './MyFootprints.vue'
import axios from 'axios'
const mapStore = useEchartMapStore()
const showFootprintsModal = ref(false)
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

// 统计数据
const statistics = computed(() => {
  const footprints = mapStore.footprints

  // 提取所有国家、城市和地点
  const countries = new Set()
  const cities = new Set()
  const seasons = { 春: 0, 夏: 0, 秋: 0, 冬: 0 }

  // 最远的地方（这里简化处理，实际应该根据经纬度计算距离）
  const farthestPlace = advancedStats.value?.farthestPlace || {
    name: '嘉峪关市',
    address: '甘肃省嘉峪关市',
    country: '中国',
    point: '悬臂长城',
    date: '2025/01/05',
  }

  // 海拔最高的地方
  const highestPlace = {
    name: '西宁市',
    address: '青海省西宁市',
    altitude: '3722',
    date: '2025/01/05',
  }

  // 最南的地方
  const southernmostPlace = advancedStats.value?.southernmostPlace || {
    name: '三亚市',
    address: '海南省三亚市',
    latitude: '18.25',
    date: '2024/07/15',
  }

  // 最北的地方
  const northernmostPlace = advancedStats.value?.northernmostPlace || {
    name: '哈尔滨市',
    address: '黑龙江省哈尔滨市',
    latitude: '45.80',
    date: '2024/12/20',
  }

  // 类型最多的地方
  const mostTypePlace = advancedStats.value?.mostTypePlace || {
    name: '故宫博物院',
    address: '北京市东城区景山前街4号',
    type: '旅游景点',
    count: 12,
    date: '2024/10/01',
  }

  // 统计季节（简化处理）
  footprints.forEach((footprint) => {
    // 从地址中提取国家和城市信息（简化处理）
    const addressParts = footprint.address.split(/[省市区县]/)
    if (addressParts.length > 0) {
      countries.add('中国') // 假设都在中国

      // 提取城市
      if (addressParts.length > 1) {
        const cityMatch = footprint.address.match(/(.+?)[市区县]/)
        if (cityMatch && cityMatch[1]) {
          cities.add(cityMatch[1])
        }
      }
    }

    // 统计季节（简化处理，实际应根据日期判断）
    const randomSeason = ['春', '夏', '秋', '冬'][Math.floor(Math.random() * 4)]
    seasons[randomSeason]++
  })

  // 找出最多的季节
  let topSeason = '冬'
  let maxCount = 0
  for (const [season, count] of Object.entries(seasons)) {
    if (count > maxCount) {
      maxCount = count
      topSeason = season
    }
  }

  return {
    countries: countries.size || 1,
    cities: cities.size || 16,
    places: footprints.length || 88,
    topSeason,
    farthestPlace,
    highestPlace,
    southernmostPlace,
    northernmostPlace,
    mostTypePlace,
  }
})

// 分享足迹

function showPlaces() {
  showFootprintsModal.value = true
}

// 高级统计数据
const advancedStats = ref(null)

// 获取高级统计数据
async function fetchAdvancedStats() {
  try {
    const response = await axios.get('/api/footprints/statistics', {
      params: { userId: '1' }, // 默认用户ID
    })
    advancedStats.value = response.data
  } catch (error) {
    console.error('获取高级统计数据失败:', error)
  }
}

onMounted(async () => {
  // 确保有足迹数据
  if (mapStore.footprints.length === 0) {
    await mapStore.fetchFootprints()
  }
  // 获取高级统计数据
  await fetchAdvancedStats()
})
</script>

<style scoped>
.statistics-cards {
  width: 100%;
  padding: 1rem;
}

.stat-card {
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  position: absolute;
  top: 10px;
  right: 10px;
  opacity: 0.2;
}

.stat-date,
.stat-altitude {
  font-weight: 600;
}
</style>
