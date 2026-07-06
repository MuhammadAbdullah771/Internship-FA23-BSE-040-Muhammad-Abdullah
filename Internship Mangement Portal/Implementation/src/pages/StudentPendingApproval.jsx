import { Clock3 } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../constants';

export default function StudentPendingApproval() {
  const { user } = useAuth();

  return (
    <AuthLayout
      variant="student"
      title="Application Under Review"
      subtitle="Your internship application and payment proof have been submitted. A superadmin will review and approve your portal access."
      backLink={ROUTES.LANDING}
      backLabel="Back to home"
      features={[
        'Typical review time: 1–2 business days',
        'You will get full portal access once approved',
        'Check back after approval to browse internships',
      ]}
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
          <Clock3 className="w-8 h-8 text-amber-600" />
        </div>
        <p className="text-sm text-gray-600 mb-2">
          <strong>{user?.name}</strong> — your application is pending.
        </p>
        {user?.portalAccess?.internshipTitle && (
          <p className="text-sm text-gray-500">
            Internship: <strong>{user.portalAccess.internshipTitle}</strong>
          </p>
        )}
        {user?.portalAccess?.institute && (
          <p className="text-sm text-gray-500 mt-1">
            Institute: <strong>{user.portalAccess.institute}</strong>
          </p>
        )}
        <p className="text-xs text-gray-400 mt-6">
          You cannot access the internship portal or dashboard until a superadmin approves your account.
        </p>
      </div>
    </AuthLayout>
  );
}
