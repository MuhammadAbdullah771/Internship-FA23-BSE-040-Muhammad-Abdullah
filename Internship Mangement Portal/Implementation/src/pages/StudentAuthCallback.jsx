import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getStudentAccessPath, ROUTES } from '../constants';
import Button from '../components/ui/Button';

export default function StudentAuthCallback() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, syncStatus, syncError, retrySync, logout, isClerkSignedIn } = useAuth();

  useEffect(() => {
    if (isLoading || syncStatus === 'syncing') return;

    if (isAuthenticated && user) {
      navigate(getStudentAccessPath(user), { replace: true });
      return;
    }

    if (!isClerkSignedIn || syncStatus === 'pending') {
      navigate(ROUTES.STUDENT.LOGIN, { replace: true });
    }
  }, [isAuthenticated, isClerkSignedIn, isLoading, navigate, syncStatus, user]);

  if (syncStatus === 'error' && !isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="max-w-md w-full rounded-2xl border border-gray-100 bg-white p-8 shadow-sm text-center">
          <h1 className="text-lg font-semibold text-gray-900 mb-2">Could not connect your account</h1>
          <p className="text-sm text-gray-500 mb-2">
            Your Clerk sign-in succeeded, but we could not sync your portal profile.
            {syncError ? ` (${syncError})` : ''}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Make sure the API is running with <code className="text-xs bg-gray-100 px-1 rounded">npm run dev</code>,
            then click Try again. If it still fails, confirm Clerk keys in <code className="text-xs bg-gray-100 px-1 rounded">.env</code> match the same application.
          </p>
          <div className="flex flex-col gap-3">
            <Button onClick={retrySync}>Try again</Button>
            <Button variant="outline" onClick={logout}>Sign out</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Setting up your internship portal...</p>
      </div>
    </div>
  );
}
