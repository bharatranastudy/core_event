import express from 'express'
import {
  createConnection,
  getMyConnections,
  getNetworkingProfiles,
} from '../controllers/networkingController.js'
import { protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/attendees', getNetworkingProfiles)
router.post('/connect', protect, createConnection)
router.get('/connections', protect, getMyConnections)

export default router
