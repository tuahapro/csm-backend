import { Course } from '../models/Course.js'

export async function listCourses(_req, res) {
	const items = await Course.find().sort({ createdAt: -1 }).lean()
	return res.json(items)
}

export async function getCourse(req, res) {
	const { id } = req.params
	const c = await Course.findById(id).lean()
	if (!c) return res.status(404).json({ error: 'not found' })
	return res.json(c)
}

export async function createCourse(req, res) {
	const { title, description, price, duration, category, instructorName, courseImage } = req.body || {}
	if (!title || !description || price === undefined || !duration || !category || !instructorName) {
		return res.status(400).json({ error: 'missing required fields' })
	}
	const created = await Course.create({
		title, description, price, duration, category, instructorName, courseImage, creator: req.user.id
	})
	return res.status(201).json(created)
}

export async function updateCourse(req, res) {
	const { id } = req.params
	const updates = req.body || {}
	const updated = await Course.findByIdAndUpdate(id, { $set: updates }, { new: true })
	if (!updated) return res.status(404).json({ error: 'not found' })
	return res.json(updated)
}

export async function deleteCourse(req, res) {
	const { id } = req.params
	const deleted = await Course.findByIdAndDelete(id)
	if (!deleted) return res.status(404).json({ error: 'not found' })
	return res.status(204).end()
}


