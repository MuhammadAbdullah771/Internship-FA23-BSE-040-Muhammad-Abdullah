export const ROLES = {
  SUPERADMIN: 'superadmin',
  STUDENT: 'student',
};

const STUDENT_BASE = '/portal/student';
const ADMIN_BASE = '/portal/superadmin';

export const ROUTES = {
  LANDING: '/',

  // Student internship portal (separate path)
  STUDENT: {
    PORTAL: STUDENT_BASE,
    LOGIN: `${STUDENT_BASE}/login`,
    SIGNUP: `${STUDENT_BASE}/signup`,
    FORGOT_PASSWORD: `${STUDENT_BASE}/forgot-password`,
    DASHBOARD: `${STUDENT_BASE}/dashboard`,
    TASKS: `${STUDENT_BASE}/tasks`,
    taskDetail: (id) => `${STUDENT_BASE}/tasks/${id}`,
    TASK_SUBMIT: `${STUDENT_BASE}/tasks/submit`,
    PROGRESS: `${STUDENT_BASE}/progress`,
    REPORTS: `${STUDENT_BASE}/reports`,
    FEEDBACK: `${STUDENT_BASE}/reports/feedback`,
    NOTIFICATIONS: `${STUDENT_BASE}/notifications`,
    PROFILE: `${STUDENT_BASE}/profile`,
    SETTINGS: `${STUDENT_BASE}/settings`,
    CERTIFICATE: `${STUDENT_BASE}/certificate`,
  },

  // Superadmin control portal (separate path)
  SUPERADMIN: {
    LOGIN: `${ADMIN_BASE}/login`,
    DASHBOARD: ADMIN_BASE,
    INTERNS: `${ADMIN_BASE}/interns`,
    TASKS: `${ADMIN_BASE}/tasks`,
    taskDetail: (id) => `${ADMIN_BASE}/tasks/${id}`,
    TASK_SUBMIT: `${ADMIN_BASE}/tasks/submit`,
    PROGRESS: `${ADMIN_BASE}/progress`,
    REPORTS: `${ADMIN_BASE}/reports`,
    FEEDBACK: `${ADMIN_BASE}/reports/feedback`,
    NOTIFICATIONS: `${ADMIN_BASE}/notifications`,
    PROFILE: `${ADMIN_BASE}/profile`,
    SETTINGS: `${ADMIN_BASE}/settings`,
  },

  // Aliases (backward compatibility)
  INTERNSHIP_PORTAL: `${STUDENT_BASE}`,
  STUDENT_LOGIN: `${STUDENT_BASE}/login`,
  STUDENT_SIGNUP: `${STUDENT_BASE}/signup`,
  SUPERADMIN_LOGIN: `${ADMIN_BASE}/login`,
  LOGIN: `${STUDENT_BASE}/login`,
  FORGOT_PASSWORD: `${STUDENT_BASE}/forgot-password`,
};

export const SUPERADMIN_NAV = [
  { label: 'Dashboard', path: ROUTES.SUPERADMIN.DASHBOARD, icon: 'LayoutDashboard' },
  { label: 'Interns', path: ROUTES.SUPERADMIN.INTERNS, icon: 'Users' },
  { label: 'Tasks', path: ROUTES.SUPERADMIN.TASKS, icon: 'ClipboardList' },
  { label: 'Reports', path: ROUTES.SUPERADMIN.REPORTS, icon: 'BarChart3' },
  { label: 'Settings', path: ROUTES.SUPERADMIN.SETTINGS, icon: 'Settings' },
];

export const STUDENT_NAV = [
  { label: 'Internships', path: ROUTES.STUDENT.PORTAL, icon: 'Briefcase' },
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
    : ROUTES.STUDENT.PORTAL;
}

export function getLoginPath(role) {
  return role === ROLES.SUPERADMIN
    ? ROUTES.SUPERADMIN.LOGIN
    : ROUTES.STUDENT.LOGIN;
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
