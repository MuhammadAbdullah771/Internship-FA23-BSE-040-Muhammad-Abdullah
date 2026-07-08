import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, RefreshCw, ExternalLink, Users } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';
import SearchBar from '../components/common/SearchBar';
import Filter from '../components/common/Filter';
import Pagination from '../components/common/Pagination';
import { fetchAdminStudents } from '../services/adminService';
import { useRealtimePoll } from '../hooks/useRealtimePoll';
import { useRealtimeStream } from '../hooks/useRealtimeStream';
import { ROUTES } from '../constants';

const portalVariant = {
  unsubmitted: 'default',
  pending: 'warning',
  approved: 'success',
  rejected: 'danger',
};

const enrollmentVariant = {
  none: 'default',
  active: 'success',
  completed: 'info',
};

function formatDate(date) {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function InternManagement() {
  const [search, setSearch] = useState('');
  const [portalStatus, setPortalStatus] = useState('');
  const [enrollmentStatus, setEnrollmentStatus] = useState('');
  const [page, setPage] = useState(1);
  const [filterOptions, setFilterOptions] = useState({
    portalStatuses: ['unsubmitted', 'pending', 'approved', 'rejected'],
    enrollmentStatuses: ['none', 'active', 'completed'],
  });

  const loadStudents = useCallback(async () => fetchAdminStudents({
    page,
    limit: 10,
    search: search || undefined,
    portalStatus: portalStatus || undefined,
    enrollmentStatus: enrollmentStatus || undefined,
  }), [page, search, portalStatus, enrollmentStatus]);

  const { data, loading, lastUpdated, refresh } = useRealtimePoll(loadStudents, { interval: 8000 });

  useRealtimeStream(
    ['students:updated', 'portal-access:submitted', 'portal-access:reviewed', 'portal-access:updated'],
    () => refresh(true),
  );

  useEffect(() => {
    if (data?.filters) setFilterOptions(data.filters);
  }, [data?.filters]);

  useEffect(() => {
    setPage(1);
  }, [search, portalStatus, enrollmentStatus]);

  const students = data?.students || [];
  const pagination = data?.pagination || { total: 0, pages: 1, limit: 10 };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-5 h-5 text-emerald-400" />
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Clerk Students</h1>
          </div>
          <p className="text-slate-400 text-sm">
            Real-time roster of students synced from Clerk authentication only.
            {lastUpdated ? ` · Updated ${lastUpdated.toLocaleTimeString()}` : ''}
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Button variant="outline" icon={RefreshCw} onClick={() => refresh(false)} disabled={loading} className="border-slate-600 text-slate-200">
            Refresh
          </Button>
          <Link to={ROUTES.SUPERADMIN.APPROVALS}>
            <Button className="!from-emerald-600 !to-teal-500" icon={Users}>Approvals</Button>
          </Link>
        </div>
      </motion.div>

      <Card className="bg-slate-800/50 border-slate-700/60 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <SearchBar
            placeholder="Search by name, email, or institute..."
            className="flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            dark
          />
          <div className="flex gap-3 flex-wrap">
            <Filter
              label="Portal Status"
              options={filterOptions.portalStatuses}
              value={portalStatus}
              onChange={(e) => setPortalStatus(e.target.value)}
              className="w-40"
              dark
            />
            <Filter
              label="Enrollment"
              options={filterOptions.enrollmentStatuses}
              value={enrollmentStatus}
              onChange={(e) => setEnrollmentStatus(e.target.value)}
              className="w-36"
              dark
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[240px]">
          {loading && !data ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : students.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No Clerk students found</p>
              <p className="text-sm text-slate-500 mt-1 max-w-md mx-auto">
                Students appear here after they sign in with Clerk on the student portal. Seeded or manual accounts are not shown.
              </p>
            </div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/80">
                  {['Student', 'Email', 'Internship', 'Portal', 'Enrollment', 'Joined'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wider py-3 px-4">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.map((student) => {
                  const portal = student.portalAccess || {};
                  return (
                    <tr key={student.id} className="border-b border-slate-800/80 hover:bg-slate-900/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <Avatar src={student.avatar} name={student.displayName || student.name} size="sm" />
                          <div className="min-w-0">
                            <span className="font-medium text-white block truncate">{student.displayName || student.name}</span>
                            <span className="text-xs text-slate-500 truncate block">{portal.institute || '—'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-slate-400 text-sm max-w-[180px] truncate">{student.email}</td>
                      <td className="py-4 px-4 text-slate-300 text-sm max-w-[160px] truncate">
                        {portal.internship?.title || portal.internshipTitle || '—'}
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={portalVariant[student.portalAccessStatus] || 'default'}>
                          {student.portalAccessStatus || 'unsubmitted'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={enrollmentVariant[portal.enrollmentStatus] || 'default'}>
                          {portal.enrollmentStatus || 'none'}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-slate-500 text-sm whitespace-nowrap">
                        {formatDate(student.joinedAt || student.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <Pagination
          current={page}
          total={pagination.total}
          perPage={pagination.limit}
          onPageChange={setPage}
          dark
        />
      </Card>

      <Card className="bg-emerald-500/5 border-emerald-500/20 p-4 flex gap-3 items-start">
        <ExternalLink className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-semibold text-emerald-300">Clerk-only data source</p>
          <p className="text-slate-400 mt-1">
            This list excludes seeded demo users and manually added intern records. Only accounts with a linked Clerk ID are displayed and updated in real time.
          </p>
        </div>
      </Card>
    </div>
  );
}
