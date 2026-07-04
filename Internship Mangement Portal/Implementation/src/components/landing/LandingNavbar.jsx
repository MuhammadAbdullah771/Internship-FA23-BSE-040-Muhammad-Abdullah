import { useState } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import { GraduationCap, ChevronDown, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANDING_NAV } from '../../constants/landingData';
import { ROUTES } from '../../constants';
import { clerkAppearance } from '../../config/clerk';

function NavItem({ item, onClick }) {
  const className = 'flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors';
  if (item.href.startsWith('/')) {
    return (
      <Link to={item.href} onClick={onClick} className={className}>
        {item.label}
        {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
      </Link>
    );
  }
  return (
    <a href={item.href} onClick={onClick} className={className}>
      {item.label}
      {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5" />}
    </a>
  );
}

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-100/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          <Link to={ROUTES.LANDING} className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              Intern<span className="text-emerald-600">Hub</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {LANDING_NAV.map((item) => (
              <NavItem key={item.label} item={item} />
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to={ROUTES.STUDENT.LOGIN}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Internship Portal
            </Link>
            <SignedIn>
              <UserButton afterSignOutUrl="/" appearance={clerkAppearance} />
            </SignedIn>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {LANDING_NAV.map((item) => (
                <div key={item.label} className="px-3 py-2.5">
                  <NavItem item={item} onClick={() => setMobileOpen(false)} />
                </div>
              ))}
              <div className="pt-3 px-3">
                <Link
                  to={ROUTES.STUDENT.LOGIN}
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-5 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-lg"
                >
                  Internship Portal
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
