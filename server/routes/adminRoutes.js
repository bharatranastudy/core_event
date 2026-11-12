import express from 'express'
import { getAdminStats } from '../controllers/adminController.js'
import { adminOnly, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/stats', protect, adminOnly, getAdminStats)

export default router
