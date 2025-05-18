import express from 'express'

const router = express.Router()
import { register, login, getMe } from '../controllers/authController.js'
import { protect } from '../middleware/authMiddleware.js'

// 注册路由
router.post('/register', register)

// 登录路由
router.post('/login', login)

// 获取当前用户信息路由（需要认证）
router.get('/me', protect, getMe)

export default router
