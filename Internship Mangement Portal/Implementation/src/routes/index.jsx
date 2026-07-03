import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES, ROUTES } from '../constants';
import DashboardLayout from '../layouts/DashboardLayout';
import LandingLayout from '../layouts/LandingLayout';
import { ProtectedRoute, PublicRoute } from '../components/common/ProtectedRoute';

import Landing from '../pages/Landing';
import StudentLogin from '../pages/StudentLogin';
import StudentSignup from '../pages/StudentSignup';
import SuperadminLogin from '../pages/SuperadminLogin';
import ForgotPassword from '../pages/ForgotPassword';
import AdminDashboard from '../pages/AdminDashboard';
import InternDashboard from '../pages/InternDashboard';
import InternManagement from '../pages/InternManagement';
import TaskManagement from '../pages/TaskManagement';
import TaskDetails from '../pages/TaskDetails';
import TaskSubmission from '../pages/TaskSubmission';
import ProgressTracking from '../pages/ProgressTracking';
import Feedback from '../pages/Feedback';
import Reports from '../pages/Reports';
import Notifications from '../pages/Notifications';
import UserProfile from '../pages/UserProfile';
import Certificate from '../pages/Certificate';
import Settings from '../pages/Settings';

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route path={ROUTES.LANDING} element={<Landing />} />
      </Route>

      <Route element={<PublicRoute />}>
        <Route path={ROUTES.STUDENT_LOGIN} element={<StudentLogin />} />
        <Route path={ROUTES.STUDENT_SIGNUP} element={<StudentSignup />} />
        <Route path={ROUTES.SUPERADMIN_LOGIN} element={<SuperadminLogin />} />
        <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]} loginPath={ROUTES.SUPERADMIN_LOGIN} />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.SUPERADMIN.DASHBOARD} element={<AdminDashboard />} />
          <Route path={ROUTES.SUPERADMIN.INTERNS} element={<InternManagement />} />
          <Route path={ROUTES.SUPERADMIN.TASKS} element={<TaskManagement />} />
          <Route path={ROUTES.SUPERADMIN.TASK_SUBMIT} element={<TaskSubmission />} />
          <Route path={`${ROUTES.SUPERADMIN.TASKS}/:id`} element={<TaskDetails />} />
          <Route path={ROUTES.SUPERADMIN.PROGRESS} element={<ProgressTracking />} />
          <Route path={ROUTES.SUPERADMIN.REPORTS} element={<Reports />} />
          <Route path={ROUTES.SUPERADMIN.FEEDBACK} element={<Feedback />} />
          <Route path={ROUTES.SUPERADMIN.NOTIFICATIONS} element={<Notifications />} />
          <Route path={ROUTES.SUPERADMIN.PROFILE} element={<UserProfile />} />
          <Route path={ROUTES.SUPERADMIN.SETTINGS} element={<Settings />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={[ROLES.STUDENT]} loginPath={ROUTES.STUDENT_LOGIN} />}>
        <Route element={<DashboardLayout />}>
          <Route path={ROUTES.STUDENT.DASHBOARD} element={<InternDashboard />} />
          <Route path={ROUTES.STUDENT.TASKS} element={<TaskManagement />} />
          <Route path={ROUTES.STUDENT.TASK_SUBMIT} element={<TaskSubmission />} />
          <Route path={`${ROUTES.STUDENT.TASKS}/:id`} element={<TaskDetails />} />
          <Route path={ROUTES.STUDENT.PROGRESS} element={<ProgressTracking />} />
          <Route path={ROUTES.STUDENT.CERTIFICATE} element={<Certificate />} />
          <Route path={ROUTES.STUDENT.REPORTS} element={<Reports />} />
          <Route path={ROUTES.STUDENT.FEEDBACK} element={<Feedback />} />
          <Route path={ROUTES.STUDENT.NOTIFICATIONS} element={<Notifications />} />
          <Route path={ROUTES.STUDENT.PROFILE} element={<UserProfile />} />
          <Route path={ROUTES.STUDENT.SETTINGS} element={<Settings />} />
        </Route>
      </Route>

      <Route path="/login" element={<Navigate to={ROUTES.STUDENT_LOGIN} replace />} />
      <Route path="/admin" element={<Navigate to={ROUTES.SUPERADMIN.DASHBOARD} replace />} />
      <Route path="/dashboard" element={<Navigate to={ROUTES.STUDENT.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.LANDING} replace />} />
    </Routes>
  );
}
