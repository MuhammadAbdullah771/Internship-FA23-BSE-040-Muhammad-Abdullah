import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, RefreshCw, Image as ImageIcon, FileText, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Avatar from '../components/ui/Avatar';
import Badge from '../components/ui/Badge';
import {
  fetchPendingPortalApplications,
  fetchActiveEnrollments,
  reviewPortalApplication,
  completeStudentEnrollment,
} from '../services/portalAccessService';
import { useRealtimePoll } from '../hooks/useRealtimePoll';
import { useRealtimeStream } from '../hooks/useRealtimeStream';

function Detail({ label, value }) {
  if (!value) return null;
  return (
    <p className="text-sm text-slate-300">
      <span className="text-slate-500">{label}:</span> {value}
    </p>
  );
}

export default function PortalApprovals() {
  const { data: applications = [], loading, lastUpdated, refresh } = useRealtimePoll(
    fetchPendingPortalApplications,
    { interval: 8000 },
  );

  const {
    data: activeEnrollments = [],
    loading: loadingEnrollments,
    refresh: refreshEnrollments,
  } = useRealtimePoll(fetchActiveEnrollments, { interval: 10000 });

  const loadAll = useCallback(() => {
    refresh(false);
    refreshEnrollments(false);
  }, [refresh, refreshEnrollments]);

  useRealtimeStream(
    ['portal-access:submitted', 'portal-access:reviewed', 'portal-access:updated'],
    () => loadAll(),
  );

  const handleReview = async (studentId, action) => {
    let rejectionReason;
    if (action === 'reject') {
      rejectionReason = window.prompt('Rejection reason (optional):') || '';
    }

    const result = await reviewPortalApplication(studentId, { action, rejectionReason });
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(action === 'approve' ? 'Portal access approved' : 'Application rejected');
    loadAll();
  };

  const handleCompleteEnrollment = async (studentId, studentName) => {
    const confirmed = window.confirm(
      `Mark "${studentName}" as completed? They will be able to apply for another internship.`,
    );
    if (!confirmed) return;

    const result = await completeStudentEnrollment(studentId);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success('Enrollment marked complete. Student can apply to another internship.');
    loadAll();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Portal Access Approvals</h1>
          <p className="text-sm text-slate-400 mt-1">
            Review student applications in real time
            {lastUpdated ? ` · updated ${lastUpdated.toLocaleTimeString()}` : ''}
          </p>
        </div>
        <Button variant="outline" onClick={loadAll} className="border-slate-700 text-slate-200">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : applications.length === 0 ? (
        <Card className="bg-slate-800/50 border-slate-700 p-10 text-center text-slate-400">
          No pending applications right now.
        </Card>
      ) : (
        <div className="grid gap-4">
          {applications.map((app, index) => (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
            >
              <Card className="bg-slate-800/60 border-slate-700 p-5">
                <div className="flex flex-col xl:flex-row gap-5 xl:items-start xl:justify-between">
                  <div className="flex gap-4 min-w-0">
                    <Avatar src={app.avatar} name={app.name} size="lg" />
                    <div className="min-w-0 space-y-1">
                      <h3 className="font-semibold text-white">
                        {app.portalAccess?.fullName || app.name}
                      </h3>
                      <p className="text-sm text-slate-400">{app.email}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge className="bg-emerald-500/15 text-emerald-400 border border-emerald-500/20">
                          {app.portalAccess?.internshipTitle || 'Internship'}
                        </Badge>
                        <Badge className="bg-amber-500/15 text-amber-300 border border-amber-500/20">
                          Pending
                        </Badge>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-x-6 gap-y-1 mt-3">
                        <Detail label="Father" value={app.portalAccess?.fatherName} />
                        <Detail label="Institute" value={app.portalAccess?.institute} />
                        <Detail label="CNIC" value={app.portalAccess?.cnic} />
                        <Detail label="Contact" value={app.portalAccess?.contactNumber} />
                      </div>
                      {app.portalAccess?.notes && (
                        <p className="text-sm text-slate-300 mt-2">{app.portalAccess.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                    {app.portalAccess?.cvPdf && (
                      <a
                        href={app.portalAccess.cvPdf}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-200 text-sm hover:bg-slate-700"
                      >
                        <FileText className="w-4 h-4" />
                        View CV
                      </a>
                    )}
                    {app.portalAccess?.paymentScreenshot && (
                      <a
                        href={app.portalAccess.paymentScreenshot}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-slate-600 text-slate-200 text-sm hover:bg-slate-700"
                      >
                        <ImageIcon className="w-4 h-4" />
                        View Payment
                      </a>
                    )}
                    <Button
                      className="!from-emerald-600 !to-teal-500"
                      onClick={() => handleReview(app.id, 'approve')}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="outline"
                      className="border-red-500/30 text-red-300 hover:bg-red-500/10"
                      onClick={() => handleReview(app.id, 'reject')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <section className="space-y-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-400" />
            Active Enrollments
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            One internship per student. Mark complete when finished so they can apply again.
          </p>
        </div>

        {loadingEnrollments ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : activeEnrollments.length === 0 ? (
          <Card className="bg-slate-800/50 border-slate-700 p-8 text-center text-slate-400">
            No active enrollments.
          </Card>
        ) : (
          <div className="grid gap-3">
            {activeEnrollments.map((student) => (
              <Card key={student.id} className="bg-slate-800/60 border-slate-700 p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={student.avatar} name={student.name} />
                    <div className="min-w-0">
                      <p className="font-medium text-white truncate">
                        {student.portalAccess?.fullName || student.name}
                      </p>
                      <p className="text-sm text-slate-400 truncate">{student.email}</p>
                      <Badge className="mt-1 bg-blue-500/15 text-blue-300 border border-blue-500/20">
                        {student.portalAccess?.internshipTitle || 'Internship'}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    className="!from-violet-600 !to-indigo-500 shrink-0"
                    onClick={() => handleCompleteEnrollment(
                      student.id,
                      student.portalAccess?.fullName || student.name,
                    )}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Mark Complete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
