import { SignUp } from '@clerk/clerk-react';
import { Briefcase } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { clerkAppearance } from '../config/clerk';
import { ROUTES } from '../constants';

export default function StudentSignup() {
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
          forceRedirectUrl={ROUTES.STUDENT.ONBOARDING}
          fallbackRedirectUrl={ROUTES.STUDENT.ONBOARDING}
          appearance={clerkAppearance}
        />
      </div>
    </AuthLayout>
  );
}
