'use client'

import { deleteProduct } from '@/actions/admin.action'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import useAction from '@/hooks/use-action'
import { useProduct } from '@/hooks/use-product'
import { formatPrice } from '@/lib/utils'
import { IProduct } from '@/types'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { FC, ReactNode, useState, useRef, useEffect } from 'react'
import { toast } from 'sonner'

interface NoSSRProps {
	children: ReactNode
}

const NoSSR = dynamic<NoSSRProps>(
	() => Promise.resolve(({ children }: NoSSRProps) => <>{children}</>),
	{ ssr: false }
)

interface Props {
	product: IProduct
}

const ProductCard: FC<Props> = ({ product }) => {
	const { setOpen, setProduct } = useProduct()
	const { isLoading, onError, setIsLoading } = useAction()
	const [expanded, setExpanded] = useState(false)
	const [isOverflowing, setIsOverflowing] = useState(false)
	const descRef = useRef<HTMLDivElement | null>(null)

	const EXPANDED_HEIGHT = 220 // px → adjust this if needed

	const onEdit = () => {
		setOpen(true)
		setProduct(product)
	}

	async function onDelete() {
		setIsLoading(true)
		const res = await deleteProduct({ id: product._id })
		if (res?.serverError || res?.validationErrors || !res?.data) {
			return onError('Something went wrong')
		}
		if (res.data.failure) {
			return onError(res.data.failure)
		}
		if (res.data.status === 200) {
			toast.success('Product deleted successfully')
			setIsLoading(false)
		}
	}

	const description = product.description ?? ''

	// Detect if text actually overflows when collapsed
	useEffect(() => {
		const el = descRef.current
		if (!el) return
		setIsOverflowing(el.scrollHeight > el.clientHeight)
	}, [description])

	return (
		<div className='border relative flex justify-between flex-col rounded-2xl overflow-hidden'>
			<div className='bg-secondary relative'>
				<Image
					src={product.image ?? '/placeholder.png'}
					width={200}
					height={200}
					className='mx-auto'
					alt={product.title ?? 'Product image'}
				/>
				<Badge className='absolute top-0.5 left-0.5'>{product.category}</Badge>
			</div>

			<div className='p-3'>
				<div className='flex justify-between items-center text-sm'>
					<h1 className='font-bold'>{product.title}</h1>
					<NoSSR>
						<p className='font-medium'>{formatPrice(product.price!)}</p>
					</NoSSR>
				</div>

				{/* Description */}
				<div
					ref={descRef}
					className={`text-xs text-muted-foreground leading-relaxed transition-all duration-300 ${
						expanded
							? `max-h-[${EXPANDED_HEIGHT}px] overflow-y-auto overflow-x-hidden whitespace-pre-line break-words pr-1`
							: 'line-clamp-1 overflow-hidden'
					}`}
					style={expanded ? { maxHeight: EXPANDED_HEIGHT } : {}}
				>
					{description}
				</div>

				{/* Show more / less */}
				{isOverflowing && (
					<button
						onClick={() => setExpanded(v => !v)}
						className='text-xs text-blue-500 hover:underline mt-1'
					>
						{expanded ? 'Show less' : 'Show more'}
					</button>
				)}

				<Separator className='my-2' />
			</div>

			<div className='grid grid-cols-2 gap-2 px-2 pb-2'>
				<Button variant={'secondary'} onClick={onEdit}>
					Edit
				</Button>
				<AlertDialog>
					<AlertDialogTrigger asChild>
						<Button variant={'outline'}>Delete</Button>
					</AlertDialogTrigger>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
							<AlertDialogDescription>
								This action cannot be undone. This will permanently delete your
								account and remove your data from our servers.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel>Cancel</AlertDialogCancel>
							<AlertDialogAction onClick={onDelete} disabled={isLoading}>
								Continue
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</div>
		</div>
	)
}

export default ProductCard
