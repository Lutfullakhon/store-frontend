'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'

export function useFilteredData<
	T extends { _id: string; title?: string; category?: string }
>(items: T[]) {
	const searchParams = useSearchParams()
	const router = useRouter()

	// ✅ Clear filters on refresh
	useEffect(() => {
		if (typeof window !== 'undefined') {
			router.replace(window.location.pathname)
		}
	}, [router])

	const query = searchParams.get('q')?.toLowerCase() || ''
	const category = searchParams.get('category')?.toLowerCase() || ''
	const filter = searchParams.get('filter') || ''
	

	let filteredItems = items.filter(p => {
		const title = p.title?.toLowerCase() || ''
		const cat = p.category?.toLowerCase() || ''

		// Search
		const matchesQuery = query
			? title.includes(query) || cat.includes(query)
			: true

		// Category (✅ "All" means ignore)
		const matchesCategory =
			category && category !== 'all' ? cat === category : true

		return matchesQuery && matchesCategory
	})

	// Sorting
	if (filter === 'newest') {
		filteredItems = [...filteredItems].sort(
			(a, b) => Number(b._id) - Number(a._id)
		)
	} else if (filter === 'oldest') {
		filteredItems = [...filteredItems].sort(
			(a, b) => Number(a._id) - Number(b._id)
		)
	}

	return filteredItems
}
