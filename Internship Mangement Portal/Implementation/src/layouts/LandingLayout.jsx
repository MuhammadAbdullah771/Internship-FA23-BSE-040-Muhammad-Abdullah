import { Outlet } from 'react-router-dom';
import LandingNavbar from '../components/landing/LandingNavbar';
import AmbientBackground from '../components/common/AmbientBackground';

export default function LandingLayout() {
  return (
    <div className="relative min-h-screen bg-[#f8fafc] overflow-x-hidden antialiased">
      <AmbientBackground />
      <div className="relative z-10">
        <LandingNavbar />
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
