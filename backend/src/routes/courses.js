import express from 'express'
import { createCourse, deleteCourse, getCourse, listCourses, updateCourse } from '../controllers/courseController.js'
import { requireAuth } from '../middleware/auth.js'

const router = express.Router()

// Helper to wrap auth-required handlers
function withAuth(handler) {
	return [requireAuth, handler]
}

// All operations use POST method with action in body
router.post('/', async (req, res, next) => {
	const { action, id, ...payload } = req.body || {}
	
	try {
		if (action === 'list') {
			return await listCourses(req, res)
		} else if (action === 'get' && id) {
			req.params = { id }
			return await getCourse(req, res)
		} else if (action === 'create') {
			req.body = payload
			// Chain auth middleware then handler
			requireAuth(req, res, () => {
				createCourse(req, res).catch(next)
			})
		} else if (action === 'update' && id) {
			req.params = { id }
			req.body = payload
			requireAuth(req, res, () => {
				updateCourse(req, res).catch(next)
			})
		} else if (action === 'delete' && id) {
			req.params = { id }
			requireAuth(req, res, () => {
				deleteCourse(req, res).catch(next)
			})
		} else {
			return res.status(400).json({ error: 'Invalid action or missing id' })
		}
	} catch (err) {
		next(err)
	}
})

export default router


