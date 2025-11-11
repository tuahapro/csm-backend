import { User } from '../models/User.js'

// Insert a new user document into the consolidated 'User' collection
export async function createUser(req, res) {
	try {
		const { name, email, passwordHash, phoneNumber } = req.body || {}

		if (!name || !email || !passwordHash) {
			return res.status(400).json({ error: 'name, email and passwordHash are required' })
		}

		const doc = await User.create({
			name,
			email: email.toLowerCase(),
			passwordHash,
			phoneNumber,
		})

		return res.status(201).json({
			id: doc._id.toString(),
			name: doc.name,
			email: doc.email,
			phoneNumber: doc.phoneNumber,
			createdAt: doc.createdAt,
		})
	} catch (err) {
		if (err && err.code === 11000) {
			return res.status(409).json({ error: 'Email already exists' })
		}
		return res.status(500).json({ error: 'Failed to create user', details: err.message })
	}
}
