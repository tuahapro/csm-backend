import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { CoursesAPI } from '../lib/api.js'

const empty = { title:'', description:'', price:'', duration:'', category:'', instructorName:'', courseImage:'' }

export default function CourseForm() {
	const navigate = useNavigate()
	const params = useParams()
	const isEdit = Boolean(params.id)
	const [form, setForm] = useState(empty)
	const [saving, setSaving] = useState(false)
	const [error, setError] = useState('')

	useEffect(() => {
		if (isEdit) {
			CoursesAPI.get(params.id).then((c)=>setForm({
				title: c.title || '',
				description: c.description || '',
				price: String(c.price ?? ''),
				duration: c.duration || '',
				category: c.category || '',
				instructorName: c.instructorName || '',
				courseImage: c.courseImage || ''
			})).catch((e)=>setError(e.message))
		}
	}, [isEdit, params.id])

	function update(field, value) {
		setForm((f)=>({ ...f, [field]: value }))
	}

	async function onSubmit(e) {
		e.preventDefault()
		setSaving(true)
		setError('')
		try {
			const payload = { ...form, price: Number(form.price) }
			if (isEdit) {
				await CoursesAPI.update(params.id, payload)
			} else {
				const created = await CoursesAPI.create(payload)
				navigate(`/courses/${created._id}`)
				return
			}
			navigate(`/courses/${params.id}`)
		} catch (e) {
			setError(e.message)
		} finally {
			setSaving(false)
		}
	}

	return (
		<div className="mx-auto max-w-2xl">
			<h1 className="text-2xl font-semibold">{isEdit ? 'Edit Course' : 'Create Course'}</h1>
			<form onSubmit={onSubmit} className="mt-6 grid grid-cols-1 gap-4">
				<Input label="Title" value={form.title} onChange={(v)=>update('title', v)} required />
				<Textarea label="Description" value={form.description} onChange={(v)=>update('description', v)} required />
				<Input label="Price (USD)" type="number" value={form.price} onChange={(v)=>update('price', v)} required />
				<Input label="Duration" value={form.duration} onChange={(v)=>update('duration', v)} required />
				<Input label="Category" value={form.category} onChange={(v)=>update('category', v)} required />
				<Input label="Instructor Name" value={form.instructorName} onChange={(v)=>update('instructorName', v)} required />
				<Input label="Course Image URL" value={form.courseImage} onChange={(v)=>update('courseImage', v)} />
				{error && <p className="text-sm text-red-600">{error}</p>}
				<div className="flex gap-3">
				   <button disabled={saving} className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:opacity-50">{saving ? 'Saving...' : (isEdit ? 'Save changes' : 'Create course')}</button>
				   <button type="button" onClick={()=>navigate(-1)} className="rounded border px-4 py-2">Cancel</button>
				</div>
			</form>
		</div>
	)
}

function Input({ label, value, onChange, type='text', required }) {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-700">{label}</label>
			<input value={value} onChange={(e)=>onChange(e.target.value)} type={type} className="mt-1 w-full rounded border px-3 py-2" required={required} />
		</div>
	)
}

function Textarea({ label, value, onChange, required }) {
	return (
		<div>
			<label className="block text-sm font-medium text-gray-700">{label}</label>
			<textarea value={value} onChange={(e)=>onChange(e.target.value)} className="mt-1 w-full rounded border px-3 py-2 h-28" required={required} />
		</div>
	)
}


