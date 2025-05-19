import { defineStore } from 'pinia'
import AMapLoader from '@amap/amap-jsapi-loader'
import { ref } from 'vue'
import axios from 'axios'
import icon from '../assets/marker/icons8-地图针-48.png'
export const useMapStore = defineStore('map', () => {
  // 地图相关状态
  let AMap = null as any
  let map = null as any
  const searchText = ref('')
  const places = ref<any[]>([])
  const isLoading = ref(false)
  const selectedPlace = ref<any>(null)
  const markers = ref<any[]>([])
  let marker = null as any
  const footprints = ref<any[]>([])
  const footprintMarkers = ref<any[]>([])

  // 初始化地图
  const initMap = async () => {
    ;(window as any)._AMapSecurityConfig = {
      securityJsCode: '716c1b7208213ed166290c741460f4cf',
    }

    try {
      // 加载高德地图和插件
      const loadedAMap = await AMapLoader.load({
        key: 'a616248301c4b1c75d266f578e4de415',
        version: '2.0',
        plugins: [
          'AMap.Scale',
          'AMap.Driving',
          'AMap.InfoWindow',
          'AMap.AutoComplete',
          'AMap.PlaceSearch',
        ],
      })

      AMap = loadedAMap
    } catch (e) {
      console.error('AMap failed to load:', e)
    }
  }

  // 初始化地图实例
  const initMapInstance = (containerId: string) => {
    map = new AMap.Map(containerId, {
      viewMode: '3D',
      zoom: 4.8,
      center: [103.834228, 36.060798],
      mapStyle: 'amap://styles/macaron',
    })

    // 添加比例尺控件
    map.addControl(new AMap.Scale())
  }

  // 搜索地点
  const searchPlaces = async (keyword: string) => {
    if (!AMap || !keyword.trim()) {
      places.value = []
      return
    }

    isLoading.value = true

    try {
      const placeSearch = new AMap.PlaceSearch({
        extensions: 'all',
      })

      return new Promise((resolve, reject) => {
        placeSearch.search(keyword, (status: string, result: any) => {
          isLoading.value = false

          if (status === 'complete' && result.info === 'OK') {
            places.value = result.poiList.pois
            console.log('搜索结果:', result.poiList.pois)
            resolve(result.poiList.pois)
          } else {
            console.error('搜索失败:', result)
            reject(result)
          }
        })
      })
    } catch (error) {
      isLoading.value = false
      console.error('搜索出错:', error)
      places.value = []
    }
  }

  // 在地图上显示地点
  const showPlaceOnMap = (place: any) => {
    // 清除之前的临时标记
    if (marker) {
      map.remove(marker)
    }

    map.panTo([place.location.lng, place.location.lat])
    map.setZoom(15)
    marker = new AMap.Marker({
      map: map,
      position: [place.location.lng, place.location.lat],
    })
    map.add(marker)
  }

  // 获取用户足迹
  const fetchFootprints = async () => {
    try {
      const response = await axios.get('/api/footprints', {
        params: { userId: '1' }, // 默认用户ID
      })
      footprints.value = response.data
      showFootprintsOnMap()
    } catch (error) {
      console.error('获取足迹失败:', error)
    }
  }

  // 保存足迹
  const saveFootprint = async (place: any) => {
    try {
      const footprintData = {
        name: place.name,
        address: place.address,
        location: {
          lng: place.location.lng,
          lat: place.location.lat,
        },
        photos: place.photos || [],
        tel: place.tel || '',
        userId: '1', // 默认用户ID
      }

      const response = await axios.post('/api/footprints', footprintData)
      footprints.value.push(response.data)
      showFootprintsOnMap()
      return response.data
    } catch (error) {
      console.error('保存足迹失败:', error)
      throw error
    }
  }

  // 删除足迹
  const deleteFootprint = async (footprintId: string) => {
    try {
      await axios.delete(`/api/footprints/${footprintId}`)
      footprints.value = footprints.value.filter((fp) => fp._id !== footprintId)
      showFootprintsOnMap()
    } catch (error) {
      console.error('删除足迹失败:', error)
      throw error
    }
  }

  // 在地图上显示所有足迹
  const showFootprintsOnMap = () => {
    // 清除之前的足迹标记
    if (footprintMarkers.value.length > 0) {
      map.remove(footprintMarkers.value)
      footprintMarkers.value = []
    }

    // 添加新的足迹标记
    footprints.value.forEach((footprint) => {
      const marker = new AMap.Marker({
        map: map,
        position: [footprint.location.lng, footprint.location.lat],
        icon: new AMap.Icon({
          size: new AMap.Size(34, 34),
          image: icon,
          imageSize: new AMap.Size(34, 34),
        }),
        title: footprint.name,
      })

      footprintMarkers.value.push(marker)
    })

    map.add(footprintMarkers.value)
  }

  return {
    AMap,
    map,
    searchText,
    places,
    isLoading,
    selectedPlace,
    footprints,
    initMap,
    initMapInstance,
    searchPlaces,
    showPlaceOnMap,
    fetchFootprints,
    saveFootprint,
    deleteFootprint,
    showFootprintsOnMap,
  }
})
