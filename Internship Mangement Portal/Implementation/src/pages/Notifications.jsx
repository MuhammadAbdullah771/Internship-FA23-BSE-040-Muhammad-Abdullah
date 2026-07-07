import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { Clock, CheckSquare, MessageCircle, Info, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';
import Card from '../components/ui/Card';
import { useAuth } from '../context/AuthContext';
import { useAppPaths } from '../hooks/useAppPaths';
import { fetchStudentDashboard } from '../services/studentService';
import { fetchMyApplications } from '../services/internshipService';
import { ROUTES } from '../constants';

const iconMap = {
  deadline: { icon: Clock, color: 'bg-red-50 text-red-500' },
  task: { icon: CheckSquare, color: 'bg-primary-50 text-primary-600' },
  feedback: { icon: MessageCircle, color: 'bg-amber-50 text-amber-600' },
  system: { icon: Info, color: 'bg-blue-50 text-blue-500' },
  application: { icon: Briefcase, color: 'bg-emerald-50 text-emerald-600' },
};

function buildNotifications(dashboard, applications, paths) {
  const items = [];
  const now = new Date();

  (dashboard?.upcomingDeadlines || []).forEach((task) => {
    const due = new Date(task.dueDate);
    const diffDays = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    if (diffDays <= 3) {
      items.push({
        id: `deadline-${task.id}`,
        group: diffDays <= 0 ? 'Today' : 'This Week',
        type: 'deadline',
        title: diffDays <= 0 ? 'Task Overdue' : 'Upcoming Deadline',
        description: `"${task.title}" is ${diffDays <= 0 ? 'overdue' : `due in ${diffDays} day(s)`}`,
        time: due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        link: { text: 'View Task', to: paths.taskDetail(task.id) },
        unread: diffDays <= 1,
      });
    }
  });

  (dashboard?.recentTasks || [])
    .filter((t) => t.status === 'review')
    .forEach((task) => {
      items.push({
        id: `review-${task.id}`,
        group: 'This Week',
        type: 'feedback',
        title: 'Task Under Review',
        description: `"${task.title}" has been submitted and is awaiting mentor review.`,
        time: 'Recently',
        link: { text: 'View Task', to: paths.taskDetail(task.id) },
        unread: true,
      });
    });

  (applications || []).forEach((app) => {
    items.push({
      id: `app-${app.id}`,
      group: 'Applications',
      type: 'application',
      title: `Application: ${app.posting?.title || 'Internship'}`,
      description: `Status: ${app.status.charAt(0).toUpperCase() + app.status.slice(1)}`,
      time: new Date(app.appliedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      link: { text: 'View Applications', to: ROUTES.STUDENT.APPLICATIONS },
      unread: app.status === 'pending',
    });
  });

  if (dashboard?.certificateStatus === 'pending') {
    items.push({
      id: 'cert-pending',
      group: 'This Week',
      type: 'system',
      title: 'Certificate Pending Verification',
      description: 'All tasks are complete. Your certificate is awaiting mentor verification.',
      time: 'Now',
      link: { text: 'View Certificate', to: paths.CERTIFICATE },
      unread: true,
    });
  }

  if (items.length === 0) {
    items.push({
      id: 'empty',
      group: 'General',
      type: 'system',
      title: 'You\'re all caught up!',
      description: 'No new notifications. Check back after completing tasks or applying to internships.',
      time: '',
      unread: false,
    });
  }

  return items;
}

export default function Notifications() {
  const { isStudent } = useAuth();
  const paths = useAppPaths();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isStudent) {
      setLoading(false);
      return;
    }

    Promise.all([
      fetchStudentDashboard().catch(() => null),
      fetchMyApplications().catch(() => []),
    ]).then(([dashboard, applications]) => {
      setNotifications(buildNotifications(dashboard, applications, paths));
    }).catch(() => toast.error('Failed to load notifications'))
      .finally(() => setLoading(false));
  }, [isStudent, paths]);

  const groups = [...new Set(notifications.map((n) => n.group))];

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader
        title="Notifications"
        subtitle="Alerts about tasks, deadlines, and applications."
        eyebrow="Inbox"
      />

      {groups.map((group) => (
        <div key={group}>
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{group}</h2>
          <div className="space-y-3">
            {notifications
              .filter((n) => n.group === group)
              .map((notif) => {
                const { icon: Icon, color } = iconMap[notif.type] || iconMap.system;
                return (
                  <Card
                    key={notif.id}
                    className={`!p-4 ${notif.unread ? 'bg-primary-50/50 border-primary-100' : ''}`}
                  >
                    <div className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-semibold text-gray-900">{notif.title}</h3>
                          {notif.time && <span className="text-xs text-gray-400 shrink-0">{notif.time}</span>}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{notif.description}</p>
                        {notif.link && (
                          <Link to={notif.link.to} className="text-sm font-medium text-primary-600 hover:text-primary-500 mt-2 inline-block">
                            {notif.link.text}
                          </Link>
                        )}
                      </div>
                    </div>
                  </Card>
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
}
