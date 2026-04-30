import { Navigate, Outlet } from 'react-router-dom'
import { useAdmin } from '../hooks/useAdmin'

const AdminRoute = () => {
  const { isAdmin, loading } = useAdmin()

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default AdminRoute
