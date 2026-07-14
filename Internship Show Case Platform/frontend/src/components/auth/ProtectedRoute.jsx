import { Navigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import PageLoader from '../ui/PageLoader';
import ErrorMessage from '../ui/ErrorMessage';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { isLoaded, isSignedIn, isSyncing, appUser, authError, refreshAppUser } =
    useAuthContext();

  if (!isLoaded || (isSignedIn && isSyncing && !appUser)) {
    return <PageLoader message="Checking authentication..." />;
  }

  if (!isSignedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (authError && !appUser) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16">
        <ErrorMessage
          title="Session sync failed"
          message={authError}
          onRetry={refreshAppUser}
        />
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
