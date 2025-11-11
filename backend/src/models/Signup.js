import mongoose from 'mongoose'

// Signup collection - stores user signup data (same as Register, but separate collection)
const signupSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true, index: true },
		passwordHash: { type: String, required: true },
		phoneNumber: { type: String }
	},
	{ 
		timestamps: true,
		collection: 'Signup' // Explicitly set collection name
	}
)

export const Signup = mongoose.model('Signup', signupSchema, 'Signup')

