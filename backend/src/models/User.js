import mongoose from 'mongoose'

// Consolidated User collection - stores all user documents
const userSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true, index: true },
		passwordHash: { type: String, required: true },
		phoneNumber: { type: String },
	},
	{ 
		timestamps: true,
		collection: 'User' // Explicit collection name to avoid pluralization
	}
)

export const User = mongoose.model('User', userSchema, 'User')
