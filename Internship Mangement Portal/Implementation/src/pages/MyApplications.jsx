import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, RefreshCw, Clock, CheckCircle, XCircle } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { fetchMyApplications } from '../services/internshipService';
import { useRealtimePoll } from '../hooks/useRealtimePoll';
import { useRealtimeStream } from '../hooks/useRealtimeStream';
import { ROUTES } from '../constants';

const STATUS_CONFIG = {
  pending: { label: 'Pending', variant: 'warning', icon: Clock },
  accepted: { label: 'Accepted', variant: 'success', icon: CheckCircle },
  rejected: { label: 'Rejected', variant: 'danger', icon: XCircle },
};

function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function MyApplications() {
  const {
    data: applications,
    loading,
    error,
    lastUpdated,
    refresh,
  } = useRealtimePoll(fetchMyApplications, { interval: 5000 });

  useRealtimeStream(
    [
      'applications:updated',
      'portal-access:submitted',
      'portal-access:reviewed',
      'portal-access:updated',
    ],
    () => refresh(true),
  );

  const list = applications || [];
  const showInitialLoader = loading && !applications;

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Applications"
        subtitle="Track the status of your internship applications in real time."
        eyebrow="Internships"
        actions={(
          <>
            <Button variant="outline" icon={RefreshCw} onClick={() => refresh(false)} disabled={loading}>
              Refresh
            </Button>
            <Link to={ROUTES.STUDENT.PORTAL}>
              <Button variant="purple" icon={Briefcase}>Browse Internships</Button>
            </Link>
          </>
        )}
      />

      {lastUpdated && (
        <p className="text-xs text-gray-400 -mt-2">
          Live · updated {lastUpdated.toLocaleTimeString()}
        </p>
      )}

      {showInitialLoader ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : error ? (
        <Card className="text-center py-12">
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={() => refresh(false)}>Try again</Button>
        </Card>
      ) : list.length === 0 ? (
        <Card className="text-center py-16">
          <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h2>
          <p className="text-sm text-gray-500 mb-6 max-w-sm mx-auto">
            Submit an internship application from onboarding or browse tracks to apply.
          </p>
          <Link to={ROUTES.STUDENT.PORTAL}>
            <Button variant="purple">Browse Internships</Button>
          </Link>
        </Card>
      ) : (
        <div className="space-y-4">
          {list.map((app, i) => {
            const config = STATUS_CONFIG[app.status] || STATUS_CONFIG.pending;
            const StatusIcon = config.icon;
            const posting = app.posting;

            return (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="!p-0 overflow-hidden hover:shadow-premium-lg transition-all duration-300 border-slate-200/60" hover>
                  <div className="flex flex-col sm:flex-row">
                    {posting?.image && (
                      <div className="sm:w-48 h-36 sm:h-auto shrink-0">
                        <img
                          src={posting.image}
                          alt={posting.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {posting?.title || 'Internship'}
                        </h3>
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
                          {posting?.duration && <span>{posting.duration}</span>}
                          {posting?.level && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span>{posting.level}</span>
                            </>
                          )}
                        </div>
                        {posting?.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {posting.tags.map((tag) => (
                              <Badge key={tag} variant="primary" className="text-[10px]">{tag}</Badge>
                            ))}
                          </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2">
                          Applied on {formatDate(app.appliedAt)}
                        </p>
                      </div>
                      <Badge variant={config.variant} className="self-start flex items-center gap-1.5 px-3 py-1.5">
                        <StatusIcon className="w-3.5 h-3.5" />
                        {config.label}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
