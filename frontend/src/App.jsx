import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { CoursesAPI } from './lib/api.js'
import AuthLogin from './pages/AuthLogin.jsx'
import AuthRegister from './pages/AuthRegister.jsx'
import Profile from './pages/Profile.jsx'
import CourseForm from './pages/CourseForm.jsx'
import CourseDetail from './pages/CourseDetail.jsx'
import CourseCard from './components/CourseCard.jsx'
import CourseCardSkeleton from './components/CourseCardSkeleton.jsx'
import ConnectionStatus from './components/ConnectionStatus.jsx'

function Layout({ children }) {
	const { user, logout, loading } = useAuth()
	const navigate = useNavigate()
	return (
		<div className="min-h-screen flex flex-col">
			<header className="border-b bg-white">
				<div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
					<Link to="/" className="text-2xl font-bold text-indigo-400 pt-2 border-b-4 border-dotted border-indigo-400 rounded-md">Course CMS</Link>
					<nav className="flex items-center gap-4">
						<NavLink to="/courses" className={({isActive})=>`text-md ${isActive?'text-indigo-600 font-semibold':'text-gray-700 hover:text-gray-900'}`}>Courses</NavLink>
						{user ? (
							<>
								<NavLink to="/courses/new" className="text-md text-gray-700 hover:text-gray-900">New Course</NavLink>
								<NavLink to="/profile" className="text-md text-gray-700 hover:text-gray-900">Profile</NavLink>
								<button onClick={()=>{logout().then(()=>navigate('/login'))}} className="text-sm text-red-600 hover:text-red-700">Logout</button>
							</>
						) : !loading && (
							<>
								<NavLink to="/login" className="text-md text-gray-700 hover:text-gray-900">Login</NavLink>
								<NavLink to="/register" className="text-md text-gray-700 hover:text-gray-900">Register</NavLink>
							</>
						)}
					</nav>
				</div>
			</header>
			<ConnectionStatus />
			<main className="flex-1">
				<div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
			</main>
		</div>
	)
}

function Home() {
	const [featured, setFeatured] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')

	// Static showcase cards – update image file names to match your /public/images assets
	const demoCourses = [
		{
		  _id: 'd-1',
		  title: 'Data Mining',
		  instructorName: 'Your Instructor',
		  courseImage: 'datamining.jpg',
		  enrolled: true,
		  code: 'DM100',
		},
		{
		  _id: 'd-2',
		  title: 'Cloud Computing',
		  instructorName: 'Your Instructor',
		  courseImage: 'cloud.jpg',
		  enrolled: false,
		  code: 'CL110',
		},
		{
		  _id: 'd-3',
		  title: 'Agriculture Technology',
		  instructorName: 'Your Instructor',
		  courseImage: 'agriculture.jpg',
		  enrolled: false,
		  code: 'AG120',
		},
	]

	// 3 courses moved from Explore to Featured section
	const featuredStaticCourses = [
		{
		  _id: 'd-4',
		  title: 'Full‑Stack Web Development',
		  instructorName: 'Your Instructor',
		  courseImage: 'webDev.jpg',
		  enrolled: true,
		  code: 'WD210',
		},
		{
		  _id: 'd-5',
		  title: 'Business Strategy',
		  instructorName: 'Your Instructor',
		  courseImage: 'business.jpg',
		  enrolled: false,
		  code: 'BS310',
		},
		{
		  _id: 'd-6',
		  title: 'Artificial Intelligence',
		  instructorName: 'Your Instructor',
		  courseImage: 'artificial.jpg',
		  enrolled: false,
		  code: 'AI401',
		},
	]

	useEffect(() => {
		CoursesAPI.list()
			.then((items)=>setFeatured([...featuredStaticCourses, ...items.slice(0, 3)]))
			.catch((e)=>setError(e.message))
			.finally(()=>setLoading(false))
	}, [])

	return (
		<div>
			<h1 className="text-3xl font-bold tracking-tight text-gray-900">Course Management</h1>
			<p className="mt-3 text-gray-700">Create, update, and manage courses.</p>
			<div className="mt-6">
				<Link to="/courses" className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">Browse Courses</Link>
			</div>
			{/* Static showcase just under the create/browse section */}
			<div className="mt-8">
				<h2 className="text-xl font-semibold">Explore Courses</h2>
				<p className="mt-1 text-gray-600">A quick look at what you can build and learn.</p>
				<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{demoCourses.map((c)=>(
						<CourseCard key={c._id} course={c} />
					))}
				</div>
			</div>
			<div className="mt-10">
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Featured Courses</h2>
					<Link to="/courses" className="text-sm text-indigo-600 hover:text-indigo-500">View all</Link>
				</div>
				{loading && <p className="mt-4 text-gray-600">Loading...</p>}
				{error && <p className="mt-4 text-red-600">{error}</p>}
				{!loading && featured.length === 0 ? (
					<div className="mt-8 rounded-xl border border-dashed p-8 text-center">
						<h3 className="text-lg font-semibold text-gray-900">No courses yet</h3>
						<p className="mt-2 text-gray-600">Create your first course to see it featured here.</p>
						<div className="mt-4">
							<Link to="/courses/new" className="inline-flex items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500">
								Create a course
							</Link>
						</div>
					</div>
				) : (
					<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
						{loading
							? Array.from({ length: 6 }).map((_, i) => <CourseCardSkeleton key={i} />)
							: featured.map((c)=> <CourseCard key={c._id} course={c} />)}
					</div>
				)}
			</div>
		</div>
	)
}

function CoursesList() {
	const [courses, setCourses] = useState([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState('')
	useEffect(() => {
		CoursesAPI.list()
			.then(setCourses)
			.catch((e) => setError(e.message))
			.finally(() => setLoading(false))
	}, [])
	return (
		<div>
			<h2 className="text-2xl font-semibold">All Courses</h2>
			{loading && <p className="mt-4 text-gray-600">Loading...</p>}
			{error && <p className="mt-4 text-red-600">{error}</p>}
			<div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
				{courses.map((c)=>(
					<CourseCard key={c._id} course={c} />
				))}
			</div>
		</div>
	)
}

function App() {
	return (
		<Layout>
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/courses" element={<CoursesList />} />
				<Route path="/courses/new" element={<CourseForm />} />
				<Route path="/courses/:id" element={<CourseDetail />} />
				<Route path="/courses/:id/edit" element={<CourseForm />} />
				<Route path="/login" element={<AuthLogin />} />
				<Route path="/register" element={<AuthRegister />} />
				<Route path="/profile" element={<Profile />} />
			</Routes>
		</Layout>
	)
}

export default App


