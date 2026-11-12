import express from 'express'
import {
  createSpeaker,
  deleteSpeaker,
  getSpeakerById,
  getSpeakers,
  updateSpeaker,
} from '../controllers/speakerController.js'
import { adminOnly, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/').get(getSpeakers).post(protect, adminOnly, createSpeaker)
router
  .route('/:id')
  .get(getSpeakerById)
  .put(protect, adminOnly, updateSpeaker)
  .delete(protect, adminOnly, deleteSpeaker)

export default router
