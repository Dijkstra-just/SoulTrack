import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import AMapLoader from '@amap/amap-jsapi-loader'

export const useEchartMapStore = defineStore('echartMap', () => {
  // 地图相关状态
  let AMap = null as any
  const searchText = ref('')
  const places = ref<any[]>([])
  const isLoading = ref(false)
  const selectedPlace = ref<any>(null)
  const footprints = ref<any[]>([])
  let isMapInitialized = false

  // 初始化高德地图API（仅用于POI搜索）
  const initMap = async () => {
    ;(window as any)._AMapSecurityConfig = {
      securityJsCode: '716c1b7208213ed166290c741460f4cf',
    }

    try {
      // 加载高德地图和插件
      const loadedAMap = await AMapLoader.load({
        key: 'a616248301c4b1c75d266f578e4de415',
        version: '2.0',
        plugins: ['AMap.AutoComplete', 'AMap.PlaceSearch'],
      })

      AMap = loadedAMap
      isMapInitialized = true
    } catch (e) {
      console.error('AMap failed to load:', e)
    }
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
          // console.log('搜索结果:', result.poiList.pois)
          if (status === 'complete' && result.info === 'OK') {
            places.value = result.poiList.pois
            resolve(result.poiList.pois)
            // console.log(places.value)
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

  // 获取用户足迹
  const fetchFootprints = async () => {
    try {
      const response = await axios.get('/api/footprints', {
        params: { userId: '1' }, // 默认用户ID
      })
      footprints.value = response.data
      // console.log(footprints.value)
      return footprints.value
    } catch (error) {
      console.error('获取足迹失败:', error)
      return []
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
        pname: place.pname,
        cityname: place.cityname,
        adname: place.adname,
        type: place.type.split(';')[0],
        //pname cityname adname
      }

      const response = await axios.post('/api/footprints', footprintData)
      footprints.value.push(response.data)
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
    } catch (error) {
      console.error('删除足迹失败:', error)
      throw error
    }
  }

  // 统计数据
  const statistics = computed(() => {
    // 提取所有国家、城市和地点
    const countries = new Set()
    const cities = new Set()
    const seasons = { 春: 0, 夏: 0, 秋: 0, 冬: 0 }

    // 最远的地方（这里简化处理，实际应该根据经纬度计算距离）
    const farthestPlace = {
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

    // 统计季节（简化处理）
    footprints.value.forEach((footprint) => {
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
      places: footprints.value.length || 88,
      topSeason,
      farthestPlace,
      highestPlace,
    }
  })

  // 计算各省份的足迹数量
  const calculateProvinceData = () => {
    const provinceCount = {}

    // 统计每个省份的足迹数量
    footprints.value.forEach((footprint) => {
      // 从地址中提取省份信息
      // console.log(footprint.pname)
      const province = footprint.pname
      if (province) {
        provinceCount[province] = (provinceCount[province] || 0) + 1
      }
    })

    // 转换为ECharts需要的数据格式
    return Object.keys(provinceCount).map((province) => ({
      name: province,
      value: provinceCount[province],
    }))
  }

  // 在地图上显示选中的地点
  const showPlaceOnMap = (place: any) => {
    selectedPlace.value = place
    // 触发事件，通知地图组件显示该地点
    // 这里我们将选中的地点添加到一个临时数组中，供EchartsMap组件使用
    const tempPlace = {
      name: place.name,
      location: {
        lng: place.location.lng,
        lat: place.location.lat,
      },
      address: place.address,
      pname: place.pname || '',
      cityname: place.cityname || '',
      adname: place.adname || '',
      isTemporary: true, // 标记为临时地点，不是保存的足迹
    }

    // 将临时地点添加到足迹数组的副本中，但不保存到数据库
    // 这样EchartsMap组件就能显示这个地点
    const tempFootprint = { ...tempPlace }
    // 移除之前的临时地点
    footprints.value = footprints.value.filter((fp) => !fp.isTemporary)
    // 添加新的临时地点
    footprints.value.push(tempFootprint)
  }

  return {
    AMap,
    searchText,
    places,
    isLoading,
    selectedPlace,
    footprints,
    isMapInitialized,
    statistics,
    initMap,
    searchPlaces,
    fetchFootprints,
    saveFootprint,
    deleteFootprint,
    calculateProvinceData,
    showPlaceOnMap,
  }
})
