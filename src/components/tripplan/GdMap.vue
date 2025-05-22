<template>
  <div id="container">
    <div class="map-controls">
      <!-- <button @click="toggleNearbySearch" :class="{ active: nearbySearchEnabled }">
        {{ nearbySearchEnabled ? '关闭附近搜索' : '开启附近搜索' }}
      </button> -->
      <input
        type="checkbox"
        value="synthwave"
        class="toggle toggle-info"
        @click="toggleNearbySearch"
      />
      <label for="synthwave">附近推荐</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, watch, ref } from 'vue'
import AMapLoader from '@amap/amap-jsapi-loader'
import { useTripStore } from '../../stores/tripStore'
import type { Details } from '../../stores/tripStore'

// 导入图标
import sceneryIcon from '../../assets/marker/jingdian.png'
import zhongcantingIcon from '../../assets/marker/zhongcanting.png'
import museumIcon from '../../assets/marker/bowuguan.png'
import parkIcon from '../../assets/marker/gongyuan.png'
import pinIcon from '../../assets/marker/map.png'
import kuaicanIcon from '../../assets/marker/kuaican.png'
import teaIcon from '../../assets/marker/tea.png'
import kafeiIcon from '../../assets/marker/kafei.png'
import wcIcon from '../../assets/marker/wc.png'
import dianyingyuanIcon from '../../assets/marker/dianyingyuan.png'
import tiyuIcon from '../../assets/marker/tiyu.png'
import naichaIcon from '../../assets/marker/naicha.png'
import jiubaIcon from '../../assets/marker/jiuba.png'
import jiudianIcon from '../../assets/marker/jiudian.png'

const tripStore = useTripStore()

// 附近搜索相关变量
const nearbySearchEnabled = ref(false)
let nearbyMarkers = [] as any[] // 存储附近搜索的标记点

// POI类型和对应的图标
const poiTypes = {
  风景名胜: sceneryIcon,
  中餐厅: zhongcantingIcon,
  博物馆: museumIcon,
  公园: parkIcon,
  快餐厅: kuaicanIcon,
  茶艺馆: teaIcon,
  咖啡厅: kafeiIcon,
  厕所: wcIcon,
  电影院: dianyingyuanIcon,
  运动场馆: tiyuIcon,
  冷饮店: naichaIcon,
  酒吧: jiubaIcon,
  住宿服务: jiudianIcon,
  其他: pinIcon,
}

let map = null as any // 高德地图实例
let AMap = null as any // 高德地图对象
let markers = [] as any[] // 存储所有标记点
let polylines = [] as any[] // 存储所有路线

// 不同天的路线颜色
const dayColors = [
  '#FF5252', // 红色
  '#4CAF50', // 绿色
  '#2196F3', // 蓝色
  '#FF9800', // 橙色
  '#9C27B0', // 紫色
  '#00BCD4', // 青色
  '#FFEB3B', // 黄色
]

// 清除所有标记和路线
const clearMapOverlays = () => {
  if (map) {
    // 清除所有标记点
    markers.forEach((marker) => {
      map.remove(marker)
    })
    markers = []

    // 清除所有路线
    polylines.forEach((polyline) => {
      map.remove(polyline)
    })
    polylines = []

    // 清除附近搜索的标记点
    clearNearbyMarkers()
  }
}

// 清除附近搜索的标记点
const clearNearbyMarkers = () => {
  if (map) {
    nearbyMarkers.forEach((marker) => {
      map.remove(marker)
    })
    nearbyMarkers = []
  }
}

// 切换附近搜索功能
const toggleNearbySearch = () => {
  nearbySearchEnabled.value = !nearbySearchEnabled.value

  if (nearbySearchEnabled.value) {
    // 如果启用了附近搜索，对当前显示的每个景点进行搜索
    searchNearbyPOIs()
  } else {
    // 如果禁用了附近搜索，清除所有附近搜索的标记点
    clearNearbyMarkers()
  }
}

// 搜索附近的POI
const searchNearbyPOIs = () => {
  if (!map || !AMap || !tripStore.selectedTrip || !tripStore.selectedTrip.details) return

  const details = tripStore.selectedTrip.details as Details
  const days = details.address || []

  if (days.length === 0) return

  // 判断当前是否为总览模式
  const isOverview = tripStore.activeTab === 'overview'

  // 遍历每一天的景点
  days.forEach((day, dayIndex) => {
    if (!day || !Array.isArray(day) || day.length === 0) return

    // 如果不是总览模式且不是当前选中的天数，则跳过
    if (!isOverview && tripStore.activeTab !== `day${dayIndex + 1}`) {
      return
    }

    const daySpots = day.filter((spot) => spot && spot.lanlat && spot.lanlat.length === 2)

    if (daySpots.length === 0) return

    // 对每个景点进行附近搜索
    daySpots.forEach((spot) => {
      const center = new AMap.LngLat(spot.lanlat[0], spot.lanlat[1])
      const radius = 3000 // 搜索半径，单位：米

      // 创建PlaceSearch实例
      const placeSearch = new AMap.PlaceSearch({
        pageSize: 3,
        pageIndex: 1,
        extensions: 'all',
      })

      // 搜索风景名胜
      placeSearch.searchNearBy('风景名胜', center, radius, (status, result) => {
        if (status === 'complete' && result.poiList && result.poiList.pois) {
          addNearbyMarkers(result.poiList.pois, '风景名胜')
        }
      })

      // 搜索餐饮服务
      placeSearch.searchNearBy('中餐厅', center, radius, (status, result) => {
        if (status === 'complete' && result.poiList && result.poiList.pois) {
          addNearbyMarkers(result.poiList.pois, '中餐厅')
        }
      })

      // 搜索文化服务
      placeSearch.searchNearBy(
        '博物馆|展览馆|美术馆|图书馆|科技馆|天文馆|文化宫|档案馆',
        center,
        radius,
        (status, result) => {
          if (status === 'complete' && result.poiList && result.poiList.pois) {
            addNearbyMarkers(result.poiList.pois, '博物馆')
          }
        },
      )

      // 搜索游乐园
      placeSearch.searchNearBy('公园', center, radius, (status, result) => {
        if (status === 'complete' && result.poiList && result.poiList.pois) {
          addNearbyMarkers(result.poiList.pois, '公园')
        }
      })

      placeSearch.searchNearBy('冷饮店|糕饼店|甜品店', center, radius, (status, result) => {
        if (status === 'complete' && result.poiList && result.poiList.pois) {
          addNearbyMarkers(result.poiList.pois, '冷饮店')
        }
      })

      placeSearch.searchNearBy('酒吧', center, radius, (status, result) => {
        if (status === 'complete' && result.poiList && result.poiList.pois) {
          addNearbyMarkers(result.poiList.pois, '酒吧')
        }
      })
      placeSearch.searchNearBy('咖啡厅', center, radius, (status, result) => {
        if (status === 'complete' && result.poiList && result.poiList.pois) {
          addNearbyMarkers(result.poiList.pois, '咖啡厅')
        }
      })
      placeSearch.searchNearBy('电影院', center, radius, (status, result) => {
        if (status === 'complete' && result.poiList && result.poiList.pois) {
          addNearbyMarkers(result.poiList.pois, '电影院')
        }
      })
      placeSearch.searchNearBy('运动场馆', center, radius, (status, result) => {
        if (status === 'complete' && result.poiList && result.poiList.pois) {
          addNearbyMarkers(result.poiList.pois, '运动场馆')
        }
      })
      placeSearch.searchNearBy('住宿服务', center, radius, (status, result) => {
        if (status === 'complete' && result.poiList && result.poiList.pois) {
          addNearbyMarkers(result.poiList.pois, '住宿服务')
        }
      })
      placeSearch.searchNearBy('公共厕所', center, radius, (status, result) => {
        if (status === 'complete' && result.poiList && result.poiList.pois) {
          addNearbyMarkers(result.poiList.pois, '厕所')
        }
      })
      placeSearch.searchNearBy('茶艺馆', center, radius, (status, result) => {
        if (status === 'complete' && result.poiList && result.poiList.pois) {
          addNearbyMarkers(result.poiList.pois, '茶艺馆')
        }
      })
    })
  })
}

// 添加附近搜索的标记点
const addNearbyMarkers = (pois, type) => {
  if (!pois || !Array.isArray(pois) || pois.length === 0) return

  pois.forEach((poi) => {
    if (!poi.location) return

    // 创建标记
    const position = new AMap.LngLat(poi.location.lng, poi.location.lat)

    // 获取对应类型的图标
    const iconPath = poiTypes[type] || poiTypes['其他']

    // 创建标记
    const marker = new AMap.Marker({
      position,
      title: poi.name,
      icon: new AMap.Icon({
        size: new AMap.Size(24, 24),
        image: iconPath,
        imageSize: new AMap.Size(24, 24),
      }),
      offset: new AMap.Pixel(-12, -12),
    })

    // 创建信息窗体
    const infoWindow = new AMap.InfoWindow({
      content: `
        <div style="padding: 10px;">
          <h3>${poi.name}</h3>
          <p>地址: ${poi.address || '暂无地址'}</p>
          <p>电话: ${poi.tel || '暂无电话'}</p>
          <p>类型: ${type}</p>
          <p>距离: ${poi.distance}米</p>
        </div>
      `,
      offset: new AMap.Pixel(0, -30),
    })

    // 点击标记时显示信息窗体
    marker.on('click', () => {
      infoWindow.open(map, marker.getPosition())
    })

    nearbyMarkers.push(marker)
    map.add(marker)
  })
}

// 绘制行程路线
const drawTripRoute = () => {
  if (!map || !AMap || !tripStore.selectedTrip || !tripStore.selectedTrip.details) return

  clearMapOverlays()

  const details = tripStore.selectedTrip.details as Details
  const days = details.address || []

  if (days.length === 0) return

  // 所有景点的坐标，用于调整地图视野
  const allPoints = []

  // 判断当前是否为总览模式
  const isOverview = tripStore.activeTab === 'overview'

  // 遍历每一天
  days.forEach((day, dayIndex) => {
    if (!day || !Array.isArray(day) || day.length === 0) return

    // 如果不是总览模式且不是当前选中的天数，则跳过
    if (!isOverview && tripStore.activeTab !== `day${dayIndex + 1}`) {
      return
    }

    const dayColor = dayColors[dayIndex % dayColors.length]
    const daySpots = day.filter((spot) => spot && spot.lanlat && spot.lanlat.length === 2)

    if (daySpots.length === 0) return

    // 创建每个景点的标记
    daySpots.forEach((spot, spotIndex) => {
      const position = new AMap.LngLat(spot.lanlat[0], spot.lanlat[1])
      allPoints.push(position)

      // 创建自定义标记内容 - 使用数字序号
      const markerContent = document.createElement('div')
      markerContent.className = 'custom-marker'
      markerContent.style.backgroundColor = dayColor
      markerContent.style.color = 'white'
      markerContent.style.padding = '4px 8px'
      markerContent.style.borderRadius = '50%'
      markerContent.style.fontSize = '12px'
      markerContent.style.fontWeight = 'bold'
      markerContent.style.display = 'flex'
      markerContent.style.justifyContent = 'center'
      markerContent.style.alignItems = 'center'
      markerContent.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)'
      markerContent.innerHTML = `${spotIndex + 1}`

      // 创建标记
      const marker = new AMap.Marker({
        position,
        title: spot.name,
        content: markerContent,
        anchor: 'center',
      })

      // 创建信息窗体
      const infoWindow = new AMap.InfoWindow({
        content: `
          <div style="padding: 10px;">
            <h3>${spot.name}</h3>
            <p>${spot.desc || '暂无描述'}</p>
            <p>开放时间: ${spot.time || '未知'}</p>
            <p>价格: ${spot.price || '未知'}</p>
          </div>
        `,
        offset: new AMap.Pixel(0, -30),
      })

      // 点击标记时显示信息窗体
      marker.on('click', () => {
        infoWindow.open(map, marker.getPosition())
      })

      markers.push(marker)
      map.add(marker)
    })

    // 如果当天有多个景点，绘制路线
    if (daySpots.length > 1) {
      // 构建路径规划请求的起点和途经点
      const origin = daySpots[0].lanlat
      const destination = daySpots[daySpots.length - 1].lanlat
      const waypoints = daySpots.slice(1, daySpots.length - 1).map((spot) => spot.lanlat)

      // 使用驾车路线规划
      const driving = new AMap.Driving({
        panel: false,
        policy: AMap.DrivingPolicy.LEAST_TIME,
      })

      // 清除上一次规划的路线
      driving.clear()
      // clearMapOverlays()

      // 规划路线
      driving.search(
        new AMap.LngLat(origin[0], origin[1]),
        new AMap.LngLat(destination[0], destination[1]),
        {
          waypoints: waypoints.map((point) => new AMap.LngLat(point[0], point[1])),
        },
        (status: string, result) => {
          if (status === 'complete') {
            // 获取规划的路线
            const routes = result.routes || []
            if (routes.length > 0) {
              const path = [] as number[][]

              // 获取路径坐标点
              routes[0].steps.forEach((step) => {
                step.path.forEach((point) => {
                  path.push([point.lng, point.lat])
                })
              })

              // 创建折线
              const polyline = new AMap.Polyline({
                path: path,
                strokeColor: dayColor,
                strokeWeight: 6,
                strokeOpacity: 0.8,
                strokeStyle: 'solid',
                strokeDasharray: [10, 5],
                lineJoin: 'round',
                lineCap: 'round',
                zIndex: 50,
              })

              polylines.push(polyline)
              map.add(polyline)
            }
          } else {
            console.error('路线规划失败:', result)

            // 如果路线规划失败，使用直线连接
            const path = daySpots.map((spot) => [spot.lanlat[0], spot.lanlat[1]])

            const polyline = new AMap.Polyline({
              path: path,
              strokeColor: dayColor,
              strokeWeight: 6,
              strokeOpacity: 0.8,
              strokeStyle: 'dashed',
              strokeDasharray: [10, 5],
              lineJoin: 'round',
              lineCap: 'round',
              zIndex: 50,
            })

            polylines.push(polyline)
            map.add(polyline)
          }
        },
      )
    }
  })

  // 调整地图视野以包含所有标记点
  if (allPoints.length > 0) {
    map.setFitView(null, false, [60, 60, 60, 60])
  }
}

onMounted(() => {
  ;(window as any)._AMapSecurityConfig = {
    securityJsCode: '716c1b7208213ed166290c741460f4cf',
  }

  // Load AMap and plugins
  AMapLoader.load({
    key: 'a616248301c4b1c75d266f578e4de415', // Your developer key
    version: '2.0', // The version of the JSAPI
    plugins: ['AMap.Scale', 'AMap.Driving', 'AMap.InfoWindow', 'AMap.PlaceSearch'], // 添加需要的插件
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

      // 添加比例尺控件
      map.addControl(new AMap.Scale())

      // 如果已有选中的行程，绘制路线
      if (tripStore.selectedTrip) {
        drawTripRoute()
      }
    })
    .catch((e) => {
      console.error('AMap failed to load:', e)
    })
})

// 监听选中的行程变化和标签页变化
watch(
  [() => tripStore.selectedTrip, () => tripStore.activeTab],
  () => {
    if (map && AMap) {
      drawTripRoute()

      // 如果附近搜索功能已启用，重新执行搜索
      if (nearbySearchEnabled.value) {
        clearNearbyMarkers() // 先清除现有的标记
        searchNearbyPOIs() // 重新搜索
      }
    }
  },
  { deep: true },
)

// 当选择新行程时，重置为总览模式
watch(
  () => tripStore.selectedTrip,
  () => {
    if (tripStore.selectedTrip) {
      tripStore.switchActiveTab('overview')
    }
  },
)

onUnmounted(() => {
  clearMapOverlays()
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
  position: relative;
}

.map-controls {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 100;
}

.map-controls button {
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.map-controls button:hover {
  background-color: #f5f5f5;
}

.map-controls button.active {
  background-color: #2196f3;
  color: white;
  border-color: #2196f3;
}
</style>
