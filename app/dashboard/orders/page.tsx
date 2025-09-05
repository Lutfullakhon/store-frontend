import { getOrders } from '@/actions/user.action'
import Filter from '@/components/shared/filter'
import Pagination from '@/components/shared/pagination'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table'
import { formatPrice } from '@/lib/utils'
import { SearchParams } from '@/types'
import { format } from 'date-fns'
import { FC } from 'react'

interface Props {
	searchParams: SearchParams
}
const Page: FC<Props> = async props => {
	const searchParams = await props.searchParams
	const res = await getOrders({
		searchQuery: `${searchParams.q || ''}`,
		filter: `${searchParams.filter || ''}`,
		page: `${searchParams.page || '1'}`,
	})

	const orders = res?.data?.orders
	const isNext = res?.data?.isNext || false

	return (
		<>
			<div className='flex flex-col md:flex-row md:justify-between md:items-center gap-3 md:gap-6'>
				<h1 className='text-xl font-bold'>Orders</h1>
				<Filter />
			</div>

			<Separator className='my-3' />

			<Table className='text-sm'>
				<TableCaption>
					{orders && orders.length > 0
						? 'A list of your recent orders.'
						: 'No orders found.'}
				</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Product</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Price</TableHead>
						<TableHead>Order time</TableHead>
						<TableHead className='text-right'>Updated time</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{orders &&
						orders.map(order => (
							<TableRow key={order._id}>
								<TableCell>{order.product.title}</TableCell>
								<TableCell>
									<Badge>{order.status}</Badge>
								</TableCell>
								<TableCell>{formatPrice(order.price)}</TableCell>
								<TableCell>
									{format(new Date(order.createdAt), 'dd-MM yyyy')}
								</TableCell>
								<TableCell className='text-right'>
									{format(new Date(order.updatedAt), 'dd-MMM hh:mm a')}
								</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>
			<Pagination
				isNext={isNext}
				pageNumber={searchParams?.page ? +searchParams.page : 1}
			/>
		</>
	)
}

export default Page
