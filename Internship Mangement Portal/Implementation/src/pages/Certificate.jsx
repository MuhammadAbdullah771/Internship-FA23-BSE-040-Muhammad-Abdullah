import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import CertificatePanel from '../components/student/CertificatePanel';
import { certificationData, internshipTrack } from '../constants/studentData';
import { useAuth } from '../context/AuthContext';

export default function Certificate() {
  const { user } = useAuth();
  const [certStatus, setCertStatus] = useState('pending');

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
          status={certStatus === 'verified' ? 'verified' : 'pending'}
          onRequestVerification={() => toast.success('Verification request sent')}
          onDownload={() => toast.success('Certificate download started')}
        />
        {certStatus !== 'verified' && (
          <p className="text-xs text-gray-400 mt-4 text-center">
            Demo:{' '}
            <button
              onClick={() => { setCertStatus('verified'); toast.success('Certificate verified!'); }}
              className="text-emerald-600 font-medium hover:underline"
            >
              Simulate verification approval
            </button>
          </p>
        )}
      </Card>
    </div>
  );
}
