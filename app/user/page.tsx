import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import ReliefDashboard from '@/components/relief-dashboard'
import { auth } from '@/lib/auth'

export default async function UserPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  return <ReliefDashboard role="user" userName={session.user.name} />
}
