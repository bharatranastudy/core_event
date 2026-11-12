import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import mongoose from 'mongoose'
import connectDB from './config/db.js'
import { errorHandler, notFound } from './middleware/errorMiddleware.js'
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import eventRoutes from './routes/eventRoutes.js'
import networkingRoutes from './routes/networkingRoutes.js'
import registrationRoutes from './routes/registrationRoutes.js'
import speakerRoutes from './routes/speakerRoutes.js'

dotenv.config()

const app = express()

// Connect to MongoDB if MONGO_URI is provided
connectDB()

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'ConnectSphere API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  })
})

// Guard DB-backed routes when MongoDB is not yet configured/connected
app.use('/api', (req, res, next) => {
  if (req.path === '/health') return next()
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message:
        'Database not connected. Configure MONGO_URI in server/.env and ensure MongoDB is running.',
    })
  }
  next()
})

app.use('/api/auth', authRoutes)
app.use('/api/events', eventRoutes)
app.use('/api/speakers', speakerRoutes)
app.use('/api/registrations', registrationRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/networking', networkingRoutes)

app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`[ConnectSphere API] Server running on port ${PORT}`)
})
