import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import CertificatePanel from '../components/student/CertificatePanel';
import { useAuth } from '../context/AuthContext';
import { fetchStudentDashboard } from '../services/studentService';

export default function Certificate() {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudentDashboard()
      .then(setDashboard)
      .catch(() => toast.error('Failed to load certificate status'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
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
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">My Certificate</h1>
        <p className="text-gray-500 mt-1">View, verify, and download your internship completion certificate.</p>
      </motion.div>

      <Card>
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
