import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import AmbientBackground from '../components/common/AmbientBackground';
import { useAuth } from '../context/AuthContext';
import { SUPERADMIN_NAV, STUDENT_NAV } from '../constants';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isSuperadmin } = useAuth();

  const navItems = isSuperadmin ? SUPERADMIN_NAV : STUDENT_NAV;

  return (
    <div className="relative flex min-h-screen bg-[#f4f7fb]">
      <AmbientBackground />

      <Sidebar
        items={navItems}
        showAddButton={false}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          searchPlaceholder={isSuperadmin ? 'Search students, tasks, approvals...' : 'Search tasks, internships...'}
        />
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
