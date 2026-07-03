import { Award, Download, Share2, ShieldCheck, Lock, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { cn } from '../../utils';

export default function CertificatePanel({
  studentName,
  certification,
  track,
  status,
  onRequestVerification,
  onDownload,
}) {
  const isLocked = status === 'locked';
  const isPending = status === 'pending';
  const isVerified = status === 'verified';

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            Internship Certificate
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {isLocked && 'Complete all task tracks to unlock certification'}
            {isPending && 'Awaiting mentor verification of your internship completion'}
            {isVerified && 'Your certificate has been verified and is ready to download'}
          </p>
        </div>
        <Badge
          variant={isVerified ? 'success' : isPending ? 'warning' : 'default'}
          className="self-start flex items-center gap-1 px-3 py-1"
        >
          {isLocked && <><Lock className="w-3 h-3" /> Locked</>}
          {isPending && <><Clock className="w-3 h-3" /> Pending Verification</>}
          {isVerified && <><ShieldCheck className="w-3 h-3" /> Verified</>}
        </Badge>
      </div>

      {isLocked && (
        <div className="text-center py-12 px-6 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">Certificate Not Yet Available</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Finish all task tracks and pass the final review to request your internship certificate.
          </p>
        </div>
      )}

      {isPending && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-amber-50 border border-amber-100">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-gray-900">Verification In Progress</p>
                <p className="text-sm text-gray-600 mt-1">
                  Your mentor <span className="font-medium">{track.mentor}</span> is reviewing your
                  internship completion. You will be notified once verified.
                </p>
              </div>
            </div>
          </div>
          <Button variant="outline" onClick={onRequestVerification} className="w-full sm:w-auto">
            Resend Verification Request
          </Button>
        </div>
      )}

      {(isPending || isVerified) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'relative overflow-hidden rounded-2xl border-2 p-8 sm:p-10',
            isVerified ? 'border-emerald-200 bg-gradient-to-br from-white via-emerald-50/30 to-teal-50/40' : 'border-gray-200 bg-gray-50 opacity-75'
          )}
        >
          <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-100/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-100/30 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                <Award className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">
                Intern<span className="text-emerald-600">Hub</span>
              </span>
            </div>

            <p className="text-xs font-semibold text-emerald-600 uppercase tracking-[0.2em] mb-2">
              Certificate of Completion
            </p>
            <p className="text-sm text-gray-500 mb-4">This is to certify that</p>

            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 font-serif">
              {studentName}
            </h3>

            <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed mb-6">
              has successfully completed the{' '}
              <span className="font-semibold text-gray-900">{certification.program}</span>
              {' '}with a grade of{' '}
              <span className="font-bold text-emerald-600">{certification.grade}</span>
              , demonstrating proficiency in all required competencies.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {certification.skills.map((skill) => (
                <span key={skill} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-full">
                  {skill}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left border-t border-emerald-100 pt-6">
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Cohort</p>
                <p className="text-sm font-medium text-gray-900">{track.cohort}</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Completed</p>
                <p className="text-sm font-medium text-gray-900">{certification.completionDate}</p>
              </div>
              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">Certificate ID</p>
                <p className="text-sm font-mono font-medium text-gray-900">{certification.certificateId}</p>
              </div>
            </div>

            {isVerified && (
              <div className="mt-6 flex items-center justify-center gap-2 text-emerald-600">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-semibold">Verified by InternHub</span>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {isVerified && (
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="purple" icon={Download} onClick={onDownload} className="flex-1">
            Download Certificate (PDF)
          </Button>
          <Button variant="outline" icon={Share2} onClick={() => toast.success('Share link copied!')} className="flex-1">
            Share Certificate
          </Button>
        </div>
      )}

      {!isLocked && !isVerified && (
        <Button
          variant="purple"
          icon={CheckCircle}
          onClick={onRequestVerification}
          className="w-full sm:w-auto"
        >
          Request Completion Verification
        </Button>
      )}
    </div>
  );
}
