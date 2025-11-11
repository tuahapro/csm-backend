export default function CourseCardSkeleton() {
	return (
		<div className="animate-pulse rounded-xl border border-gray-200 bg-white overflow-hidden">
			<div className="aspect-[16/9] bg-gray-100" />
			<div className="p-4 space-y-3">
				<div className="h-4 bg-gray-200 rounded w-2/3" />
				<div className="h-3 bg-gray-200 rounded w-1/2" />
				<div className="flex items-center justify-between">
					<div className="h-3 bg-gray-200 rounded w-1/3" />
					<div className="h-3 bg-gray-200 rounded w-16" />
				</div>
			</div>
		</div>
	)
}


