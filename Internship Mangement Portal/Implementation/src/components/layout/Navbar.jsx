import { Link } from 'react-router-dom';
import { Bell, Menu, Shield } from 'lucide-react';
import { UserButton } from '@clerk/clerk-react';
import { cn } from '../../utils';
import SearchBar from '../common/SearchBar';
import Badge from '../ui/Badge';
import { useAuth } from '../../context/AuthContext';
import { useAppPaths } from '../../hooks/useAppPaths';
import { clerkAppearance } from '../../config/clerk';

export default function Navbar({ onMenuClick, searchPlaceholder = 'Search...', breadcrumbs }) {
  const { isSuperadmin } = useAuth();
  const paths = useAppPaths();
  return (
    <header className={cn(
      'sticky top-0 z-30 backdrop-blur-md border-b shadow-sm',
      isSuperadmin
        ? 'bg-slate-900/90 border-slate-800'
        : 'bg-white/80 border-gray-100'
    )}>
      <div className="flex items-center gap-4 px-4 lg:px-6 py-3">
        <button
          onClick={onMenuClick}
          className={cn(
            'lg:hidden p-2 rounded-lg transition-colors',
            isSuperadmin ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-600'
          )}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {breadcrumbs && (
          <div className={cn('hidden md:block text-sm shrink-0', isSuperadmin ? 'text-slate-500' : 'text-gray-400')}>
            {breadcrumbs}
          </div>
        )}

        <SearchBar
          placeholder={searchPlaceholder}
          className="flex-1 max-w-xl mx-auto"
          dark={isSuperadmin}
        />

        <div className="flex items-center gap-2 shrink-0">
          {isSuperadmin ? (
            <Badge className="hidden sm:inline-flex bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 items-center gap-1">
              <Shield className="w-3 h-3" /> Secure Session
            </Badge>
          ) : (
            <Badge variant="primary" className="hidden sm:inline-flex">Student</Badge>
          )}
          <Link
            to={paths.NOTIFICATIONS}
            className={cn(
              'relative p-2 rounded-xl transition-colors',
              isSuperadmin ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-gray-100 text-gray-600'
            )}
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </Link>
          <UserButton appearance={clerkAppearance} />
        </div>
      </div>
    </header>
  );
}
