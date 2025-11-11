import mongoose from 'mongoose'

// Default database name is "User"
const defaultMongoUri = 'mongodb://127.0.0.1:27017/User'

export async function connectMongo() {
	const mongoUri = process.env.MONGO_URI || defaultMongoUri
	mongoose.set('strictQuery', true)
	
	try {
		await mongoose.connect(mongoUri, {
			serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
			socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
		})
		console.log(`✅ Connected to MongoDB database: ${mongoose.connection.name}`)
		return mongoose.connection
	} catch (error) {
		console.error('❌ MongoDB connection error:', error.message)
		console.error('   Make sure MongoDB is running and MONGO_URI is correct')
		console.error('   Current URI:', mongoUri.replace(/\/\/.*@/, '//***:***@')) // Hide credentials
		throw error
	}
}

export async function disconnectMongo() {
	await mongoose.disconnect()
}


