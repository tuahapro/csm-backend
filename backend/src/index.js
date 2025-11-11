import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { connectMongo } from './db/mongo.js'
import cookieParser from 'cookie-parser'
import authRouter from './routes/auth.js'
import usersRouter from './routes/users.js'
import coursesRouter from './routes/courses.js'

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:8080'
app.use(cors({ origin: frontendOrigin, credentials: true }))
app.use(express.json())
app.use(cookieParser())

// Connect to MongoDB at startup
connectMongo()
	.then(() => {
		console.log('✅ MongoDB connection established')
	})
	.catch((err) => {
		console.error('❌ Failed to connect to MongoDB:', err.message)
		console.error('   Please check:')
		console.error('   1. MongoDB is running (local) or cluster is accessible (Atlas)')
		console.error('   2. MONGO_URI in .env file is correct')
		console.error('   3. Network access is configured (for Atlas)')
		console.error('\n   Server will continue but database operations will fail.')
		console.error('   Fix the connection and restart the server.\n')
	})

app.get('/api/health', (req, res) => {
	res.json({ status: 'ok', uptimeSeconds: process.uptime() })
})

app.get('/api/hello', (req, res) => {
	res.json({ message: 'Hello from Express backend!' })
})

app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use('/api/courses', coursesRouter)

app.listen(port, () => {
	console.log(`Backend listening on http://localhost:${port}`)
})


