import express from 'express'
import Trip from '../models/Trip.js'

const router = express.Router()

// 获取所有行程
router.get('/', async (req, res) => {
  try {
    const { isPersonal, userId } = req.query
    let query = {}

    if (isPersonal === 'true' && userId) {
      query = { isPersonal: true, userId }
    } else if (isPersonal === 'false') {
      query = { isPersonal: false }
    }

    const trips = await Trip.find(query)
    res.status(200).json(trips)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// 获取单个行程
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findOne({ id: req.params.id })
    if (!trip) {
      return res.status(404).json({ message: '行程未找到' })
    }
    res.status(200).json(trip)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// 创建行程
router.post('/', async (req, res) => {
  try {
    // 获取最大ID值
    const maxIdTrip = await Trip.findOne().sort('-id')
    const newId = maxIdTrip ? maxIdTrip.id + 1 : 1

    const newTrip = new Trip({
      ...req.body,
      id: newId,
    })

    const savedTrip = await newTrip.save()
    res.status(201).json(savedTrip)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// 更新行程
router.put('/:id', async (req, res) => {
  try {
    const updatedTrip = await Trip.findOneAndUpdate({ id: req.params.id }, req.body, { new: true })

    if (!updatedTrip) {
      return res.status(404).json({ message: '行程未找到' })
    }

    res.status(200).json(updatedTrip)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// 添加地点到特定天
router.post('/:id/day/:dayIndex/spot', async (req, res) => {
  try {
    const { id, dayIndex } = req.params
    const newSpot = req.body

    const trip = await Trip.findOne({ id })
    if (!trip) {
      return res.status(404).json({ message: '行程未找到' })
    }

    if (!trip.details || !trip.details.address || !trip.details.address[dayIndex]) {
      return res.status(404).json({ message: '指定的天数不存在' })
    }

    // 获取当前天的最大spot ID
    const daySpots = trip.details.address[dayIndex]
    const maxSpotId = daySpots.length > 0 ? Math.max(...daySpots.map((spot) => spot.id)) : 0

    // 添加新地点
    const spotWithId = { ...newSpot, id: maxSpotId + 1 }
    trip.details.address[dayIndex].push(spotWithId)

    // 更新spots总数
    let totalSpots = 0
    trip.details.address.forEach((day) => {
      totalSpots += day.length
    })
    trip.spots = totalSpots

    await trip.save()
    res.status(200).json(trip)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

// 删除行程
router.delete('/:id', async (req, res) => {
  try {
    const deletedTrip = await Trip.findOneAndDelete({ id: req.params.id })

    if (!deletedTrip) {
      return res.status(404).json({ message: '行程未找到' })
    }

    res.status(200).json({ message: '行程已删除' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

export default router
