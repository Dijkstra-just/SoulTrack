import express from 'express'
import Footprint from '../models/Footprint.js'

const router = express.Router()

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
