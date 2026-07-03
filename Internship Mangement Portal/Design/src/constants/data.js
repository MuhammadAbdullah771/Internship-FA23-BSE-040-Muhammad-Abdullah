export const interns = [
  {
    id: 1,
    name: 'Alex Mercer',
    email: 'alex.m@internhub.io',
    role: 'Software Engineering',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=alex',
    department: 'Engineering',
    intake: '2024',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    email: 'sarah.c@internhub.io',
    role: 'Product Design',
    status: 'Onboarding',
    avatar: 'https://i.pravatar.cc/150?u=sarah',
    department: 'Design',
    intake: '2024',
  },
  {
    id: 3,
    name: 'Marcus Johnson',
    email: 'marcus.j@internhub.io',
    role: 'Marketing',
    status: 'Completed',
    avatar: null,
    initials: 'MJ',
    department: 'Marketing',
    intake: '2023',
  },
  {
    id: 4,
    name: 'David Kim',
    email: 'david.k@internhub.io',
    role: 'Data Science',
    status: 'Active',
    avatar: 'https://i.pravatar.cc/150?u=david',
    department: 'Engineering',
    intake: '2024',
  },
];

export const tasks = {
  todo: [
    {
      id: 1,
      title: 'Market Research Q3',
      description: 'Analyze competitor landscape and prepare summary report for Q3.',
      priority: 'High',
      assignee: 'https://i.pravatar.cc/150?u=a1',
      date: 'Oct 15',
      attachments: 2,
      comments: 4,
    },
    {
      id: 2,
      title: 'Update Design System Docs',
      description: '',
      priority: 'Medium',
      assignee: 'https://i.pravatar.cc/150?u=a2',
      date: 'Oct 18',
      attachments: 1,
      comments: 0,
    },
  ],
  inProgress: [
    {
      id: 3,
      title: 'Client Presentation Slides',
      description: 'Create deck for upcoming client review meeting next week.',
      priority: 'High',
      assignees: ['https://i.pravatar.cc/150?u=a3', 'https://i.pravatar.cc/150?u=a4'],
      date: 'Tomorrow',
      dateUrgent: true,
      attachments: 0,
      comments: 12,
    },
  ],
  review: [
    {
      id: 4,
      title: 'Organize Shared Drive',
      description: '',
      priority: 'Low',
      assignee: 'https://i.pravatar.cc/150?u=a5',
      date: 'Oct 10',
      attachments: 0,
      comments: 0,
    },
  ],
};

export const internTasks = [
  { id: 1, title: 'Competitive Analysis Deck', team: 'Marketing Team', status: 'Due Today', checked: false },
  { id: 2, title: 'Update Q3 Data Models', team: 'Data Science', status: 'Tomorrow', checked: false },
  { id: 3, title: 'Draft Newsletter Copy', team: 'Communications', status: 'Oct 24', checked: false },
];

export const notifications = [
  {
    id: 1,
    type: 'deadline',
    title: 'Mid-term Evaluation Deadline Approaching',
    description: 'The mid-term evaluations for the engineering intern cohort are due in 48 hours. Please submit your reviews.',
    time: '10:42 AM',
    group: 'TODAY',
    unread: true,
  },
  {
    id: 2,
    type: 'task',
    title: 'Task Completed: Q3 Market Research',
    description: "Alex Chen marked the task 'Q3 Competitor Analysis' as complete.",
    time: '9:15 AM',
    group: 'TODAY',
    unread: false,
  },
  {
    id: 3,
    type: 'feedback',
    title: 'New Feedback Received',
    description: 'You received new anonymous feedback regarding the recent mentorship workshop.',
    time: 'Yesterday, 3:30 PM',
    group: 'YESTERDAY',
    unread: false,
    link: 'View Feedback',
  },
  {
    id: 4,
    type: 'system',
    title: 'System Maintenance Scheduled',
    description: 'InternHub will undergo scheduled maintenance on Saturday at 2:00 AM UTC. Expected downtime is 1 hour.',
    time: 'Yesterday, 11:00 AM',
    group: 'YESTERDAY',
    unread: false,
  },
];

export const feedbackSessions = [
  {
    id: 1,
    name: 'David Chen',
    role: 'Senior Engineer',
    avatar: 'https://i.pravatar.cc/150?u=davidchen',
    time: '2h ago',
    rating: 4.5,
    preview: 'Excellent progress on the frontend migration. Needs a bit more focus on...',
    tags: ['FRONTEND', 'MID-TERM'],
    selected: true,
    title: 'Mid-Term Evaluation',
    date: 'Oct 15, 2023',
    team: 'Frontend Intern Team',
    acknowledged: true,
    metrics: [
      { label: 'Technical Skills', score: 4.5, status: 'Exceeds Expectations', color: 'bg-primary-500' },
      { label: 'Communication', score: 4.0, status: 'Meets Expectations', color: 'bg-primary-500' },
      { label: 'Initiative', score: 5.0, status: 'Outstanding', color: 'bg-amber-700' },
    ],
    comments: {
      overall: 'Alex has shown remarkable growth during the first half of the internship. The frontend migration project was delivered ahead of schedule with clean, well-documented code. Code review feedback has been consistently addressed.',
      collaboration: 'Alex participates actively in daily standups and has been a great collaborator during pair programming sessions. Communication with the design team has improved significantly.',
    },
  },
  {
    id: 2,
    name: 'Sarah Jenkins',
    role: 'Design Lead',
    avatar: 'https://i.pravatar.cc/150?u=sarahj',
    time: 'Yesterday',
    rating: 3.0,
    preview: 'Good design sense but needs to improve handoff documentation...',
    tags: ['DESIGN', 'WEEKLY'],
    selected: false,
  },
  {
    id: 3,
    name: 'Marcus Reed',
    role: 'Engineering Manager',
    avatar: null,
    initials: 'MR',
    time: 'Oct 12',
    rating: 5.0,
    preview: 'Outstanding performance across all metrics. Ready for increased...',
    tags: ['ENGINEERING', 'QUARTERLY'],
    selected: false,
  },
];

export const adminStats = [
  { label: 'Total Interns', value: '128', change: '+ 12%', icon: 'Users', color: 'bg-primary-50 text-primary-600' },
  { label: 'Active Interns', value: '94', subtext: 'currently assigned', icon: 'UserCheck', color: 'bg-primary-50 text-primary-600' },
  { label: 'Completed Tasks', value: '412', change: '+ 8%', icon: 'CheckCircle', color: 'bg-emerald-50 text-emerald-600' },
  { label: 'Pending Tasks', value: '45', subtext: 'needs review', icon: 'Briefcase', color: 'bg-orange-50 text-orange-600' },
];

export const recentActivities = [
  { id: 1, text: 'Sarah J. submitted', highlight: 'Project Alpha', time: '2 hours ago', dept: 'Engineering Dept', icon: 'FileText', color: 'bg-blue-50 text-blue-600' },
  { id: 2, text: 'New intern', highlight: 'Emily R.', time: '4 hours ago', dept: 'Design Dept', icon: 'UserPlus', color: 'bg-emerald-50 text-emerald-600' },
  { id: 3, text: 'Deadline set for', highlight: 'Q4 Review', time: '6 hours ago', dept: 'HR Dept', icon: 'Calendar', color: 'bg-orange-50 text-orange-600' },
];

export const adminNotifications = [
  { id: 1, type: 'warning', title: 'Missing Timecards', description: "5 interns haven't submitted hours for this week.", color: 'bg-red-50 border-red-100' },
  { id: 2, type: 'info', title: 'System Maintenance', description: 'Scheduled downtime this Saturday at 2 AM EST.', color: 'bg-blue-50 border-blue-100' },
  { id: 3, type: 'default', title: 'Feedback Reminder', description: 'Mid-term feedback due in 3 days.', color: 'bg-gray-50 border-gray-100' },
];

export const milestones = [
  { id: 1, title: 'Onboarding Phase', status: 'COMPLETED', description: 'Environment setup, tool access, and initial policy review.', date: 'Oct 1 - Oct 5', completed: true },
  { id: 2, title: 'Core Systems Integration', status: 'ACTIVE', description: 'First PR submissions and code review shadowing.', progress: 65, active: true },
  { id: 3, title: 'Independent Project', status: 'UPCOMING', description: 'End-to-end feature delivery under mentor supervision.', date: 'Starts Nov 15', upcoming: true },
];

export const skills = ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Figma', 'Git'];

export const timeline = [
  { id: 1, title: 'Mid-Term Review', subtext: 'Scheduled for next week', current: true },
  { id: 2, title: 'First Project Delivery', subtext: 'Dashboard UI Components', date: 'Oct 2023' },
  { id: 3, title: 'Onboarding Completed', subtext: '', date: 'Sep 2023' },
];

export const submissionHistory = [
  { id: 1, title: 'Draft Saved', time: 'Today, 10:45 AM', detail: 'You saved a draft of your submission.', active: true },
  { id: 2, title: 'Task Assigned', time: 'Yesterday', detail: 'Assigned by Sarah Manager. Deadline set for Friday.', active: false },
];
