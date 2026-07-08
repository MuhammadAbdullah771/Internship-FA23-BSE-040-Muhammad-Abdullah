import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock3, RefreshCw } from 'lucide-react';
import AuthLayout from '../components/auth/AuthLayout';
import Badge from '../components/ui/Badge';
import { fetchMyPortalAccess } from '../services/portalAccessService';
import { useRealtimePoll } from '../hooks/useRealtimePoll';
import { useRealtimeStream } from '../hooks/useRealtimeStream';
import { getStudentAccessPath, PORTAL_ACCESS_STATUS, ROUTES } from '../constants';

export default function StudentPendingApproval() {
  const navigate = useNavigate();

  const {
    data: application,
    lastUpdated,
    refresh,
  } = useRealtimePoll(fetchMyPortalAccess, { interval: 5000 });

  useRealtimeStream(
    ['portal-access:updated', 'portal-access:reviewed'],
    () => refresh(true),
  );

  const portal = application?.portalAccess || {};
  const internship = portal.internship;
  const displayName = portal.fullName || application?.displayName || application?.name || 'Student';

  useEffect(() => {
    if (application?.portalAccessStatus === PORTAL_ACCESS_STATUS.APPROVED) {
      navigate(getStudentAccessPath(application), { replace: true });
    }
    if (application?.portalAccessStatus === PORTAL_ACCESS_STATUS.REJECTED) {
      navigate(ROUTES.STUDENT.ONBOARDING, { replace: true });
    }
  }, [application, navigate]);

  return (
    <AuthLayout
      variant="student"
      title="Application Under Review"
      subtitle="Your submitted application is checked in real time. You will be redirected automatically when approved."
      backLink={ROUTES.LANDING}
      backLabel="Back to home"
      features={[
        'Live status checks every 5 seconds',
        'Application form data shown below',
        'Automatic redirect on approval',
      ]}
    >
      <div className="text-center py-4">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-50 flex items-center justify-center">
          <Clock3 className="w-8 h-8 text-amber-600" />
        </div>
        <p className="text-sm text-gray-600 mb-2">
          <strong>{displayName}</strong> — your application is pending.
        </p>

        {(internship || portal.internshipTitle) && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100 text-left">
            <div className="flex items-center justify-between gap-2 mb-2">
              <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Selected Internship (live)</p>
              <Badge variant="success">Live</Badge>
            </div>
            <p className="font-bold text-gray-900">{internship?.title || portal.internshipTitle}</p>
            <p className="text-sm text-gray-600 mt-1">
              {internship?.company || 'InternHub Partner'}
              {internship?.duration ? ` · ${internship.duration}` : ''}
              {internship?.level ? ` · ${internship.level}` : ''}
            </p>
          </div>
        )}

        <div className="mt-4 p-4 rounded-xl bg-white border border-gray-100 text-left text-sm space-y-2">
          <p><span className="text-gray-400">Institute:</span> <strong>{portal.institute || '—'}</strong></p>
          <p><span className="text-gray-400">CNIC:</span> <strong>{portal.cnic || '—'}</strong></p>
          <p><span className="text-gray-400">Contact:</span> <strong>{portal.contactNumber || '—'}</strong></p>
        </div>

        <button
          type="button"
          onClick={() => refresh(false)}
          className="inline-flex items-center gap-1.5 mt-6 text-xs text-emerald-600 hover:text-emerald-500"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Check status now
          {lastUpdated ? ` · ${lastUpdated.toLocaleTimeString()}` : ''}
        </button>

        <p className="text-xs text-gray-400 mt-6">
          You cannot access the internship portal until a superadmin approves your submitted application.
        </p>
      </div>
    </AuthLayout>
  );
}
