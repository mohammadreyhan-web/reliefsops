import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import ReliefDashboard from '@/components/relief-dashboard'
import { auth } from '@/lib/auth'
import { getUserRole } from '@/lib/user-role'

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect('/sign-in')
  const role = await getUserRole(session.user.id)
  if (role !== 'admin') redirect('/user')
  return <ReliefDashboard role="admin" userName={session.user.name} />
}
