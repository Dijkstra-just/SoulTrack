import { defineStore } from 'pinia'
import { ref } from 'vue'
interface Trip {
  id: number
  title: string
  image: string
  alt: string
  duration: string
  spots: number
  details?: object
}
export const useTripStore = defineStore('trip', () => {
  // 所有行程数据
  const destinations = ref<Trip[]>([
    {
      id: 1,
      title: '常德二日游|陶渊明的世外桃源',
      image: '/card-img/changde/all.jpg',
      alt: '宝藏小城中山',
      duration: '2天1晚',
      spots: 15,
      details: {
        days: 2,
        address: [
          [
            {
              id: 111,
              name: '大小河街',
              lanlat: [116.391298, 39.908745],
              desc: '这里是一座小城，有很多人来这里玩。',
              img: '/src/assets/IMG_20250106_154910.jpg',
              time: '10:00-18:00',
              price: '免费',
            },
            {
              id: 112,
              name: '德国小镇',
              lanlat: [116.391298, 39.908745],
              desc: '这里是一座小城，有很多人来这里玩。',
              img: '/src/assets/IMG_20250106_154910.jpg',
              time: '10:00-18:00',
              price: '免费',
            },
          ],
          [
            {
              id: 121,
              name: '桃花源景区',
              lanlat: [116.391298, 39.908745],
              desc: '这里是一座小城，有很多人来这里玩。',
              img: '/src/assets/IMG_20250106_154910.jpg',
              time: '10:00-18:00',
              price: '免费',
            },
            {
              id: 122,
              name: '柳叶湖',
              lanlat: [116.391298, 39.908745],
              desc: '这里是一座小城，有很多人来这里玩。',
              img: '/src/assets/IMG_20250106_154910.jpg',
              time: '10:00-18:00',
              price: '免费',
            },
          ],
        ],
      },
    },
    {
      id: 2,
      title: '香港｜城市探索之旅',
      image: '../assets/destination2.jpg',
      alt: '香港城市探索',
      duration: '2天1晚',
      spots: 8,
    },
    {
      id: 3,
      title: '澳门｜地道美食探索',
      image: '../assets/destination3.jpg',
      alt: '澳门美食之旅',
      duration: '1天0晚',
      spots: 6,
    },
    {
      id: 4,
      title: '深圳｜科技与人文的碰撞',
      image: '../assets/destination4.jpg',
      alt: '深圳科技之旅',
      duration: '3天2晚',
      spots: 15,
    },
    {
      id: 5,
      title: '广州｜岭南文化体验',
      image: '../assets/destination5.jpg',
      alt: '广州文化之旅',
      duration: '2天1晚',
      spots: 10,
    },
    {
      id: 6,
      title: '珠海｜海岛休闲度假',
      image: '../assets/destination6.jpg',
      alt: '珠海海岛游',
      duration: '3天2晚',
      spots: 7,
    },
  ])

  // 当前选中的行程
  // const selectedTrip= ref(null)
  const selectedTrip = ref<{
    id: number
    title: string
    image: string
    alt: string
    duration: string
    spots: number
    details?: object | undefined
  } | null>(null)
  // 选择行程的方法
  function selectTrip(tripId: number) {
    selectedTrip.value = destinations.value.find((trip) => trip.id === tripId) || null
  }

  // 添加新行程
  function addTrip(trip: Trip) {
    destinations.value.push(trip)
  }

  // 更新行程
  function updateTrip(updatedTrip: Trip) {
    const index = destinations.value.findIndex((trip) => trip.id === updatedTrip.id)
    if (index !== -1) {
      destinations.value[index] = updatedTrip
    }
  }

  // 删除行程
  function deleteTrip(tripId: number) {
    destinations.value = destinations.value.filter((trip) => trip.id !== tripId)
    if (selectedTrip.value && selectedTrip.value.id === tripId) {
      selectedTrip.value = null
    }
  }

  return {
    destinations,
    selectedTrip,
    selectTrip,
    addTrip,
    updateTrip,
    deleteTrip,
  }
})
