import express from 'express'
import Footprint from '../models/Footprint.js'

const router = express.Router()

// 计算两点之间的距离（使用Haversine公式）
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // 地球半径，单位km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c
  return distance
}

// 获取所有足迹
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query
    let query = {}

    if (userId) query.userId = userId

    const footprints = await Footprint.find(query).sort({ createdAt: -1 })
    res.json(footprints)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 获取足迹统计数据
router.get('/statistics', async (req, res) => {
  try {
    const { userId } = req.query
    let query = {}

    if (userId) query.userId = userId

    const footprints = await Footprint.find(query)

    // 如果没有足迹数据，返回默认值
    if (footprints.length === 0) {
      return res.json({
        northernmostPlace: null,
        southernmostPlace: null,
        farthestPlace: null,
        mostTypePlace: null,
      })
    }

    // 计算最北的地方（纬度最大）
    let northernmostPlace = footprints[0]
    // 计算最南的地方（纬度最小）
    let southernmostPlace = footprints[0]

    // 当前位置（默认为北京，可以根据实际需求修改）
    const currentLocation = {
      lat: 30.6041,
      lng: 114.2654,
    }

    // 计算最远的地方（与当前位置的距离最大）
    let farthestPlace = footprints[0]
    let maxDistance = calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      farthestPlace.location.lat,
      farthestPlace.location.lng,
    )

    footprints.forEach((footprint) => {
      // 更新最北的地方
      if (footprint.location.lat > northernmostPlace.location.lat) {
        northernmostPlace = footprint
      }

      // 更新最南的地方
      if (footprint.location.lat < southernmostPlace.location.lat) {
        southernmostPlace = footprint
      }

      // 计算与当前位置的距离
      const distance = calculateDistance(
        currentLocation.lat,
        currentLocation.lng,
        footprint.location.lat,
        footprint.location.lng,
      )

      // 更新最远的地方
      if (distance > maxDistance) {
        maxDistance = distance
        farthestPlace = footprint
      }
    })

    // 计算类型最多的地方（按type分组计数）
    const typeCount = {}
    footprints.forEach((footprint) => {
      if (!typeCount[footprint.type]) {
        typeCount[footprint.type] = 1
      } else {
        typeCount[footprint.type]++
      }
    })

    // 找出出现次数最多的类型
    let mostType = ''
    let maxCount = 0
    for (const [type, count] of Object.entries(typeCount)) {
      if (count > maxCount) {
        maxCount = count
        mostType = type
      }
    }

    // 找出该类型的一个代表性地点
    const mostTypePlace = footprints.find((footprint) => footprint.type === mostType)

    res.json({
      northernmostPlace: {
        name: northernmostPlace.name,
        address: northernmostPlace.address,
        latitude: northernmostPlace.location.lat.toFixed(2),
        date: new Date(northernmostPlace.createdAt).toLocaleDateString('zh-CN'),
      },
      southernmostPlace: {
        name: southernmostPlace.name,
        address: southernmostPlace.address,
        latitude: southernmostPlace.location.lat.toFixed(2),
        date: new Date(southernmostPlace.createdAt).toLocaleDateString('zh-CN'),
      },
      farthestPlace: {
        name: farthestPlace.name,
        address: farthestPlace.address,
        country: '中国', // 默认中国，可以根据实际需求修改
        point: farthestPlace.type,
        date: new Date(farthestPlace.createdAt).toLocaleDateString('zh-CN'),
      },
      mostTypePlace: {
        name: mostTypePlace.name,
        address: mostTypePlace.address,
        type: mostTypePlace.type,
        count: maxCount,
        date: new Date(mostTypePlace.createdAt).toLocaleDateString('zh-CN'),
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 获取单个足迹
router.get('/:id', async (req, res) => {
  try {
    const footprint = await Footprint.findById(req.params.id)
    if (!footprint) return res.status(404).json({ message: '足迹未找到' })
    res.json(footprint)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// 创建新足迹
router.post('/', async (req, res) => {
  try {
    const footprint = new Footprint(req.body)
    const newFootprint = await footprint.save()
    res.status(201).json(newFootprint)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// 删除足迹
router.delete('/:id', async (req, res) => {
  try {
    const footprint = await Footprint.findById(req.params.id)
    if (!footprint) return res.status(404).json({ message: '足迹未找到' })

    await Footprint.findByIdAndDelete(req.params.id)
    res.json({ message: '足迹已删除' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

export default router
