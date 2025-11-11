import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { AuthAPI } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		AuthAPI.me()
			.then(setUser)
			.catch(() => setUser(null))
			.finally(() => setLoading(false))
	}, [])

	const value = useMemo(
		() => ({
			user,
			loading,
			async login(credentials) {
				const me = await AuthAPI.login(credentials)
				setUser(me)
				return me
			},
			async register(payload) {
				const me = await AuthAPI.register(payload)
				setUser(me)
			 return me
			},
			async logout() {
				await AuthAPI.logout()
				setUser(null)
			}
		}),
		[user, loading]
	)

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}


