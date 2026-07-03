import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { cn } from '../utils';
import Sidebar from '../components/layout/Sidebar';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../context/AuthContext';
import { SUPERADMIN_NAV, STUDENT_NAV } from '../constants';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isSuperadmin } = useAuth();

  const navItems = isSuperadmin ? SUPERADMIN_NAV : STUDENT_NAV;

  return (
    <div className={cn(
      'flex min-h-screen',
      isSuperadmin
        ? 'bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100'
        : 'bg-gradient-to-br from-slate-50 via-white to-emerald-50/30'
    )}>
      <Sidebar
        items={navItems}
        showAddButton={isSuperadmin}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          searchPlaceholder={isSuperadmin ? 'Search interns, tasks, certificates...' : 'Search tasks, internships...'}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
