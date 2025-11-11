import mongoose from 'mongoose'

// Login collection - tracks login events/attempts
const loginSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, lowercase: true, index: true },
		userId: { type: String }, // Reference to user ID from Register/Signup
		loginTime: { type: Date, default: Date.now },
		ipAddress: { type: String },
		userAgent: { type: String },
		success: { type: Boolean, default: true }, // true for successful login, false for failed
		message: { type: String } // Success or error message
	},
	{ 
		timestamps: true,
		collection: 'Login' // Explicitly set collection name
	}
)

export const Login = mongoose.model('Login', loginSchema, 'Login')

