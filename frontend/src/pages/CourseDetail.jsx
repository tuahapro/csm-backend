import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CoursesAPI } from '../lib/api.js'

export default function CourseDetail() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [course, setCourse] = useState(null)
	const [error, setError] = useState('')

	useEffect(() => {
		CoursesAPI.get(id).then(setCourse).catch((e)=>setError(e.message))
	}, [id])

	async function onDelete() {
		if (!confirm('Delete this course?')) return
		await CoursesAPI.remove(id)
		navigate('/courses')
	}

	if (error) return <p className="text-red-600">{error}</p>
	if (!course) return <p className="text-gray-600">Loading...</p>

	return (
		<div className="mx-auto max-w-3xl">
			<div className="aspect-video rounded bg-gray-100 overflow-hidden">
				{course.courseImage ? <img src={course.courseImage} alt="" className="w-full h-full object-cover" /> : null}
			</div>
			<h1 className="mt-4 text-3xl font-bold">{course.title}</h1>
			<p className="mt-2 text-gray-700 whitespace-pre-line">{course.description}</p>
			<p className="mt-2 text-gray-700">{course.category} • {course.duration} • ${course.price}</p>
			<p className="mt-1 text-gray-600">Instructor: {course.instructorName}</p>
			<div className="mt-6 flex gap-3">
				<Link to={`/courses/${id}/edit`} className="rounded bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500">Edit</Link>
				<button onClick={onDelete} className="rounded border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50">Delete</button>
			</div>
		</div>
	)
}


