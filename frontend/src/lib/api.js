const API_BASE = '/api'

export async function apiRequest(path, options = {}) {
	const res = await fetch(`${API_BASE}${path}`, {
		credentials: 'include',
		headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
		...options
	})
	if (!res.ok) {
		const message = await safeJson(res)
		throw new Error(message?.error || res.statusText)
	}
	return safeJson(res)
}

async function safeJson(res) {
	try {
		return await res.json()
	} catch {
		return null
	}
}

export const AuthAPI = {
	register: (payload) => apiRequest('/auth/register', { method: 'POST', body: JSON.stringify(payload) }), // Saves to Register collection
	signup: (payload) => apiRequest('/auth/signup', { method: 'POST', body: JSON.stringify(payload) }), // Saves to Signup collection
	login: (payload) => apiRequest('/auth/login', { method: 'POST', body: JSON.stringify(payload) }), // Checks Register/Signup, logs to Login
	logout: () => apiRequest('/auth/logout', { method: 'POST' }),
	me: () => apiRequest('/auth/me', { method: 'POST', body: JSON.stringify({ action: 'get' }) })
}

export const ProfileAPI = {
	update: (payload) => apiRequest('/users/me', { method: 'POST', body: JSON.stringify({ action: 'update', ...payload }) })
}

export const CoursesAPI = {
	list: () => apiRequest('/courses', { method: 'POST', body: JSON.stringify({ action: 'list' }) }),
	get: (id) => apiRequest('/courses', { method: 'POST', body: JSON.stringify({ action: 'get', id }) }),
	create: (payload) => apiRequest('/courses', { method: 'POST', body: JSON.stringify({ action: 'create', ...payload }) }),
	update: (id, payload) => apiRequest('/courses', { method: 'POST', body: JSON.stringify({ action: 'update', id, ...payload }) }),
	remove: (id) => apiRequest('/courses', { method: 'POST', body: JSON.stringify({ action: 'delete', id }) })
}


