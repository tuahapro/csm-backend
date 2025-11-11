import { useEffect, useState } from 'react'

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
	const [isVisible, setIsVisible] = useState(true)
	const [isExiting, setIsExiting] = useState(false)

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsExiting(true)
			setTimeout(() => {
				setIsVisible(false)
				onClose?.()
			}, 300)
		}, duration)

		return () => clearTimeout(timer)
	}, [duration, onClose])

	if (!isVisible) return null

	const bgColor = type === 'success' 
		? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
		: type === 'error'
		? 'bg-red-50 border-red-200 text-red-800'
		: 'bg-blue-50 border-blue-200 text-blue-800'

	const iconColor = type === 'success'
		? 'text-emerald-600'
		: type === 'error'
		? 'text-red-600'
		: 'text-blue-600'

	return (
		<div 
			className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg transition-all duration-300 ${
				isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'
			} ${bgColor}`}
			style={{ minWidth: '300px', maxWidth: '400px' }}
		>
			{/* Icon */}
			<div className={`flex-shrink-0 ${iconColor}`}>
				{type === 'success' ? (
					<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				) : type === 'error' ? (
					<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
					</svg>
				) : (
					<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
					</svg>
				)}
			</div>
			
			{/* Message */}
			<p className="flex-1 text-sm font-medium">{message}</p>
			
			{/* Close Button */}
			<button
				onClick={() => {
					setIsExiting(true)
					setTimeout(() => {
						setIsVisible(false)
						onClose?.()
					}, 300)
				}}
				className={`flex-shrink-0 ${iconColor} hover:opacity-70 transition-opacity`}
			>
				<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	)
}

