import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

const navLinkClass = ({ isActive }) =>
  [
    'text-sm font-medium transition',
    isActive ? 'text-brand-700' : 'text-muted hover:text-ink',
  ].join(' ');

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-surface/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-ink">
          Intern<span className="text-brand-600">Showcase</span>
        </Link>

        <button
          type="button"
          className="inline-flex items-center rounded-lg border border-line px-3 py-2 text-sm text-ink md:hidden"
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
          <NavLink to="/status" className={navLinkClass}>
            API Status
          </NavLink>
        </div>
      </nav>

      {open && (
        <div className="border-t border-line px-4 py-3 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink
              to="/"
              end
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              Home
            </NavLink>
            <NavLink
              to="/status"
              className={navLinkClass}
              onClick={() => setOpen(false)}
            >
              API Status
            </NavLink>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
