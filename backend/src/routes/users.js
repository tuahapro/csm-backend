import express from 'express'
import { updateMe } from '../controllers/userController.js'
import { createUser } from '../controllers/userInsertController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// Create a new user document in consolidated 'User' collection
router.post('/', createUser)

// Authenticated self-update
router.post('/me', requireAuth, updateMe)

export default router


