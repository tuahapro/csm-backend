import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import { ProfileAPI } from '../lib/api.js'

export default function Profile() {
	const { user } = useAuth()
	const [form, setForm] = useState({ name: '', email: '', phoneNumber: '' })
	const [status, setStatus] = useState('')
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if (user) {
			setForm({ 
				name: user.name || '', 
				email: user.email || '', 
				phoneNumber: user.phoneNumber || '' 
			})
		}
	}, [user])

	function update(field, value) {
		setForm((f) => ({ ...f, [field]: value }))
		setError('')
		setStatus('')
	}

	async function onSubmit(e) {
		e.preventDefault()
		setStatus('')
		setError('')
		setLoading(true)
		
		try {
			await ProfileAPI.update(form)
			setStatus('Profile updated successfully!')
			setTimeout(() => setStatus(''), 3000)
		} catch (err) {
			setError(err.message || 'Failed to update profile')
		} finally {
			setLoading(false)
		}
	}

	if (!user) {
		return (
			<div className="mx-auto max-w-2xl">
				<div className="rounded-lg border border-gray-200 bg-white p-8 text-center shadow-sm">
					<p className="text-gray-600">Please log in to view your profile.</p>
				</div>
			</div>
		)
	}

	return (
		<div className="mx-auto max-w-2xl">
			{/* Header Section */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
				<p className="mt-2 text-gray-600">Manage your account information and preferences</p>
			</div>

			{/* Profile Card */}
			<div className="rounded-xl border border-gray-200 bg-white shadow-sm">
				<div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
					<h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
					<p className="mt-1 text-sm text-gray-600">Update your personal details below</p>
				</div>

				<form onSubmit={onSubmit} className="p-6">
					<div className="space-y-6">
						{/* Name Field */}
						<div>
							<label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
								Full Name
							</label>
							<input
								id="name"
								type="text"
								value={form.name}
								onChange={(e) => update('name', e.target.value)}
								required
								className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-colors"
								placeholder="Enter your full name"
							/>
						</div>

						{/* Email Field */}
						<div>
							<label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
								Email Address
							</label>
							<input
								id="email"
								type="email"
								value={form.email}
								onChange={(e) => update('email', e.target.value)}
								required
								className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-colors"
								placeholder="Enter your email address"
							/>
							<p className="mt-1.5 text-xs text-gray-500">Your email is used for account verification and notifications</p>
						</div>

						{/* Phone Number Field */}
						<div>
							<label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
								Phone Number
							</label>
							<input
								id="phoneNumber"
								type="tel"
								value={form.phoneNumber}
								onChange={(e) => update('phoneNumber', e.target.value)}
								className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-20 transition-colors"
								placeholder="Enter your phone number"
							/>
							<p className="mt-1.5 text-xs text-gray-500">Optional: Add your phone number for account recovery</p>
						</div>
					</div>

					{/* Status Messages */}
					{error && (
						<div className="mt-6 rounded-lg bg-red-50 border border-red-200 px-4 py-3">
							<p className="text-sm font-medium text-red-800">{error}</p>
						</div>
					)}

					{status && (
						<div className="mt-6 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-3">
							<p className="text-sm font-medium text-emerald-800">{status}</p>
						</div>
					)}

					{/* Action Buttons */}
					<div className="mt-8 flex items-center justify-end gap-3 border-t border-gray-200 pt-6">
						<button
							type="button"
							onClick={() => {
								setForm({ 
									name: user.name || '', 
									email: user.email || '', 
									phoneNumber: user.phoneNumber || '' 
								})
								setError('')
								setStatus('')
							}}
							className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={loading}
							className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
						>
							{loading ? 'Saving...' : 'Save Changes'}
						</button>
					</div>
				</form>
			</div>

			{/* Additional Info Section */}
			<div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
				<h3 className="text-sm font-semibold text-gray-900 mb-3">Account Details</h3>
				<div className="space-y-2 text-sm">
					<div className="flex justify-between">
						<span className="text-gray-600">Account ID</span>
						<span className="font-mono text-gray-900">{user._id || 'N/A'}</span>
					</div>
					<div className="flex justify-between">
						<span className="text-gray-600">Member Since</span>
						<span className="text-gray-900">
							{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}


