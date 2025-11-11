import { createContext, useContext, useState } from 'react'
import Toast from '../components/Toast.jsx'

const ToastContext = createContext()

export function ToastProvider({ children }) {
	const [toasts, setToasts] = useState([])

	function showToast(message, type = 'success', duration = 3000) {
		const id = Date.now() + Math.random()
		setToasts((prev) => [...prev, { id, message, type, duration }])
		return id
	}

	function removeToast(id) {
		setToasts((prev) => prev.filter((t) => t.id !== id))
	}

	return (
		<ToastContext.Provider value={{ showToast }}>
			{children}
			<div className="fixed top-4 right-4 z-50 space-y-2">
				{toasts.map((toast) => (
					<Toast
						key={toast.id}
						message={toast.message}
						type={toast.type}
						duration={toast.duration}
						onClose={() => removeToast(toast.id)}
					/>
				))}
			</div>
		</ToastContext.Provider>
	)
}

export function useToast() {
	const context = useContext(ToastContext)
	if (!context) {
		throw new Error('useToast must be used within ToastProvider')
	}
	return context
}

