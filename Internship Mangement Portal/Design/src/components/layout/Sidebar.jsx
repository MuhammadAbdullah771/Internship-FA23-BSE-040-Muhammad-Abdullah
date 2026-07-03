import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, ClipboardList, BarChart3, Settings,
  HelpCircle, Plus, X, TrendingUp, LogOut, Briefcase, GraduationCap, Award, Shield,
} from 'lucide-react';
import { cn } from '../../utils';
import { useAuth } from '../../context/AuthContext';
import { ROUTES, getLoginPath } from '../../constants';

const iconMap = {
  LayoutDashboard, Users, ClipboardList, BarChart3, Settings, TrendingUp, Briefcase, Award,
};

const DASHBOARD_PATHS = [ROUTES.SUPERADMIN.DASHBOARD, ROUTES.STUDENT.DASHBOARD, ROUTES.LANDING];

export default function Sidebar({ items, showAddButton = true, isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, isSuperadmin, user } = useAuth();

  const isActive = (path) => {
    if (path === ROUTES.LANDING) return location.pathname === ROUTES.LANDING;
    if (DASHBOARD_PATHS.includes(path)) return location.pathname === path;
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const handleLogout = () => {
    const loginPath = user ? getLoginPath(user.role) : ROUTES.STUDENT_LOGIN;
    logout();
    onClose?.();
    navigate(loginPath);
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={cn(
          'fixed top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          isSuperadmin
            ? 'bg-slate-900 border-r border-slate-800 shadow-xl'
            : 'bg-white border-r border-gray-100 shadow-premium lg:shadow-none'
        )}
      >
        <div className={cn('flex items-center justify-between p-5 border-b', isSuperadmin ? 'border-slate-800' : 'border-gray-50')}>
          <div className="flex items-center gap-3">
            <div className={cn(
              'w-9 h-9 rounded-lg flex items-center justify-center',
              isSuperadmin
                ? 'bg-emerald-500/20 border border-emerald-500/30'
                : 'bg-emerald-600 shadow-md shadow-emerald-500/25'
            )}>
              {isSuperadmin
                ? <Shield className="w-5 h-5 text-emerald-400" />
                : <GraduationCap className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h1 className={cn('font-bold text-sm leading-tight', isSuperadmin ? 'text-white' : 'text-gray-900')}>
                Intern<span className="text-emerald-500">Hub</span>
              </h1>
              <p className={cn('text-[10px] uppercase tracking-wider', isSuperadmin ? 'text-slate-500' : 'text-gray-400')}>
                {isSuperadmin ? 'Secure Admin' : 'Internship Portal'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className={cn('lg:hidden p-1 rounded-lg', isSuperadmin ? 'hover:bg-slate-800' : 'hover:bg-gray-100')} aria-label="Close sidebar">
            <X className={cn('w-5 h-5', isSuperadmin ? 'text-slate-400' : 'text-gray-500')} />
          </button>
        </div>

        {showAddButton && (
          <div className="px-4 pt-4">
            <button className={cn(
              'w-full flex items-center justify-center gap-2 text-sm font-medium py-2.5 rounded-xl transition-colors',
              isSuperadmin
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
            )}>
              <Plus className="w-4 h-4" />
              Add New Intern
            </button>
          </div>
        )}

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {items.map((item) => {
            const Icon = iconMap[item.icon];
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative',
                  isSuperadmin
                    ? active
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                    : active
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                )}
              >
                {Icon && <Icon className="w-5 h-5" />}
                {item.label}
                {active && (
                  <span className={cn(
                    'absolute right-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-l-full',
                    isSuperadmin ? 'bg-emerald-500' : 'bg-emerald-600'
                  )} />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className={cn('p-4 border-t space-y-1', isSuperadmin ? 'border-slate-800' : 'border-gray-50')}>
          <a
            href="#"
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors',
              isSuperadmin ? 'text-slate-500 hover:text-slate-300 hover:bg-slate-800' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            )}
          >
            <HelpCircle className="w-5 h-5" />
            Support
          </a>
          <button
            onClick={handleLogout}
            className={cn(
              'w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl transition-colors',
              isSuperadmin ? 'text-slate-500 hover:text-red-400 hover:bg-red-950/30' : 'text-gray-500 hover:text-red-600 hover:bg-red-50'
            )}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
