import { Navigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { isPlatformAdmin } from '@/lib/memberNav'

export function RequireRole({
  roles,
  children,
}: {
  roles: string[]
  children: React.ReactNode
}) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (isPlatformAdmin(user) || roles.includes(user.role)) {
    return <>{children}</>
  }
  return <Navigate to="/dashboard" replace />
}
