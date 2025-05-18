import express from 'express'
import cors from 'cors'
import connectDB from './db/index.js'
import messagesRoutes from './routes/messages.js'
import footprintsRoutes from './routes/footprints.js'
import dotenv from 'dotenv'
import authRoutes from './routes/authRoutes.js'

const app = express()
const PORT = process.env.PORT || 3000
// 加载环境变量
dotenv.config()
// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/messages', messagesRoutes)
app.use('/api/footprints', footprintsRoutes)
app.use('/api/auth', authRoutes)
// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' })
})

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

export default app
