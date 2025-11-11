import jwt from 'jsonwebtoken'
import { Register } from '../models/Register.js'
import { Signup } from '../models/Signup.js'

const COOKIE_NAME = 'token'

export function signToken(payload) {
	const secret = process.env.JWT_SECRET || 'dev-secret'
	return jwt.sign(payload, secret, { expiresIn: '7d' })
}

export async function requireAuth(req, res, next) {
	try {
		const token = req.cookies?.[COOKIE_NAME]
		if (!token) return res.status(401).json({ error: 'unauthorized' })
		const secret = process.env.JWT_SECRET || 'dev-secret'
		const decoded = jwt.verify(token, secret)
		
		// Check Register collection first, then Signup
		let user = await Register.findById(decoded.sub).lean()
		if (!user) {
			user = await Signup.findById(decoded.sub).lean()
		}
		
		if (!user) return res.status(401).json({ error: 'unauthorized' })
		req.user = { id: user._id.toString(), name: user.name, email: user.email, phoneNumber: user.phoneNumber }
		next()
	} catch (e) {
		return res.status(401).json({ error: 'unauthorized' })
	}
}

export function setAuthCookie(res, token) {
	const isProd = process.env.NODE_ENV === 'production'
	res.cookie(COOKIE_NAME, token, {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? 'none' : 'lax',
		maxAge: 7 * 24 * 60 * 60 * 1000
	})
}

export function clearAuthCookie(res) {
	const isProd = process.env.NODE_ENV === 'production'
	res.clearCookie(COOKIE_NAME, {
		httpOnly: true,
		secure: isProd,
		sameSite: isProd ? 'none' : 'lax'
	})
}


