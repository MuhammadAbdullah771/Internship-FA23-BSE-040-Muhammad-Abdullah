import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Logo from '../brand/Logo';
import { useAuthContext } from '../../context/AuthContext';

const Navbar = () => {
  const { pathname } = useLocation();
  const isHome = pathname === '/';
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);
  const { isSignedIn, appUser, clerkUser, logout } = useAuthContext();

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    setOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const displayName = appUser?.fullName || clerkUser?.fullName || 'Account';
  const avatarUrl = appUser?.profileImage || clerkUser?.imageUrl;

  const useLightText = isHome && !scrolled;

  const navLinkClass = ({ isActive }) =>
    [
      'text-sm font-medium transition',
      useLightText
        ? `nav-text-shadow ${isActive ? 'text-white' : 'text-white/85 hover:text-white'}`
        : isActive
          ? 'text-brand-700'
          : 'text-muted hover:text-ink',
    ].join(' ');

  const headerClass = [
    'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
    useLightText
      ? 'border-b border-transparent bg-transparent'
      : 'border-b border-line/70 bg-surface/90 backdrop-blur-xl',
  ].join(' ');

  return (
    <header className={headerClass}>
      <nav className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo imgClassName="h-9 w-auto max-w-[180px]" />

        <button
          type="button"
          className={
            useLightText
              ? 'inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-white nav-text-shadow md:hidden'
              : 'inline-flex items-center rounded-lg border border-line px-3 py-2 text-sm text-ink md:hidden'
          }
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((prev) => !prev)}
        >
          Menu
        </button>

        <div className="hidden items-center gap-8 md:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/explore" className={navLinkClass}>
            Explore
          </NavLink>
          <NavLink to="/interns" className={navLinkClass}>
            Interns
          </NavLink>

          {isSignedIn ? (
            <>
              <NavLink to="/dashboard" className={navLinkClass}>
                Dashboard
              </NavLink>
              <NavLink to="/projects" className={navLinkClass}>
                Projects
              </NavLink>
              <NavLink to="/portfolio" className={navLinkClass}>
                Portfolio
              </NavLink>
              <NavLink to="/profile" className={navLinkClass}>
                Profile
              </NavLink>
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((prev) => !prev)}
                  className={
                    useLightText
                      ? 'flex items-center gap-2 rounded-lg py-1 pl-1 pr-2 text-sm text-white nav-text-shadow transition hover:bg-white/10'
                      : 'flex items-center gap-2 rounded-lg border border-line bg-surface-elevated py-1 pl-1 pr-3 text-sm text-ink transition hover:bg-white'
                  }
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt=""
                      className="h-8 w-8 rounded-md object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-100 text-xs font-semibold text-brand-800">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  )}
                  <span className="hidden max-w-[120px] truncate sm:inline">
                    {displayName}
                  </span>
                </button>

                {menuOpen && (
                  <div
                    role="menu"
                    className="absolute right-0 mt-2 w-44 rounded-xl border border-line bg-surface-elevated p-1 shadow-[0_12px_40px_rgba(12,23,20,0.12)]"
                  >
                    <Link
                      to="/dashboard"
                      role="menuitem"
                      className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface"
                      onClick={() => setMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/projects"
                      role="menuitem"
                      className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface"
                      onClick={() => setMenuOpen(false)}
                    >
                      Projects
                    </Link>
                    <Link
                      to="/portfolio"
                      role="menuitem"
                      className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface"
                      onClick={() => setMenuOpen(false)}
                    >
                      Portfolio
                    </Link>
                    <Link
                      to="/profile"
                      role="menuitem"
                      className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface"
                      onClick={() => setMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/profile/edit"
                      role="menuitem"
                      className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface"
                      onClick={() => setMenuOpen(false)}
                    >
                      Edit profile
                    </Link>
                    <Link
                      to="/settings"
                      role="menuitem"
                      className="block rounded-lg px-3 py-2 text-sm text-ink hover:bg-surface"
                      onClick={() => setMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      type="button"
                      role="menuitem"
                      className="block w-full rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-surface"
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Sign in
              </NavLink>
              <Link
                to="/register"
                className={
                  useLightText
                    ? 'rounded-lg bg-white/95 px-3.5 py-2 text-sm font-semibold text-ink shadow-[0_8px_24px_rgba(0,0,0,0.18)] transition hover:bg-white'
                    : 'rounded-lg bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700'
                }
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>

      {open && (
        <div
          className={
            useLightText
              ? 'mx-4 mb-3 rounded-2xl bg-black/50 px-4 py-4 backdrop-blur-md md:hidden'
              : 'border-t border-line bg-surface/95 px-4 py-3 md:hidden'
          }
        >
          <div className="flex flex-col gap-3">
            <NavLink to="/" end className={navLinkClass} onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink
              to="/explore"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Explore
            </NavLink>
            <NavLink
              to="/interns"
              className={navLinkClass}
              onClick={closeMenu}
            >
              Interns
            </NavLink>

            {isSignedIn ? (
              <>
                <NavLink
                  to="/dashboard"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/projects"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Projects
                </NavLink>
                <NavLink
                  to="/portfolio"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Portfolio
                </NavLink>
                <NavLink
                  to="/profile"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Profile
                </NavLink>
                <button
                  type="button"
                  onClick={() => {
                    closeMenu();
                    logout();
                  }}
                  className={
                    useLightText
                      ? 'text-left text-sm font-medium text-white nav-text-shadow'
                      : 'text-left text-sm font-medium text-ink'
                  }
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Sign in
                </NavLink>
                <NavLink
                  to="/register"
                  className={navLinkClass}
                  onClick={closeMenu}
                >
                  Sign up
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
