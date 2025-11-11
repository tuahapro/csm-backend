import { useEffect, useState } from 'react'

export default function ConnectionStatus() {
	const [ok, setOk] = useState(null)

	useEffect(() => {
		let mounted = true
		fetch('/api/health', { credentials: 'include' })
			.then((r) => (r.ok ? r.json() : null))
			.then((data) => {
				if (!mounted) return
				setOk(Boolean(data && data.status === 'ok'))
			})
			.catch(() => mounted && setOk(false))
		return () => {
			mounted = false
		}
	}, [])

	if (ok === null) return null
	return ok ? (
		<div className="bg-emerald-50 border-b border-emerald-200">
			<div className="mx-auto max-w-6xl px-4 py-1.5 text-emerald-800 text-sm">Connected to backend</div>
		</div>
	) : (
		<div className="bg-red-50 border-b border-red-200">
			<div className="mx-auto max-w-6xl px-4 py-1.5 text-red-700 text-sm">Cannot reach backend. Check server and CORS settings.</div>
		</div>
	)
}


