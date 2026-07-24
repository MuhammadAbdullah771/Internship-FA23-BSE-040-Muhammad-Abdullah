import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import WorkspaceLayout from '../components/layout/WorkspaceLayout';
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
const PortfolioEditor = lazy(() => import('../pages/PortfolioEditor'));
const PublicPortfolio = lazy(() => import('../pages/PublicPortfolio'));
const ExploreProjects = lazy(() => import('../pages/ExploreProjects'));
const ExploreProjectDetails = lazy(
  () => import('../pages/ExploreProjectDetails')
);
const DiscoverInterns = lazy(() => import('../pages/DiscoverInterns'));
const Settings = lazy(() => import('../pages/Settings'));
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
          <Route path="explore" element={<ExploreProjects />} />
          <Route
            path="explore/projects/:id"
            element={<ExploreProjectDetails />}
          />
          <Route path="interns" element={<DiscoverInterns />} />
          <Route path="portfolio/:username" element={<PublicPortfolio />} />

          <Route
            element={
              <ProtectedRoute>
                <WorkspaceLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<Profile />} />
            <Route path="profile/edit" element={<EditProfile />} />
            <Route path="projects" element={<Projects />} />
            <Route path="projects/new" element={<AddProject />} />
            <Route path="projects/:id" element={<ProjectDetails />} />
            <Route path="projects/:id/edit" element={<EditProject />} />
            <Route path="portfolio" element={<PortfolioEditor />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
