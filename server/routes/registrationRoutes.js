import express from 'express'
import {
  createRegistration,
  deleteRegistration,
  getAllRegistrations,
  getMyRegistrations,
  updateRegistrationStatus,
} from '../controllers/registrationController.js'
import { adminOnly, optionalProtect, protect } from '../middleware/authMiddleware.js'

const router = express.Router()

router
  .route('/')
  .post(optionalProtect, createRegistration)
  .get(protect, adminOnly, getAllRegistrations)

router.get('/my', protect, getMyRegistrations)
router
  .route('/:id')
  .patch(protect, adminOnly, updateRegistrationStatus)
  .delete(protect, deleteRegistration)

export default router
