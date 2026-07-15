import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import PageLoader from '../components/ui/PageLoader';
import { useAuthContext } from '../context/AuthContext';

const Home = lazy(() => import('../pages/Home'));
const ApiStatus = lazy(() => import('../pages/ApiStatus'));
const Login = lazy(() => import('../pages/Login'));
const Register = lazy(() => import('../pages/Register'));
const SSOCallback = lazy(() => import('../pages/SSOCallback'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Profile = lazy(() => import('../pages/Profile'));
const EditProfile = lazy(() => import('../pages/EditProfile'));
const Projects = lazy(() => import('../pages/Projects'));
const AddProject = lazy(() => import('../pages/AddProject'));
const EditProject = lazy(() => import('../pages/EditProject'));
const ProjectDetails = lazy(() => import('../pages/ProjectDetails'));
const NotFound = lazy(() => import('../pages/NotFound'));

const GuestOnly = ({ children }) => {
  const { isSignedIn } = useAuthContext();
  if (isSignedIn) return <Navigate to="/dashboard" replace />;
  return children;
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader message="Loading page..." />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="status" element={<ApiStatus />} />
          <Route
            path="login"
            element={
              <GuestOnly>
                <Login />
              </GuestOnly>
            }
          />
          <Route
            path="register"
            element={
              <GuestOnly>
                <Register />
              </GuestOnly>
            }
          />
          <Route path="sso-callback" element={<SSOCallback />} />
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />
          <Route
            path="projects/new"
            element={
              <ProtectedRoute>
                <AddProject />
              </ProtectedRoute>
            }
          />
          <Route
            path="projects/:id"
            element={
              <ProtectedRoute>
                <ProjectDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="projects/:id/edit"
            element={
              <ProtectedRoute>
                <EditProject />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
