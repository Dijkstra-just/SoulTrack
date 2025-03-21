import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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
  desc: string
  img: string
  time: string
  price: string
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
    // {
    //   id: 2,
    //   title: '香港｜城市探索之旅',
    //   image: '../assets/destination2.jpg',
    //   alt: '香港城市探索',
    //   duration: '2天1晚',
    //   spots: 8,
    // },
    // {
    //   id: 3,
    //   title: '澳门｜地道美食探索',
    //   image: '../assets/destination3.jpg',
    //   alt: '澳门美食之旅',
    //   duration: '1天0晚',
    //   spots: 6,
    // },
    // {
    //   id: 4,
    //   title: '深圳｜科技与人文的碰撞',
    //   image: '../assets/destination4.jpg',
    //   alt: '深圳科技之旅',
    //   duration: '3天2晚',
    //   spots: 15,
    // },
    // {
    //   id: 5,
    //   title: '广州｜岭南文化体验',
    //   image: '../assets/destination5.jpg',
    //   alt: '广州文化之旅',
    //   duration: '2天1晚',
    //   spots: 10,
    // },
    // {
    //   id: 6,
    //   title: '珠海｜海岛休闲度假',
    //   image: '../assets/destination6.jpg',
    //   alt: '珠海海岛游',
    //   duration: '3天2晚',
    //   spots: 7,
    // },
  ])

  const mydes = ref<Trip[]>([
    {
      id: 1,
      title: '喀什三日游|解锁梦中的西域风情',
      image: '/card-img/kashi/kashigucheng.png',
      alt: '喀什',
      duration: '3天2晚',
      spots: 11,
      details: {
        days: 3,
        address: [
          [
            {
              id: 111,
              name: '香妃园',
              lanlat: [76.026973, 39.488614],
              desc: '香妃园是以香妃为主题的旅游景区，墓主人是还珠格格中的香妃',
              img: './card-img/kashi/xiangfeiyuan.png',
              time: '10:00-18:00',
              price: '30r',
            },
            {
              id: 112,
              name: '喀什大巴扎',
              lanlat: [76.007915, 39.471277],
              desc: '电影《追风筝的人》开头两个男孩奔跑而过的牛羊大巴扎，充满浓郁的民族特色',
              img: '/card-img/kashi/dabazha.png',
              time: '10:00-18:00',
              price: '免费',
            },
            {
              id: 113,
              name: '喀什古城景区',
              lanlat: [75.990724, 39.471564],
              desc: '喀什古城是一座古城，有着喀什的风韵',
              img: '/card-img/kashi/kashigucheng.png',
              time: '10:00-18:00',
              price: '免费',
            },
            {
              id: 114,
              name: '艾提尕尔清真寺',
              lanlat: [75.987867, 39.472577],
              desc: '14:00-16:30不接受参观',
              img: '/card-img/kashi/qingzhensi.png',
              time: '10:30-19:30',
              price: '30r',
            },
            {
              id: 115,
              name: '喀什古城墙',
              lanlat: [75.983841, 39.46764],
              desc: '古城墙可以追溯到明朝，是中国保存最完好的城墙之一',
              img: '/card-img/kashi/guchengqiang.png',
              time: '10:00-18:00',
              price: '免费',
            },
          ],
          [
            {
              id: 121,
              name: '帕米尔高原',
              lanlat: [75.202301, 37.795199],
              desc: '古丝绸之路的必经之地，有壮观的雪山、广阔的草原、清澈的湖泊',
              img: '/card-img/kashi/pamier.png',
              time: '10:00-18:00',
              price: '免费',
            },
            {
              id: 122,
              name: '喀什博物馆',
              lanlat: [75.996271, 39.495487],
              desc: '穿越古今，见证千年中国东西方文化交融之地。',
              img: '/card-img/kashi/bowuguan.png',
              time: '10:00-18:00',
              price: '免费',
            },
            {
              id: 123,
              name: '高台民宿',
              lanlat: [76.005955, 39.475671],
              desc: '世界上现存规模最大的生土建筑群，很漂亮，很复古，很出群',
              img: '/card-img/kashi/minsu.png',
              time: '10:00-18:00',
              price: '免费',
            },
          ],
          [
            {
              id: 131,
              name: '达瓦昆沙漠旅游风景区',
              lanlat: [77.027571, 39.036036],
              desc: '国家AAAA级旅游风景区，毗邻死亡之海塔克拉玛干',
              img: '/card-img/kashi/shamo.png',
              time: '10:00-18:00',
              price: '免费',
            },
            {
              id: 132,
              name: '巴楚县红海景区',
              lanlat: [78.423956, 39.790943],
              desc: '红海胡杨林是世界上连片面积最大的天然胡杨林，金秋十月金色胡杨林风景绝美',
              img: '/card-img/kashi/huyanglin.png',
              time: '10:00-18:00',
              price: '40r',
            },
            {
              id: 133,
              name: '阿布都艾尼鲜味烤鱼餐厅',
              lanlat: [78.524749, 39.779545],
              desc: '品尝特色烤鱼',
              img: '/card-img/kashi/canting.png',
              time: '10:00-18:00',
              price: '免费',
            },
          ],
        ],
      },
    },
  ])
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

  // 添加新行程
  function addTrip(trip: Trip, isPersonal: boolean = false) {
    if (isPersonal) {
      mydes.value.push(trip)
    } else {
      destinations.value.push(trip)
    }
  }

  // 更新行程
  function updateTrip(updatedTrip: Trip, isPersonal: boolean = false) {
    if (isPersonal) {
      const index = mydes.value.findIndex((trip) => trip.id === updatedTrip.id)
      if (index !== -1) {
        mydes.value[index] = updatedTrip
      }
    } else {
      const index = destinations.value.findIndex((trip) => trip.id === updatedTrip.id)
      if (index !== -1) {
        destinations.value[index] = updatedTrip
      }
    }
  }

  // 删除行程
  function deleteTrip(tripId: number, isPersonal: boolean = false) {
    if (isPersonal) {
      mydes.value = mydes.value.filter((trip) => trip.id !== tripId)
    } else {
      destinations.value = destinations.value.filter((trip) => trip.id !== tripId)
    }

    if (selectedTrip.value && selectedTrip.value.id === tripId) {
      selectedTrip.value = null
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
  }
})
