import { Outlet, Link } from 'react-router-dom';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../constants';

export default function StudentPortalLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/40 via-white to-white">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-lg border-b border-emerald-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to={ROUTES.STUDENT.PORTAL} className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-bold text-gray-900 text-sm leading-tight block">
                Intern<span className="text-emerald-600">Hub</span>
              </span>
              <span className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wider">
                Internship Portal
              </span>
            </div>
          </Link>
          <Link
            to={ROUTES.LANDING}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to website
          </Link>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
