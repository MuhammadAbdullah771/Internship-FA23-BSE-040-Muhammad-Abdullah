import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getHomePath, ROUTES } from '../../constants';

export function ProtectedRoute({ allowedRoles, loginPath = ROUTES.STUDENT_LOGIN }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return <Outlet />;
}

export function PublicRoute({ redirectIfAuth = true }) {
  const { isAuthenticated, user } = useAuth();

  if (redirectIfAuth && isAuthenticated) {
    return <Navigate to={getHomePath(user.role)} replace />;
  }

  return <Outlet />;
}
