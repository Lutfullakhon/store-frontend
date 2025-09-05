'use client'

import { Search } from 'lucide-react'
import { Input } from '../ui/input'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '../ui/select'
import { categories } from '@/lib/constants'
import { useRouter, useSearchParams } from 'next/navigation'
import { debounce } from 'lodash'
import { FC, useCallback } from 'react'

// Helpers
function formUrlQuery({
	key,
	value,
	params,
}: {
	key: string
	value: string
	params: string
}) {
	const sp = new URLSearchParams(params)
	sp.set(key, value)
	return `?${sp.toString()}`
}
function removeUrlQuery({ key, params }: { key: string; params: string }) {
	const sp = new URLSearchParams(params)
	sp.delete(key)
	return `?${sp.toString()}`
}

interface Props {
	showCategory?: boolean
}
const Filter: FC<Props> = ({ showCategory }) => {
	const searchParams = useSearchParams()
	const router = useRouter()

	const onFilterChange = (value: string) =>
		router.push(
			formUrlQuery({ key: 'filter', params: searchParams.toString(), value })
		)

	const onCategoryChange = (value: string) =>
		router.push(
			formUrlQuery({ key: 'category', params: searchParams.toString(), value })
		)

	const handleSearchDebounce = useCallback(
		debounce((e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value
			router.push(
				value
					? formUrlQuery({ key: 'q', params: searchParams.toString(), value })
					: removeUrlQuery({ key: 'q', params: searchParams.toString() })
			)
		}, 300),
		[searchParams, router]
	)

	return (
		<div className='w-full'>
			{/* On md+: shrink to content and center with mx-auto */}
			<div className='flex flex-col md:flex-row gap-2 w-full md:w-fit md:mx-auto'>
				{/* Search */}
				<div className='flex items-center bg-secondary border px-2 w-full md:w-80'>
					<Input
						placeholder='Qidirish'
						className='text-xs border-none no-focus flex-1'
						onChange={handleSearchDebounce}
					/>
					<Search className='ml-2 cursor-pointer text-muted-foreground' />
				</div>

				{/* Filter select */}
				<Select
					onValueChange={onFilterChange}
					value={searchParams.get('filter') || ''}
				>
					<SelectTrigger className='bg-secondary text-xs w-full md:w-40'>
						<SelectValue
							placeholder='Select filter'
							className='text-muted-foreground'
						/>
					</SelectTrigger>
					<SelectContent>
						<SelectItem value='newest'>Newest</SelectItem>
						<SelectItem value='oldest'>Oldest</SelectItem>
					</SelectContent>
				</Select>

				{/* Category select */}
				{showCategory && (
					<Select
						onValueChange={onCategoryChange}
						value={searchParams.get('category') || ''}
					>
						<SelectTrigger className='bg-secondary text-xs w-full md:w-40'>
							<SelectValue
								placeholder='Select category'
								className='text-muted-foreground'
							/>
						</SelectTrigger>
						<SelectContent>
							{categories.map(category => (
								<SelectItem value={category} key={category}>
									{category}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}
			</div>
		</div>
	)
}

export default Filter
