import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, UserButton } from '@clerk/clerk-react';
import { GraduationCap, ChevronDown, Menu, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LANDING_NAV } from '../../constants/landingData';
import { ROUTES } from '../../constants';
import { clerkAppearance } from '../../config/clerk';
import { cn } from '../../utils';
import { softTap } from '../../utils/landingMotion';

function NavItem({ item, onClick }) {
  const className = 'relative flex items-center gap-1 text-sm font-semibold text-slate-600 hover:text-emerald-600 transition-colors py-0.5 group';
  const content = (
    <>
      {item.label}
      {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-200" />}
      <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-emerald-500 group-hover:w-full transition-all duration-300 rounded-full" />
    </>
  );

  if (item.href.startsWith('/')) {
    return <Link to={item.href} onClick={onClick} className={className}>{content}</Link>;
  }
  return <a href={item.href} onClick={onClick} className={className}>{content}</a>;
}

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={cn(
      'sticky top-0 z-50 transition-all duration-300',
      scrolled ? 'nav-scrolled glass-nav' : 'bg-transparent border-b border-transparent'
    )}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center justify-between h-14 lg:h-16"
        >
          <Link to={ROUTES.LANDING} className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-extrabold text-slate-900 tracking-tight">
              Intern<span className="text-gradient">Hub</span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {LANDING_NAV.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
              >
                <NavItem item={item} />
              </motion.div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to={ROUTES.STUDENT.LOGIN}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-emerald-500/20 hover:shadow-lg"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Internship Portal
            </Link>
            <SignedIn>
              <UserButton afterSignOutUrl="/" appearance={clerkAppearance} />
            </SignedIn>
          </div>

          <motion.button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            whileTap={softTap}
            className="lg:hidden p-2.5 rounded-xl hover:bg-white/80 border border-transparent hover:border-slate-200/60 transition-all"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </motion.div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="lg:hidden border-t border-slate-200/60 glass overflow-hidden"
          >
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
              className="px-4 py-4 space-y-1"
            >
              {LANDING_NAV.map((item) => (
                <motion.div
                  key={item.label}
                  variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                  className="px-3 py-2.5"
                >
                  <NavItem item={item} onClick={() => setMobileOpen(false)} />
                </motion.div>
              ))}
              <motion.div
                variants={{ hidden: { opacity: 0, x: -12 }, visible: { opacity: 1, x: 0 } }}
                className="pt-3 px-3"
              >
                <Link
                  to={ROUTES.STUDENT.LOGIN}
                  onClick={() => setMobileOpen(false)}
                  className="block text-center px-5 py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-sm font-bold rounded-xl shadow-md"
                >
                  Internship Portal
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
