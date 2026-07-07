import { SignedIn, SignedOut, SignIn } from '@clerk/clerk-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import Button from '../ui/Button';
import { clerkAppearance } from '../../config/clerk';
import { useAuth } from '../../context/AuthContext';
import { getStudentAccessPath, ROUTES } from '../../constants';

export default function InternshipLoginPanel() {
  const navigate = useNavigate();
  const { isAuthenticated, isStudent, user, isClerkSignedIn, isLoading } = useAuth();

  if (isClerkSignedIn && !isAuthenticated) {
    return <Navigate to={ROUTES.STUDENT.AUTH_CALLBACK} replace />;
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-premium p-6 lg:p-8 h-fit sticky top-24">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center">
          <Briefcase className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="font-bold text-gray-900 text-lg">Internship Portal</h2>
          <p className="text-sm text-gray-500">Clerk-secured student access</p>
        </div>
      </div>

      <SignedIn>
        {isAuthenticated && isStudent ? (
          <>
            <p className="text-sm text-gray-600 mb-2">
              Welcome back, <strong>{user?.name}</strong>
            </p>
            <p className="text-sm text-gray-600 mb-6">
              Browse internships below and click <strong>Apply Now</strong> to submit your application.
            </p>
            <div className="space-y-3">
              <Button
                className="w-full !from-emerald-600 !to-teal-500"
                onClick={() => navigate(ROUTES.STUDENT.DASHBOARD)}
              >
                Go to Dashboard
              </Button>
              <Button variant="outline" className="w-full" onClick={() => navigate(ROUTES.STUDENT.TASKS)}>
                View My Tasks
              </Button>
            </div>
          </>
        ) : isLoading ? (
          <p className="text-sm text-gray-600">Connecting your account...</p>
        ) : (
          <p className="text-sm text-gray-600">You are signed in.</p>
        )}
      </SignedIn>

      <SignedOut>
        <p className="text-sm text-gray-600 mb-4">
          Sign in or create an account with Clerk to continue. New students complete internship and payment details after signup.
        </p>
        <SignIn
          routing="hash"
          signUpUrl={ROUTES.STUDENT.SIGNUP}
          forceRedirectUrl={ROUTES.STUDENT.AUTH_CALLBACK}
          fallbackRedirectUrl={ROUTES.STUDENT.AUTH_CALLBACK}
          appearance={clerkAppearance}
        />
      </SignedOut>
    </div>
  );
}
