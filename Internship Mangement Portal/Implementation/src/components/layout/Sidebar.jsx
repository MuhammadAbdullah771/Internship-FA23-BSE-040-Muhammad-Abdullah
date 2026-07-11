import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardList, BarChart3, Settings,
  HelpCircle, Plus, X, TrendingUp, LogOut, Briefcase, GraduationCap, Award, Shield, UserCheck, FileText, Sparkles,
} from 'lucide-react';
import { cn } from '../../utils';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, getLoginPath } from '../../constants';
import { getAvatarUrl } from '../../utils/avatar';

const iconMap = {
  LayoutDashboard, Users, ClipboardList, BarChart3, Settings, TrendingUp, Briefcase, Award, UserCheck, FileText,
};

const DASHBOARD_PATHS = [ROUTES.SUPERADMIN.DASHBOARD, ROUTES.STUDENT.DASHBOARD, ROUTES.STUDENT.PORTAL];

export default function Sidebar({ items, showAddButton = true, isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isSuperadmin, user } = useAuth();

  const isActive = (path) => {
    const pathname = path.split('#')[0];
    if (pathname === ROUTES.STUDENT.PORTAL) return location.pathname === ROUTES.STUDENT.PORTAL;
    if (DASHBOARD_PATHS.includes(pathname)) return location.pathname === pathname;
    return location.pathname === pathname || location.pathname.startsWith(`${pathname}/`);
  };

  const handleLogout = async () => {
    const loginPath = user ? getLoginPath(user.role) : ROUTES.STUDENT.LOGIN;
    await logout();
    onClose?.();
    navigate(loginPath);
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-[270px] flex flex-col transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          'glass border-r border-white/60 shadow-premium-lg lg:shadow-none',
        )}
      >
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-emerald-500/8 to-transparent pointer-events-none" />

        <div className="relative flex items-center justify-between p-5 border-b border-slate-200/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/30">
              {isSuperadmin
                ? <Shield className="w-5 h-5 text-white" />
                : <GraduationCap className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h1 className="font-extrabold text-sm leading-tight tracking-tight text-slate-900">
                Intern<span className="text-gradient">Hub</span>
              </h1>
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                {isSuperadmin ? 'Admin Portal' : 'Student Portal'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 rounded-xl transition-colors hover:bg-slate-100" aria-label="Close sidebar">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {user && (
          <div className="mx-4 mt-4 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-100/60">
            <div className="flex items-center gap-3">
              <img
                src={getAvatarUrl(user)}
                alt=""
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-white shadow-sm"
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                  {isSuperadmin ? <><Shield className="w-3 h-3" /> Superadmin</> : <><Sparkles className="w-3 h-3" /> Active Student</>}
                </p>
              </div>
            </div>
          </div>
        )}

        {showAddButton && (
          <div className="px-4 pt-4">
            <button className="w-full flex items-center justify-center gap-2 text-sm font-semibold py-2.5 rounded-xl transition-all bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25">
              <Plus className="w-4 h-4" />
              Add New Intern
            </button>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="px-3 pb-2 section-label">
            {isSuperadmin ? 'Management' : 'Navigation'}
          </p>
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 relative group',
                  active
                    ? 'bg-gradient-to-r from-emerald-500/12 to-teal-500/8 text-emerald-700 shadow-sm shadow-emerald-500/5'
                    : 'text-slate-500 hover:bg-white/60 hover:text-slate-800',
                )}
              >
                {Icon && (
                  <span className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg transition-colors',
                    active ? 'bg-emerald-500/15 text-emerald-600' : 'text-slate-400 group-hover:text-emerald-600',
                  )}>
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                )}
                {item.label}
                {active && (
                  <span className="absolute right-3 w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-glow-emerald" />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-1 border-slate-200/50">
          <a
            href="#"
            className="flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors text-slate-500 hover:text-slate-700 hover:bg-white/50"
          >
            <HelpCircle className="w-5 h-5" />
            Support
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 text-sm font-medium rounded-xl transition-colors text-slate-500 hover:text-red-600 hover:bg-red-50/80"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
