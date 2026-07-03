export const adminStats = [
  { label: 'Total Interns', value: '128', change: '+12% vs last month', icon: 'Users', color: 'bg-slate-100 text-slate-700' },
  { label: 'Active Interns', value: '94', subtext: 'currently assigned', icon: 'UserCheck', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Completed Tasks', value: '412', change: '+8% this week', icon: 'CheckCircle', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Pending Reviews', value: '45', subtext: 'needs attention', icon: 'Briefcase', color: 'bg-amber-50 text-amber-600' },
];

export const adminSecurityMetrics = [
  { label: 'Certificate Requests', value: 12, urgent: true },
  { label: 'Pending Verifications', value: 8, urgent: true },
  { label: 'Active Sessions', value: 24, urgent: false },
  { label: 'Failed Logins (24h)', value: 3, urgent: false },
];

export const verificationQueue = [
  {
    id: 1,
    name: 'Alex Mercer',
    track: 'Frontend Development',
    progress: 100,
    requestedAt: '2 hours ago',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    status: 'pending',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    track: 'UI/UX Design',
    progress: 100,
    requestedAt: '5 hours ago',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    status: 'pending',
  },
  {
    id: 3,
    name: 'David Kim',
    track: 'Data Science',
    progress: 98,
    requestedAt: 'Yesterday',
    avatar: 'https://i.pravatar.cc/150?u=david',
    status: 'review',
  },
];

export const cohortOverview = [
  { name: 'Engineering', interns: 45, completion: 82, color: 'bg-emerald-500' },
  { name: 'Design', interns: 28, completion: 76, color: 'bg-teal-500' },
  { name: 'Marketing', interns: 22, completion: 68, color: 'bg-cyan-500' },
  { name: 'Data Science', interns: 18, completion: 88, color: 'bg-slate-600' },
];

export const recentActivities = [
  { id: 1, text: 'Sarah J. submitted', highlight: 'Project Alpha', time: '2 hours ago', dept: 'Engineering Dept', icon: 'FileText', color: 'bg-blue-50 text-blue-600' },
  { id: 2, text: 'New intern', highlight: 'Emily R.', time: '4 hours ago', dept: 'Design Dept', icon: 'UserPlus', color: 'bg-emerald-50 text-emerald-600' },
  { id: 3, text: 'Certificate verified for', highlight: 'Marcus J.', time: '6 hours ago', dept: 'HR Dept', icon: 'Award', color: 'bg-slate-100 text-slate-700' },
  { id: 4, text: 'Deadline set for', highlight: 'Q4 Review', time: '8 hours ago', dept: 'Operations', icon: 'Calendar', color: 'bg-orange-50 text-orange-600' },
];

export const adminNotifications = [
  { id: 1, type: 'warning', title: 'Certificate Verifications', description: '12 students awaiting completion approval.', color: 'bg-amber-50 border-amber-100', urgent: true },
  { id: 2, type: 'warning', title: 'Missing Timecards', description: "5 interns haven't submitted hours for this week.", color: 'bg-red-50 border-red-100', urgent: true },
  { id: 3, type: 'info', title: 'System Maintenance', description: 'Scheduled downtime this Saturday at 2 AM EST.', color: 'bg-blue-50 border-blue-100', urgent: false },
];
