import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useToast } from '../context/ToastContext.jsx'

export default function AuthLogin() {
	const { login } = useAuth()
	const { showToast } = useToast()
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	async function onSubmit(e) {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			await login({ email, password })
			showToast('Login successful! Welcome back.', 'success')
			setTimeout(() => navigate('/courses'), 500)
		} catch (e) {
			setError(e.message)
			showToast(e.message || 'Login failed. Please try again.', 'error')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="mx-auto max-w-md">
			<h1 className="text-2xl font-semibold">Login</h1>
			<form onSubmit={onSubmit} className="mt-6 space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700">Email</label>
					<input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="mt-1 w-full rounded border px-3 py-2" required />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">Password</label>
					<input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="mt-1 w-full rounded border px-3 py-2" required />
				</div>
				{error && <p className="text-sm text-red-600">{error}</p>}
				<button disabled={loading} className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50">
					{loading ? 'Signing in...' : 'Login'}
				</button>
			</form>
		</div>
	)
}


