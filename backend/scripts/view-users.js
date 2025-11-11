import mongoose from 'mongoose'
import { Register } from '../src/models/Register.js'
import { Signup } from '../src/models/Signup.js'
import { Login } from '../src/models/Login.js'
import { connectMongo } from '../src/db/mongo.js'

async function viewUsers() {
	try {
		await connectMongo()
		console.log('Connected to MongoDB database: User\n')
		
		// Get users from Register collection
		const registerUsers = await Register.find().select('-passwordHash').lean()
		console.log(`=== Register Collection (${registerUsers.length} users) ===`)
		if (registerUsers.length === 0) {
			console.log('No users found in Register collection.\n')
		} else {
			registerUsers.forEach((user, index) => {
				console.log(`${index + 1}. ${user.name}`)
				console.log(`   Email: ${user.email}`)
				console.log(`   Phone: ${user.phoneNumber || 'N/A'}`)
				console.log(`   ID: ${user._id}`)
				console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`)
				console.log('')
			})
		}
		
		// Get users from Signup collection
		const signupUsers = await Signup.find().select('-passwordHash').lean()
		console.log(`=== Signup Collection (${signupUsers.length} users) ===`)
		if (signupUsers.length === 0) {
			console.log('No users found in Signup collection.\n')
		} else {
			signupUsers.forEach((user, index) => {
				console.log(`${index + 1}. ${user.name}`)
				console.log(`   Email: ${user.email}`)
				console.log(`   Phone: ${user.phoneNumber || 'N/A'}`)
				console.log(`   ID: ${user._id}`)
				console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`)
				console.log('')
			})
		}
		
		// Get login records from Login collection
		const loginRecords = await Login.find().sort({ loginTime: -1 }).limit(20).lean()
		console.log(`=== Login Collection (Last 20 login records) ===`)
		if (loginRecords.length === 0) {
			console.log('No login records found.\n')
		} else {
			loginRecords.forEach((record, index) => {
				console.log(`${index + 1}. ${record.email}`)
				console.log(`   User ID: ${record.userId || 'N/A'}`)
				console.log(`   Success: ${record.success ? 'Yes' : 'No'}`)
				console.log(`   Message: ${record.message || 'N/A'}`)
				console.log(`   Login Time: ${new Date(record.loginTime).toLocaleString()}`)
				console.log(`   IP: ${record.ipAddress || 'N/A'}`)
				console.log('')
			})
		}
		
		await mongoose.disconnect()
		console.log('Disconnected from MongoDB')
	} catch (error) {
		console.error('Error:', error.message)
		process.exit(1)
	}
}

viewUsers()

