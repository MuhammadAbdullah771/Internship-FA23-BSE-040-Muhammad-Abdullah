import { SignIn } from '@clerk/clerk-react';
import { Shield } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { clerkAppearance } from '../config/clerk';
import { ROUTES } from '../constants';

export default function SuperadminLogin() {
  return (
    <AuthLayout
      variant="superadmin"
      title="Superadmin Portal"
      subtitle="Authorized personnel only. Sign in to access the administration dashboard."
      backLink={ROUTES.STUDENT.PORTAL}
      backLabel="Back to Internship Portal"
      features={[
        'Manage intern cohorts & assignments',
        'Analytics, reports & performance tracking',
        'Role-based secure access control',
      ]}
    >
      <div className="flex items-center gap-3 p-3 mb-6 rounded-xl bg-slate-50 border border-slate-200">
        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
          <Shield className="w-5 h-5 text-emerald-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900">Restricted Access</p>
          <p className="text-xs text-gray-500">Secured by Clerk</p>
        </div>
      </div>

      <div className="flex justify-center">
        <SignIn
          routing="path"
          path={ROUTES.SUPERADMIN.LOGIN}
          forceRedirectUrl={ROUTES.SUPERADMIN.DASHBOARD}
          fallbackRedirectUrl={ROUTES.SUPERADMIN.DASHBOARD}
          appearance={clerkAppearance}
        />
      </div>

      <p className="text-center text-xs text-gray-400 mt-6 leading-relaxed">
        This is a secure area. All login attempts are monitored.
        <br />
        Unauthorized access is prohibited.
      </p>
    </AuthLayout>
  );
}
