import { Outlet } from 'react-router-dom';
import LandingNavbar from '../components/landing/LandingNavbar';

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />
      <Outlet />
    </div>
  );
}
