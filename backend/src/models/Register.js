import mongoose from 'mongoose'

// Register collection - stores user registration data
const registerSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true, lowercase: true, index: true },
		passwordHash: { type: String, required: true },
		phoneNumber: { type: String }
	},
	{ 
		timestamps: true,
		collection: 'Register' // Explicitly set collection name
	}
)

export const Register = mongoose.model('Register', registerSchema, 'Register')

