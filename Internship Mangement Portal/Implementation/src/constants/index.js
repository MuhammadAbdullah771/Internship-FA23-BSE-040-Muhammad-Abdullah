export const ROLES = {
  SUPERADMIN: 'superadmin',
  STUDENT: 'student',
};

export const ROUTES = {
  LANDING: '/',
  STUDENT_LOGIN: '/login',
  STUDENT_SIGNUP: '/signup',
  SUPERADMIN_LOGIN: '/portal/superadmin/login',
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  SUPERADMIN: {
    DASHBOARD: '/portal/superadmin',
    INTERNS: '/portal/superadmin/interns',
    TASKS: '/portal/superadmin/tasks',
    taskDetail: (id) => `/portal/superadmin/tasks/${id}`,
    TASK_SUBMIT: '/portal/superadmin/tasks/submit',
    PROGRESS: '/portal/superadmin/progress',
    REPORTS: '/portal/superadmin/reports',
    FEEDBACK: '/portal/superadmin/reports/feedback',
    NOTIFICATIONS: '/portal/superadmin/notifications',
    PROFILE: '/portal/superadmin/profile',
    SETTINGS: '/portal/superadmin/settings',
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    TASKS: '/student/tasks',
    taskDetail: (id) => `/student/tasks/${id}`,
    TASK_SUBMIT: '/student/tasks/submit',
    PROGRESS: '/student/progress',
    REPORTS: '/student/reports',
    FEEDBACK: '/student/reports/feedback',
    NOTIFICATIONS: '/student/notifications',
    PROFILE: '/student/profile',
    SETTINGS: '/student/settings',
    CERTIFICATE: '/student/certificate',
  },
};

export const SUPERADMIN_NAV = [
  { label: 'Dashboard', path: ROUTES.SUPERADMIN.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Interns', path: ROUTES.SUPERADMIN.INTERNS, icon: 'Users' },
  { label: 'Tasks', path: ROUTES.SUPERADMIN.TASKS, icon: 'ClipboardList' },
  { label: 'Reports', path: ROUTES.SUPERADMIN.REPORTS, icon: 'BarChart3' },
  { label: 'Settings', path: ROUTES.SUPERADMIN.SETTINGS, icon: 'Settings' },
];

export const STUDENT_NAV = [
  { label: 'Internships', path: ROUTES.LANDING, icon: 'Briefcase' },
  { label: 'Dashboard', path: ROUTES.STUDENT.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Tasks', path: ROUTES.STUDENT.TASKS, icon: 'ClipboardList' },
  { label: 'Progress', path: ROUTES.STUDENT.PROGRESS, icon: 'TrendingUp' },
  { label: 'Certificate', path: ROUTES.STUDENT.CERTIFICATE, icon: 'Award' },
  { label: 'Reports', path: ROUTES.STUDENT.REPORTS, icon: 'BarChart3' },
  { label: 'Settings', path: ROUTES.STUDENT.SETTINGS, icon: 'Settings' },
];

export const DEMO_USERS = {
  'superadmin@internhub.io': {
    password: 'superadmin123',
    role: ROLES.SUPERADMIN,
    name: 'Super Admin',
    avatar: 'https://i.pravatar.cc/150?u=superadmin',
  },
  'alex.mercer@example.com': {
    password: 'student123',
    role: ROLES.STUDENT,
    name: 'Alex Mercer',
    avatar: 'https://i.pravatar.cc/150?u=alex',
  },
};

export function getHomePath(role) {
  return role === ROLES.SUPERADMIN
    ? ROUTES.SUPERADMIN.DASHBOARD
    : ROUTES.LANDING;
}

export function getLoginPath(role) {
  return role === ROLES.SUPERADMIN
    ? ROUTES.SUPERADMIN_LOGIN
    : ROUTES.STUDENT_LOGIN;
}

export const STATUS_COLORS = {
  Active: 'bg-emerald-50 text-emerald-700',
  Onboarding: 'bg-orange-50 text-orange-700',
  Completed: 'bg-gray-100 text-gray-600',
  'Due Today': 'bg-red-50 text-red-600',
  Tomorrow: 'bg-blue-50 text-blue-600',
  'In Progress': 'bg-primary-50 text-primary-700',
};

export const PRIORITY_COLORS = {
  High: 'bg-red-50 text-red-600',
  Medium: 'bg-primary-50 text-primary-700',
  Low: 'bg-gray-100 text-gray-600',
};
