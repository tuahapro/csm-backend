import { Link } from 'react-router-dom'
import { useState } from 'react'

function formatDate(iso) {
	try {
		const d = new Date(iso)
		return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
	} catch {
		return ''
	}
}

export default function CourseCard({ course }) {
	const [imgError, setImgError] = useState(false)
	const {
		_id,
		title,
		instructorName,
		courseImage,
		createdAt,
		enrolled,
		code,
		courseCode
	} = course || {}

	const displayCode = code || courseCode || '—'
	const dateStr = createdAt ? formatDate(createdAt) : ''
	const status = enrolled ? 'Enrolled' : 'Not enrolled'
	const statusColor = enrolled ? 'bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200' : 'bg-gray-100 text-gray-700 ring-1 ring-inset ring-gray-200'
	// Normalize common path inputs: backslashes, leading './', 'public/' prefix
	function normalizeImagePath(p) {
		if (!p) return null
		let s = String(p).trim().replace(/\\/g, '/')
		if (s.startsWith('./')) s = s.slice(2)
		if (s.startsWith('public/')) s = s.slice(6)
		if (s.startsWith('/')) return s
		if (s.startsWith('http')) return s
		// Default to /images for assets placed in frontend/public/images
		return `/images/${s}`
	}
	const imageSrc = normalizeImagePath(courseImage)

	return (
		<Link to={`/courses/${_id}`} className="group block rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-200">
			<div className="relative aspect-[16/9] bg-gray-100">
				{imageSrc && !imgError ? (
					<img
						src={imageSrc}
						alt=""
						onError={() => setImgError(true)}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
					/>
				) : (
					<div className="h-full w-full bg-gradient-to-br from-indigo-100 via-white to-purple-100 relative">
						{courseImage ? (
							<div className="absolute bottom-2 left-2 right-2 text-[10px] text-gray-500">
								{/* helps diagnose bad paths during dev */}
								{imgError ? `Image not found: ${imageSrc}` : null}
							</div>
						) : null}
					</div>
				)}
				<div className="absolute left-3 top-3">
					<span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${statusColor}`}>
						{status}
					</span>
				</div>
			</div>
			<div className="p-4">
				<div className="flex items-center justify-between gap-3">
					<h3 className="text-base font-semibold text-gray-900 line-clamp-1">{title}</h3>
					<span className="text-xs font-medium text-indigo-700 bg-indigo-50 ring-1 ring-inset ring-indigo-200 rounded px-1.5 py-0.5">{displayCode}</span>
				</div>
				<div className="mt-2 flex items-center justify-between">
					<p className="text-sm text-gray-600 line-clamp-1">By {instructorName || 'Unknown'}</p>
					{dateStr ? <p className="text-xs text-gray-500">{dateStr}</p> : null}
				</div>
			</div>
		</Link>
	)
}


