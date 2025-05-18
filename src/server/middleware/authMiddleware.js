import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// 保护路由中间件
export const protect = async (req, res, next) => {
  let token

  // 检查请求头中的令牌
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // 获取令牌
      token = req.headers.authorization.split(' ')[1]

      // 验证令牌
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      // 获取用户信息并添加到请求对象
      req.user = await User.findById(decoded.id).select('-password')

      next()
    } catch (error) {
      console.error('认证错误:', error)
      res.status(401).json({ message: '未授权，令牌无效' })
    }
  }

  if (!token) {
    res.status(401).json({ message: '未授权，没有令牌' })
  }
}
