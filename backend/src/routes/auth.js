import express from 'express'
import { login, logout, me, register, signup } from '../controllers/authController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// All operations use POST method
router.post('/register', register)  // Saves to Register collection
router.post('/signup', signup)       // Saves to Signup collection
router.post('/login', login)          // Checks Register/Signup, logs to Login collection
router.post('/logout', logout)
router.post('/me', requireAuth, me)

export default router


