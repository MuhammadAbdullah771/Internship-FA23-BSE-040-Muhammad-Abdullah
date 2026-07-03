export const studentStats = [
  { label: 'Tasks Completed', value: '18/24', change: '+3 this week', icon: 'CheckCircle' },
  { label: 'Track Progress', value: '75%', change: 'On schedule', icon: 'TrendingUp' },
  { label: 'Hours Logged', value: '142h', change: '38h remaining', icon: 'Clock' },
  { label: 'Mentor Rating', value: '4.8', change: 'Exceeds expectations', icon: 'Star' },
];

export const internshipTrack = {
  id: 1,
  title: 'Frontend Development',
  cohort: 'Engineering Cohort 2024',
  mentor: 'Sarah Jenkins',
  mentorAvatar: 'https://i.pravatar.cc/150?u=sarahj',
  startDate: 'Sep 1, 2024',
  endDate: 'Nov 30, 2024',
  progress: 75,
};

export const taskTracks = [
  {
    id: 1,
    phase: 'Onboarding',
    status: 'completed',
    progress: 100,
    tasks: 4,
    completedTasks: 4,
    description: 'Platform orientation, tools setup, and policy review',
    duration: 'Week 1',
  },
  {
    id: 2,
    phase: 'Foundation Modules',
    status: 'completed',
    progress: 100,
    tasks: 6,
    completedTasks: 6,
    description: 'HTML, CSS, React fundamentals & component patterns',
    duration: 'Week 2-4',
  },
  {
    id: 3,
    phase: 'Core Project',
    status: 'active',
    progress: 65,
    tasks: 8,
    completedTasks: 5,
    description: 'Build responsive dashboard with API integration',
    duration: 'Week 5-8',
  },
  {
    id: 4,
    phase: 'Final Review',
    status: 'locked',
    progress: 0,
    tasks: 3,
    completedTasks: 0,
    description: 'Presentation, code review, and mentor evaluation',
    duration: 'Week 9-10',
  },
  {
    id: 5,
    phase: 'Certification',
    status: 'locked',
    progress: 0,
    tasks: 1,
    completedTasks: 0,
    description: 'Verification & certificate issuance upon completion',
    duration: 'Final',
  },
];

export const trackTasks = [
  { id: 1, title: 'Setup Development Environment', track: 'Onboarding', status: 'completed', due: 'Sep 5' },
  { id: 2, title: 'Complete React Fundamentals', track: 'Foundation Modules', status: 'completed', due: 'Sep 20' },
  { id: 3, title: 'Build Dashboard Layout', track: 'Core Project', status: 'completed', due: 'Oct 10' },
  { id: 4, title: 'Implement API Integration', track: 'Core Project', status: 'in_progress', due: 'Oct 18' },
  { id: 5, title: 'Write Unit Tests', track: 'Core Project', status: 'pending', due: 'Oct 22' },
  { id: 6, title: 'Responsive Design Polish', track: 'Core Project', status: 'pending', due: 'Oct 25' },
];

export const certificationData = {
  certificateId: 'IH-CERT-2024-FED-00842',
  program: 'Frontend Development Virtual Internship',
  issuedBy: 'InternHub Premium Management',
  verificationUrl: 'https://internhub.io/verify/IH-CERT-2024-FED-00842',
  skills: ['React', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Git'],
  grade: 'A',
  completionDate: 'Nov 30, 2024',
};

export const internTasks = [
  { id: 1, title: 'Competitive Analysis Deck', team: 'Marketing Team', status: 'Due Today', checked: false },
  { id: 2, title: 'Update Q3 Data Models', team: 'Data Science', status: 'Tomorrow', checked: false },
  { id: 3, title: 'Draft Newsletter Copy', team: 'Communications', status: 'Oct 24', checked: false },
];
