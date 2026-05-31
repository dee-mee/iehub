import { Navigate, useLocation } from 'react-router-dom'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import { useAuth } from '@/context/AuthContext'
import { canAccessMemberArea } from '@/lib/memberNav'

export function RequireMember({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <LoadingSpinner label="Loading your account..." />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (!user?.is_verified) {
    return <Navigate to="/verify-email" replace />
  }

  if (!canAccessMemberArea(user)) {
    return <Navigate to="/pending-approval" replace />
  }

  return <>{children}</>
}
