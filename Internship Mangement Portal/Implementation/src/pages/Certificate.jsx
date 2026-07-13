import PageHeader from '../components/common/PageHeader';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import CertificatePanel from '../components/student/CertificatePanel';
import { useAuth } from '../context/AuthContext';
import { fetchStudentDashboard } from '../services/studentService';
import { useRealtimePoll } from '../hooks/useRealtimePoll';
import { useRealtimeStream } from '../hooks/useRealtimeStream';

export default function Certificate() {
  const { user } = useAuth();

  const { data: dashboard, loading, refresh } = useRealtimePoll(fetchStudentDashboard, {
    interval: 10000,
  });

  useRealtimeStream(
    ['tasks:updated', 'portal-access:updated', 'portal-access:reviewed'],
    () => refresh(true),
  );

  if (loading && !dashboard) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="text-center py-20 space-y-4">
        <p className="text-gray-500">Could not load certificate status.</p>
        <Button onClick={() => refresh(false)}>Try again</Button>
      </div>
    );
  }

  const progress = dashboard?.stats?.progressPercent || 0;
  const trackTitle = dashboard?.trackTitle || 'Internship';
  const certStatus = dashboard?.certificateStatus || 'locked';

  const certificationData = {
    program: trackTitle,
    grade: progress >= 80 ? 'A' : progress >= 60 ? 'B' : 'In Progress',
    skills: dashboard?.intern?.track ? [dashboard.intern.track] : [trackTitle],
    completionDate: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
    certificateId: user?.id ? `IH-${user.id.slice(-8).toUpperCase()}` : 'IH-PENDING',
  };

  const internshipTrack = {
    title: trackTitle,
    cohort: dashboard?.cohort || 'Internship Program',
    mentor: 'Your Mentor',
    progress,
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader
        title="My Certificate"
        subtitle="View, verify, and download your internship completion certificate."
        eyebrow="Achievement"
      />

      <Card glass>
        <CertificatePanel
          studentName={user?.name || 'Student'}
          certification={certificationData}
          track={internshipTrack}
          status={certStatus}
          onRequestVerification={() => toast.success('Verification request sent to your mentor')}
          onDownload={() => toast.success('Certificate download will be available once verified')}
        />
      </Card>
    </div>
  );
}
