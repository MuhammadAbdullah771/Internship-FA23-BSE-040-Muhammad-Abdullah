import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { resolveMediaUrl } from '../../utils/mediaUrl';

const NAV_ITEMS = [
  {
    to: '/dashboard',
    label: 'Overview',
    end: true,
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    to: '/projects',
    label: 'Projects',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
        <path d="M8 9h8M8 13h5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/portfolio',
    label: 'Portfolio',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M4 8.5A2.5 2.5 0 0 1 6.5 6H9l1.2-1.5A1.5 1.5 0 0 1 11.4 4h1.2a1.5 1.5 0 0 1 1.2.5L15 6h2.5A2.5 2.5 0 0 1 20 8.5V17a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 17V8.5Z" />
        <circle cx="12" cy="12.5" r="3" />
      </svg>
    ),
  },
  {
    to: '/profile',
    label: 'Profile',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="8" r="3.25" />
        <path d="M5.5 19.5c1.6-3.2 4-4.8 6.5-4.8s4.9 1.6 6.5 4.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/settings',
    label: 'Settings',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.6M17.5 15.9l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.6M17.5 8.1l1.6-1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: '/explore',
    label: 'Explore',
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="11" cy="11" r="6.5" />
        <path d="M20 20l-3.2-3.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const WorkspaceLayout = () => {
  const { appUser, clerkUser } = useAuthContext();
  const [open, setOpen] = useState(false);

  const displayName = appUser?.fullName || clerkUser?.fullName || 'Intern';
  const avatar =
    resolveMediaUrl(appUser?.profileImage) || clerkUser?.imageUrl || '';

  const linkClass = ({ isActive }) =>
    [
      'sidebar-link',
      isActive ? 'sidebar-link-active' : 'sidebar-link-idle',
    ].join(' ');

  return (
    <div className="relative isolate min-h-[70vh]">
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute inset-0 app-atmosphere" />
        <div className="absolute inset-0 app-grain" />
      </div>

      <div className="relative mx-auto flex max-w-7xl gap-0 px-0 lg:gap-8 lg:px-6 lg:py-8">
        <aside
          className={[
            'fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-line/70 bg-surface-elevated/95 p-5 backdrop-blur-xl transition lg:sticky lg:top-24 lg:z-auto lg:h-[calc(100svh-7rem)] lg:w-60 lg:shrink-0 lg:rounded-[1.75rem] lg:border lg:bg-white/85 lg:p-5 lg:shadow-[0_18px_50px_rgba(12,23,20,0.06)]',
            open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
          ].join(' ')}
        >
          <div className="flex items-center justify-between gap-3 lg:block">
            <div className="flex items-center gap-3">
              {avatar ? (
                <img
                  src={avatar}
                  alt=""
                  className="h-11 w-11 rounded-xl object-cover ring-2 ring-brand-100"
                />
              ) : (
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-200 to-brand-600 text-sm font-semibold text-white">
                  {displayName.charAt(0)}
                </span>
              )}
              <div className="min-w-0">
                <p className="truncate font-display text-sm font-semibold text-ink">
                  {displayName}
                </p>
                <p className="text-[10px] font-semibold tracking-[0.16em] text-muted uppercase">
                  Workspace
                </p>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg border border-line px-2.5 py-1 text-sm lg:hidden"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </div>

          <nav className="mt-8 flex-1 space-y-1">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                <span className="opacity-90" aria-hidden="true">
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="mt-6 hidden border-t border-line/70 pt-4 lg:block">
            <p className="text-[11px] leading-relaxed text-muted">
              Publish once. Share everywhere.
            </p>
          </div>
        </aside>

        {open && (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-ink/40 backdrop-blur-[2px] lg:hidden"
            aria-label="Close sidebar"
            onClick={() => setOpen(false)}
          />
        )}

        <div className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-0 lg:py-0">
          <button
            type="button"
            className="btn-ghost mb-4 inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium text-ink lg:hidden"
            onClick={() => setOpen(true)}
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            </svg>
            Menu
          </button>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
