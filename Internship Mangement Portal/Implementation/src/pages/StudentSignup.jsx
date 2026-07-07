import { SignUp } from '@clerk/clerk-react';
import { Navigate } from 'react-router-dom';
import { Briefcase } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { clerkAppearance } from '../config/clerk';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants';
import { AuthLoadingScreen } from '../components/common/ProtectedRoute';

export default function StudentSignup() {
  const { isClerkSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return <AuthLoadingScreen message="Loading sign up..." />;
  }

  if (isClerkSignedIn) {
    return <Navigate to={ROUTES.STUDENT.AUTH_CALLBACK} replace />;
  }

  return (
    <AuthLayout
      variant="student"
      title="Create Account"
      subtitle="Join InternHub with Google or email to discover internships and launch your career."
      features={[
        'Free access to virtual internships',
        'Track progress & submit assignments',
        'Connect with mentors & peers',
      ]}
    >
      <div className="flex items-center gap-3 p-3 mb-6 rounded-xl bg-emerald-50 border border-emerald-100">
        <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center shrink-0">
          <Briefcase className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Student Sign Up</p>
          <p className="text-xs text-gray-500">Secured by Clerk</p>
        </div>
      </div>

      <div className="flex justify-center">
        <SignUp
          routing="path"
          path={ROUTES.STUDENT.SIGNUP}
          signInUrl={ROUTES.STUDENT.LOGIN}
          forceRedirectUrl={ROUTES.STUDENT.AUTH_CALLBACK}
          fallbackRedirectUrl={ROUTES.STUDENT.AUTH_CALLBACK}
          appearance={clerkAppearance}
        />
      </div>
    </AuthLayout>
  );
}
