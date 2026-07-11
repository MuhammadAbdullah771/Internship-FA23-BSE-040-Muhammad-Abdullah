import { Outlet, Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft, Sparkles, LayoutDashboard, ClipboardList, Briefcase } from 'lucide-react';
import AmbientBackground from '../components/common/AmbientBackground';
import { useAuth } from '../context/AuthContext';
import { isStudentPortalApproved, ROUTES } from '../constants';

export default function StudentPortalLayout() {
  const { user, isAuthenticated, isStudent } = useAuth();
  const portalReady = isAuthenticated && isStudent && isStudentPortalApproved(user);

  return (
    <div className="relative min-h-screen bg-[#f4f7fb]">
      <AmbientBackground />
      <header className="sticky top-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[4.25rem] flex items-center justify-between gap-4">
          <Link to={ROUTES.STUDENT.PORTAL} className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-transform group-hover:scale-105">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-slate-900 text-sm leading-tight block tracking-tight">
                Intern<span className="text-gradient">Hub</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-[0.12em] flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> Internship Portal
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#internship-programs"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 px-3 py-2 rounded-xl hover:bg-white/70"
            >
              <Briefcase className="w-4 h-4" />
              Internships
            </a>
            {portalReady && (
              <>
                <Link
                  to={ROUTES.STUDENT.DASHBOARD}
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 px-3 py-2 rounded-xl hover:bg-white/70"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <Link
                  to={ROUTES.STUDENT.TASKS}
                  className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-emerald-600 px-3 py-2 rounded-xl hover:bg-white/70"
                >
                  <ClipboardList className="w-4 h-4" />
                  Tasks
                </Link>
              </>
            )}
            <Link
              to={ROUTES.LANDING}
              className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-emerald-600 transition-colors px-3 sm:px-4 py-2 rounded-xl hover:bg-white/60"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to website</span>
            </Link>
          </div>
        </div>
      </header>
      <div className="relative z-10">
        <Outlet />
      </div>
    </div>
  );
}
