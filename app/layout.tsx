import './globals.css'

import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import Navbar from '@/components/shared/navbar'
import { Toaster } from '@/components/ui/sonner'
import React from 'react'
import SessionProvider from '@/components/providers/session.provider'
import { CheckCircle, XCircle } from 'lucide-react'
import NextTopLoader from 'nextjs-toploader'

const montserrat = Montserrat({
	weight: ['400', '500', '600', '700', '800', '900'],
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Store e-commerce',
	description: 'Store e-commerce website built with Next.js',
	icons: { icon: '/favicon.png' },
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<SessionProvider>
			<html lang='en'>
				<body className={`${montserrat.className} antialiased`}>
					<Navbar />
					<main className='container max-w-6xl mx-auto mt-24 px-4'>
						{children}
					</main>
					<Toaster
						richColors
						position='top-right'
						icons={{
							success: <CheckCircle />,
							error: <XCircle />,
							info: <span>ℹ️</span>, // you can even use emoji
						}}
					/>
					<NextTopLoader showSpinner={false} />
				</body>
			</html>
		</SessionProvider>
	)
}

export default RootLayout
