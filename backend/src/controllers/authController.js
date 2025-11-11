import bcrypt from 'bcryptjs'
import { Register } from '../models/Register.js'
import { Signup } from '../models/Signup.js'
import { Login } from '../models/Login.js'
import { clearAuthCookie, setAuthCookie, signToken } from '../middleware/auth.js'

// Register - saves to Register collection
export async function register(req, res) {
	const { name, email, password, phoneNumber } = req.body || {}
	if (!name || !email || !password) {
		return res.status(400).json({ error: 'name, email, password are required' })
	}
	
	// Check if email exists in Register or Signup collections
	const existingRegister = await Register.findOne({ email: email.toLowerCase() })
	const existingSignup = await Signup.findOne({ email: email.toLowerCase() })
	if (existingRegister || existingSignup) {
		return res.status(409).json({ error: 'email already in use' })
	}
	
	const passwordHash = await bcrypt.hash(password, 10)
	const user = await Register.create({ 
		name, 
		email: email.toLowerCase(), 
		passwordHash, 
		phoneNumber 
	})
	
	console.log(`[REGISTER] New user registered in Register collection: ${user.email} (ID: ${user._id})`)
	
	const token = signToken({ sub: user._id.toString() })
	setAuthCookie(res, token)
	return res.status(201).json(sanitizeUser(user))
}

// Signup - saves to Signup collection (same as register but different collection)
export async function signup(req, res) {
	const { name, email, password, phoneNumber } = req.body || {}
	if (!name || !email || !password) {
		return res.status(400).json({ error: 'name, email, password are required' })
	}
	
	// Check if email exists in Register or Signup collections
	const existingRegister = await Register.findOne({ email: email.toLowerCase() })
	const existingSignup = await Signup.findOne({ email: email.toLowerCase() })
	if (existingRegister || existingSignup) {
		return res.status(409).json({ error: 'email already in use' })
	}
	
	const passwordHash = await bcrypt.hash(password, 10)
	const user = await Signup.create({ 
		name, 
		email: email.toLowerCase(), 
		passwordHash, 
		phoneNumber 
	})
	
	console.log(`[SIGNUP] New user signed up in Signup collection: ${user.email} (ID: ${user._id})`)
	
	const token = signToken({ sub: user._id.toString() })
	setAuthCookie(res, token)
	return res.status(201).json(sanitizeUser(user))
}

// Login - checks Register and Signup collections, logs to Login collection
export async function login(req, res) {
	const { email, password } = req.body || {}
	if (!email || !password) return res.status(400).json({ error: 'email and password are required' })
	
	// Try to find user in Register collection first, then Signup
	let user = await Register.findOne({ email: email.toLowerCase() })
	let collectionName = 'Register'
	
	if (!user) {
		user = await Signup.findOne({ email: email.toLowerCase() })
		collectionName = 'Signup'
	}
	
	if (!user) {
		// Log failed login attempt
		await Login.create({
			email: email.toLowerCase(),
			success: false,
			message: 'User not found',
			ipAddress: req.ip || req.headers['x-forwarded-for'] || 'unknown',
			userAgent: req.headers['user-agent'] || 'unknown'
		})
		return res.status(401).json({ error: 'invalid credentials' })
	}
	
	const ok = await bcrypt.compare(password, user.passwordHash)
	if (!ok) {
		// Log failed login attempt
		await Login.create({
			email: email.toLowerCase(),
			userId: user._id.toString(),
			success: false,
			message: 'Invalid password',
			ipAddress: req.ip || req.headers['x-forwarded-for'] || 'unknown',
			userAgent: req.headers['user-agent'] || 'unknown'
		})
		return res.status(401).json({ error: 'invalid credentials' })
	}
	
	// Log successful login
	await Login.create({
		email: email.toLowerCase(),
		userId: user._id.toString(),
		success: true,
		message: 'Login successful',
		ipAddress: req.ip || req.headers['x-forwarded-for'] || 'unknown',
		userAgent: req.headers['user-agent'] || 'unknown'
	})
	
	console.log(`[LOGIN] User logged in from ${collectionName} collection: ${user.email} (ID: ${user._id})`)
	
	const token = signToken({ sub: user._id.toString() })
	setAuthCookie(res, token)
	return res.json(sanitizeUser(user))
}

export async function logout(_req, res) {
	clearAuthCookie(res)
	return res.status(204).end()
}

export async function me(req, res) {
	return res.json(req.user)
}

function sanitizeUser(u) {
	return { id: u._id.toString(), name: u.name, email: u.email, phoneNumber: u.phoneNumber }
}


