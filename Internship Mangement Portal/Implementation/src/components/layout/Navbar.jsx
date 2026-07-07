import { Link } from 'react-router-dom';
import { Bell, Menu, Shield, Sparkles } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { cn } from '../../utils';
import SearchBar from '../common/SearchBar';
import Badge from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useAppPaths } from '../../hooks/useAppPaths';
import { clerkAppearance } from '../../config/clerk';

export default function Navbar({ onMenuClick, searchPlaceholder = 'Search...', breadcrumbs }) {
  const { isSuperadmin, user } = useAuth();
  const paths = useAppPaths();

  return (
    <header className={cn(
      'sticky top-0 z-30',
      isSuperadmin
        ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-sm'
        : 'glass-nav'
    )}>
      <div className="flex items-center gap-4 px-4 lg:px-8 py-3.5">
        <button
          onClick={onMenuClick}
          className={cn(
            'lg:hidden p-2.5 rounded-xl transition-colors',
            isSuperadmin ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-white/80 text-slate-600 shadow-sm'
          )}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {breadcrumbs && (
          <div className={cn('hidden md:block text-sm shrink-0 font-medium', isSuperadmin ? 'text-slate-500' : 'text-slate-400')}>
            {breadcrumbs}
          </div>
        )}

        <SearchBar
          placeholder={searchPlaceholder}
          className="flex-1 max-w-xl mx-auto"
          dark={isSuperadmin}
        />

        <div className="flex items-center gap-2.5 shrink-0">
          {isSuperadmin ? (
            <Badge className="hidden sm:inline-flex bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 items-center gap-1">
              <Shield className="w-3 h-3" /> Secure Session
            </Badge>
          ) : (
            <Badge className="hidden sm:inline-flex bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-0 ring-1 ring-emerald-200/60 items-center gap-1.5 px-3 py-1">
              <Sparkles className="w-3 h-3" /> Student
            </Badge>
          )}
          <Link
            to={paths.NOTIFICATIONS}
            className={cn(
              'relative p-2.5 rounded-xl transition-all duration-200',
              isSuperadmin
                ? 'hover:bg-slate-800 text-slate-300'
                : 'hover:bg-white/90 text-slate-600 shadow-sm hover:shadow-md border border-transparent hover:border-slate-200/60'
            )}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-gradient-to-br from-red-400 to-rose-500 rounded-full ring-2 ring-white" />
          </Link>
          {isSuperadmin ? (
            <Link
              to={paths.PROFILE}
              className="flex items-center gap-2 p-1 rounded-xl transition-colors hover:bg-slate-800"
              aria-label="Admin profile"
            >
              <img
                src={user?.avatar}
                alt=""
                className="w-9 h-9 rounded-xl border border-slate-700 object-cover"
              />
            </Link>
          ) : (
            <div className="rounded-xl ring-2 ring-white shadow-sm">
              <UserButton appearance={clerkAppearance} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
