import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function AuthRegister() {
	const { register } = useAuth()
	const navigate = useNavigate()
	const [form, setForm] = useState({ name: '', email: '', password: '', phoneNumber: '' })
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	function update(field, value) {
		setForm((f)=>({ ...f, [field]: value }))
	}

	async function onSubmit(e) {
		e.preventDefault()
		setError('')
		setLoading(true)
		try {
			await register(form)
			navigate('/courses')
		} catch (e) {
			setError(e.message)
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="mx-auto max-w-md">
			<h1 className="text-2xl font-semibold">Create account</h1>
			<form onSubmit={onSubmit} className="mt-6 space-y-4">
				<div>
					<label className="block text-sm font-medium text-gray-700">Name</label>
					<input value={form.name} onChange={(e)=>update('name', e.target.value)} className="mt-1 w-full rounded border px-3 py-2" required />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">Email</label>
					<input value={form.email} onChange={(e)=>update('email', e.target.value)} type="email" className="mt-1 w-full rounded border px-3 py-2" required />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">Password</label>
					<input value={form.password} onChange={(e)=>update('password', e.target.value)} type="password" className="mt-1 w-full rounded border px-3 py-2" required />
				</div>
				<div>
					<label className="block text-sm font-medium text-gray-700">Phone Number</label>
					<input value={form.phoneNumber} onChange={(e)=>update('phoneNumber', e.target.value)} className="mt-1 w-full rounded border px-3 py-2" />
				</div>
				{error && <p className="text-sm text-red-600">{error}</p>}
				<button disabled={loading} className="w-full rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50">
					{loading ? 'Creating...' : 'Register'}
				</button>
			</form>
		</div>
	)
}


