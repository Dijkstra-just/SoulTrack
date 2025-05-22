<template>
  <div class="relative">
    <div ref="chartContainer" class="chart-container"></div>

    <!-- 右下角按钮组 -->
    <div class="absolute bottom-4 right-4 flex flex-row gap-2">
      <!-- 添加景点按钮 -->
      <button class="btn btn-circle btn-primary" @click="showPOI = true" title="添加景点">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"
          />
        </svg>
      </button>

      <!-- 分享按钮 -->
      <button class="btn btn-circle btn-primary" @click="shareFootprints" title="分享我的足迹">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81c1.66 0 3-1.34 3-3s-1.34-3-3-3s-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65c0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
          />
        </svg>
      </button>
    </div>

    <!-- 通知提示 -->
    <div v-if="notification.show" class="toast toast-top toast-center z-50">
      <div class="alert" :class="notification.type === 'success' ? 'alert-success' : 'alert-error'">
        <span>{{ notification.message }}</span>
      </div>
    </div>

    <!-- POI搜索组件 -->
    <div
      v-if="showPOI"
      class="absolute top-4 left-4 w-80 bg-base-100 p-4 rounded-xl shadow-lg z-10"
    >
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-lg font-medium">搜索景点</h3>
        <button class="btn btn-sm btn-circle" @click="showPOI = false">✕</button>
      </div>
      <MyPOI />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as echarts from 'echarts'
import { useEchartMapStore } from '../../stores/echartMapStore'
import countryJson from '../../assets/map/Country.json'
import html2canvas from 'html2canvas'
import MyPOI from './MyPOI.vue'

const chartContainer = ref(null)
let chart: echarts.ECharts | null = null
const mapStore = useEchartMapStore()
const showPOI = ref(false)

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

// 初始化ECharts实例
const initChart = () => {
  if (chartContainer.value) {
    chart = echarts.init(chartContainer.value)
    // 注册地图数据
    echarts.registerMap('china', countryJson)
    updateChart()
  }
}

// 更新图表数据
const updateChart = () => {
  if (!chart) return

  // 统计各省份的足迹数量
  const provinceData = mapStore.calculateProvinceData()
  // console.log(provinceData)
  const getColorByValue = (value: number) => {
    const colors = ['#e0f7fa', '#4fc3f7', '#0288d1', '#01579b']
    const max = Math.max(...provinceData.map((item) => item.value), 5)
    return colors[Math.floor((value / max) * colors.length)] || '#eee'
  }
  const scatterData = mapStore.footprints.map((footprint) => ({
    name: footprint.name,
    value: [parseFloat(footprint.location.lng), parseFloat(footprint.location.lat)],
    footprintData: footprint,
    // 为临时地点和保存的足迹使用不同的样式
    itemStyle: {
      color: footprint.isTemporary ? '#4CAF50' : '#FF5722',
    },
    symbolSize: footprint.isTemporary ? 20 : 15,
  }))
  // console.log(provinceData)
  // 设置图表配置
  const option = {
    title: {
      text: '我的足迹地图',
      left: 'center',
      textStyle: {
        color: '#333',
      },
    },
    visualMap: {
      min: 0,
      max: Math.max(...provinceData.map((item) => item.value), 5),
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      calculable: true,
      inRange: {
        color: ['#e0f7fa', '#4fc3f7', '#0288d1', '#01579b'],
      },
      textStyle: {
        color: '#333',
      },
    },
    geo: {
      map: 'china',
      roam: true,
      zoom: 1.3,
      center: [104.114129, 37.550339],
      itemStyle: {
        borderWidth: 0.5,
        borderColor: '#000000',
        areaColor: '#eee',
      },
      emphasis: {
        itemStyle: {
          areaColor: '#ccc',
        },
      },
      silent: false,
    },
    tooltip: {
      trigger: 'item',
      formatter: function (params) {
        if (params.data && params.data.footprintData) {
          const data = params.data.footprintData
          return data.name
        } else if (params.name) {
          const province = provinceData.find((item) => item.name === params.name)
          return province ? `${params.name}: ${province.value} 个足迹` : params.name
        }
        return ''
      },
    },
    series: [
      {
        name: '省份足迹',
        type: 'map',
        geoIndex: 0,
        map: 'china',
        data: provinceData.map((item) => ({
          name: item.name,
          value: item.value,
        })),
      },
      {
        name: '足迹点',
        type: 'scatter',
        coordinateSystem: 'geo', // 明确指定使用geo坐标系
        symbol: 'image://' + new URL('../../assets/marker/map.png', import.meta.url).href,
        symbolSize: function (val, params) {
          return params.data.symbolSize || 15
        },
        label: {
          show: true,
          formatter: '{b}',
          position: 'right',
          fontSize: 10,
        },
        itemStyle: {
          color: function (params) {
            return params.data.itemStyle?.color || '#FF5722'
          },
        },
        data: scatterData,
      },
    ],
  }

  chart.setOption(option)

  // 添加足迹标记点
  // addFootprintMarkers()
}

// 监听足迹数据变化
watch(
  () => mapStore.footprints,
  () => {
    updateChart()
  },
  { deep: true },
)

// 窗口大小变化时重新调整图表大小
const handleResize = () => {
  chart?.resize()
}

onMounted(async () => {
  // 初始化高德地图API（用于POI搜索）
  await mapStore.initMap()

  // 获取并显示用户足迹
  await mapStore.fetchFootprints()

  // 初始化ECharts图表
  initChart()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  chart?.dispose()
  window.removeEventListener('resize', handleResize)
})

// 分享足迹
const shareFootprints = async () => {
  try {
    // 获取地图容器的DOM元素
    const element = chartContainer.value
    if (!element) {
      showNotification('无法生成分享图片', 'error')
      return
    }

    showNotification('正在生成分享图片...', 'success')

    // 使用html2canvas将DOM元素转换为canvas
    const canvas = await html2canvas(element, {
      useCORS: true,
      scale: 2, // 提高清晰度
      backgroundColor: '#ffffff', // 使用固定的颜色值而不是CSS变量
      onclone: function (documentClone) {
        // 处理所有可能包含oklch颜色函数的元素
        const elements = documentClone.querySelectorAll('*')
        for (let i = 0; i < elements.length; i++) {
          const style = window.getComputedStyle(elements[i])
          const bgColor = style.backgroundColor
          const color = style.color

          // 如果包含oklch颜色函数，替换为标准RGB颜色
          if (bgColor && bgColor.includes('oklch')) {
            elements[i].style.backgroundColor = '#ffffff'
          }
          if (color && color.includes('oklch')) {
            elements[i].style.color = '#000000'
          }
        }
      },
    })

    // 将canvas转换为图片URL
    const imgUrl = canvas.toDataURL('image/png')

    // 创建下载链接
    const link = document.createElement('a')
    link.download = `我的足迹地图_${new Date().toISOString().split('T')[0]}.png`
    link.href = imgUrl
    link.click()

    showNotification('分享图片已生成', 'success')
  } catch (error) {
    console.error('生成分享图片失败:', error)
    showNotification(`生成分享图片失败: ${error}`, 'error')
  }
}

// 暴露方法给父组件
defineExpose({
  updateChart,
})
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 100%;
  border-radius: 20px;
}

.relative {
  position: relative;
  width: 100%;
  height: 100%;
}

.absolute {
  position: absolute;
}
</style>
