'use client'

import { ChildProps } from '@/types'
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'
import { Session } from 'next-auth'
import { FC } from 'react'

interface Props extends ChildProps {
	session?: Session | null
}

const SessionProvider: FC<Props> = ({ children, session }) => {
	return (
		<NextAuthSessionProvider session={session}>
			{children}
		</NextAuthSessionProvider>
	)
}

export default SessionProvider
