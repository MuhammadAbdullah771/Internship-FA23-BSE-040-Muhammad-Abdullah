import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getHomePath, ROUTES } from '../../constants';

function AuthLoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading session...</p>
      </div>
    </div>
  );
}

export function ProtectedRoute({ allowedRoles, loginPath = ROUTES.STUDENT.LOGIN }) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthLoadingScreen />;

  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return <Outlet />;
}

export function PublicRoute({ redirectIfAuth = true }) {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) return <AuthLoadingScreen />;

  if (redirectIfAuth && isAuthenticated) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return <Outlet />;
}
