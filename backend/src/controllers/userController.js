import { Register } from '../models/Register.js'
import { Signup } from '../models/Signup.js'

export async function updateMe(req, res) {
	const userId = req.user.id
	const { name, phoneNumber, email } = req.body || {}
	const updates = {}
	if (name !== undefined) updates.name = name
	if (phoneNumber !== undefined) updates.phoneNumber = phoneNumber
	if (email !== undefined) updates.email = email.toLowerCase()
	
	// Try to find user in Register collection first, then Signup
	let updated = await Register.findByIdAndUpdate(userId, { $set: updates }, { new: true })
	if (!updated) {
		updated = await Signup.findByIdAndUpdate(userId, { $set: updates }, { new: true })
	}
	
	if (!updated) {
		return res.status(404).json({ error: 'User not found' })
	}
	
	return res.json({ id: updated._id.toString(), name: updated.name, email: updated.email, phoneNumber: updated.phoneNumber })
}


