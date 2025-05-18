import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// 生成JWT令牌
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// 注册用户
export const register = async (req, res) => {
  try {
    const { username, password } = req.body

    // 检查用户是否已存在
    const userExists = await User.findOne({ username })

    if (userExists) {
      return res.status(400).json({ message: '用户名已被使用' })
    }

    // 创建新用户
    const user = await User.create({
      username,
      password,
    })

    if (user) {
      res.status(201).json({
        message: '用户注册成功',
      })
    } else {
      res.status(400).json({ message: '无效的用户数据' })
    }
  } catch (error) {
    console.error('注册错误:', error)
    res.status(500).json({ message: error.message })
  }
}

// 用户登录
export const login = async (req, res) => {
  try {
    const { username, password } = req.body

    // 查找用户并包含密码字段
    const user = await User.findOne({ username }).select('+password')

    if (!user) {
      return res.status(401).json({ message: '用户名或密码不正确' })
    }

    // 验证密码
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      return res.status(401).json({ message: '用户名或密码不正确' })
    }

    // 创建令牌
    const token = generateToken(user._id)

    res.json({
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    })
  } catch (error) {
    console.error('登录错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}

// 获取当前用户信息
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return res.status(404).json({ message: '用户不存在' })
    }

    res.json({
      id: user._id,
      username: user.username,
    })
  } catch (error) {
    console.error('获取用户信息错误:', error)
    res.status(500).json({ message: '服务器错误' })
  }
}
