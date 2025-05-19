import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
export interface Trip {
  id: number
  title: string
  image: string
  alt: string
  duration: string
  spots: number
  details?: Details
}
export interface Details {
  days: number
  address: Address[][]
}

export interface Address {
  id: number
  name: string
  lanlat: [number, number]
  desc?: string
  img: string
  time?: string
  price?: string
}
export const useTripStore = defineStore('trip', () => {
  // 所有行程数据
  const destinations = ref<Trip[]>([])
  const mydes = ref<Trip[]>([])
  const isLoading = ref(false)
  const error = ref('')
  // 当前选中的行程类型：'recommended'(推荐行程) 或 'my'(我的行程)
  const tripType = ref('recommended')

  // 当前选中的行程
  const selectedTrip = ref<{
    id: number
    title: string
    image: string
    alt: string
    duration: string
    spots: number
    details?: Details | undefined
  } | null>(null)

  // 切换行程类型
  function switchTripType(type: string) {
    tripType.value = type
    // 切换类型时清空选中的行程
    selectedTrip.value = null
  }

  // 根据当前类型获取对应的行程列表
  const currentTrips = computed(() => {
    return tripType.value === 'recommended' ? destinations.value : mydes.value
  })

  // 选择行程的方法
  function selectTrip(tripId: number) {
    // 根据当前选择的类型从对应的数组中查找行程
    if (tripType.value === 'recommended') {
      selectedTrip.value = destinations.value.find((trip) => trip.id === tripId) || null
    } else {
      selectedTrip.value = mydes.value.find((trip) => trip.id === tripId) || null
    }
  }

  // 从服务器获取行程数据
  async function fetchTrips() {
    isLoading.value = true
    error.value = ''
    try {
      // 获取推荐行程
      const recommendedResponse = await axios.get('/api/trips', {
        params: { isPersonal: false },
      })
      destinations.value = recommendedResponse.data

      // 获取个人行程
      const personalResponse = await axios.get('/api/trips', {
        params: { isPersonal: true },
      })
      mydes.value = personalResponse.data
    } catch (err: any) {
      console.error('获取行程数据失败:', err)
      error.value = err.message || '获取行程数据失败'
    } finally {
      isLoading.value = false
    }
  }

  // 添加新行程
  async function addTrip(trip: Trip, isPersonal: boolean = false) {
    isLoading.value = true
    error.value = ''
    try {
      const newTrip = {
        ...trip,
        isPersonal,
      }
      const response = await axios.post('/api/trips', newTrip)

      if (isPersonal) {
        mydes.value.push(response.data)
      } else {
        destinations.value.push(response.data)
      }
      return response.data
    } catch (err: any) {
      console.error('添加行程失败:', err)
      error.value = err.message || '添加行程失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 更新行程
  async function updateTrip(updatedTrip: Trip, isPersonal: boolean = false) {
    isLoading.value = true
    error.value = ''
    try {
      const response = await axios.put(`/api/trips/${updatedTrip.id}`, {
        ...updatedTrip,
        isPersonal,
      })

      if (isPersonal) {
        const index = mydes.value.findIndex((trip) => trip.id === updatedTrip.id)
        if (index !== -1) {
          mydes.value[index] = response.data
        }
      } else {
        const index = destinations.value.findIndex((trip) => trip.id === updatedTrip.id)
        if (index !== -1) {
          destinations.value[index] = response.data
        }
      }
      return response.data
    } catch (err: any) {
      console.error('更新行程失败:', err)
      error.value = err.message || '更新行程失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 删除行程
  async function deleteTrip(tripId: number, isPersonal: boolean = false) {
    isLoading.value = true
    error.value = ''
    try {
      await axios.delete(`/api/trips/${tripId}`)

      if (isPersonal) {
        mydes.value = mydes.value.filter((trip) => trip.id !== tripId)
      } else {
        destinations.value = destinations.value.filter((trip) => trip.id !== tripId)
      }

      if (selectedTrip.value && selectedTrip.value.id === tripId) {
        selectedTrip.value = null
      }
    } catch (err: any) {
      console.error('删除行程失败:', err)
      error.value = err.message || '删除行程失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 添加地点到行程
  async function addSpotToTrip(tripId: number, dayIndex: number, spot: any) {
    isLoading.value = true
    error.value = ''
    try {
      const response = await axios.post(`/api/trips/${tripId}/day/${dayIndex}/spot`, spot)

      // 更新本地数据
      const trip = response.data
      const isPersonalTrip = mydes.value.some((t) => t.id === tripId)

      if (isPersonalTrip) {
        const index = mydes.value.findIndex((t) => t.id === tripId)
        if (index !== -1) {
          mydes.value[index] = trip
        }
      } else {
        const index = destinations.value.findIndex((t) => t.id === tripId)
        if (index !== -1) {
          destinations.value[index] = trip
        }
      }

      // 如果当前选中的就是这个行程，更新selectedTrip
      if (selectedTrip.value && selectedTrip.value.id === tripId) {
        selectedTrip.value = trip
      }

      return trip
    } catch (err: any) {
      console.error('添加地点失败:', err)
      error.value = err.message || '添加地点失败'
      throw err
    } finally {
      isLoading.value = false
    }
  }

  // 在tripStore.ts中添加activeTab状态

  // 当前激活的标签页
  const activeTab = ref('overview')

  // 切换激活的标签页
  function switchActiveTab(tab: string) {
    activeTab.value = tab
  }

  // 在return语句中添加这两个属性
  return {
    destinations,
    mydes,
    tripType,
    switchTripType,
    currentTrips,
    selectedTrip,
    selectTrip,
    addTrip,
    updateTrip,
    deleteTrip,
    activeTab,
    switchActiveTab,
    fetchTrips,
    addSpotToTrip,
    isLoading,
    error,
  }
})
