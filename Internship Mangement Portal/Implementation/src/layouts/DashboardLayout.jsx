import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '../utils';
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
    <div className={cn(
      'relative flex min-h-screen',
      isSuperadmin
        ? 'bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100'
        : 'bg-[#f4f7fb]'
    )}>
      {!isSuperadmin && <AmbientBackground />}

      <Sidebar
        items={navItems}
        showAddButton={isSuperadmin}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="relative z-10 flex-1 flex flex-col min-w-0">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          searchPlaceholder={isSuperadmin ? 'Search interns, tasks, certificates...' : 'Search tasks, internships...'}
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
