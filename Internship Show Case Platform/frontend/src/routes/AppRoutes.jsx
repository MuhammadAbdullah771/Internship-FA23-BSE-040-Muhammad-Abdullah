import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import PageLoader from '../components/ui/PageLoader';

const Home = lazy(() => import('../pages/Home'));
const ApiStatus = lazy(() => import('../pages/ApiStatus'));
const NotFound = lazy(() => import('../pages/NotFound'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader message="Loading page..." />}>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="status" element={<ApiStatus />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
