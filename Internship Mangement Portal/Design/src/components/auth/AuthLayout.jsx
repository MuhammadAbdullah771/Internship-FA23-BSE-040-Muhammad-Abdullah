import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, ArrowLeft } from 'lucide-react';
import { ROUTES } from '../../constants';

export default function AuthLayout({
  variant = 'student',
  title,
  subtitle,
  children,
  backLink = ROUTES.LANDING,
  backLabel = 'Back to home',
  features = [],
}) {
  const isSuperadmin = variant === 'superadmin';

  return (
    <div className="min-h-screen flex">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className={`hidden lg:flex lg:w-[48%] xl:w-[52%] relative overflow-hidden ${
          isSuperadmin
            ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950'
            : 'bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600'
        }`}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-300 rounded-full blur-3xl" />
        </div>
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 text-white w-full">
          <Link to={ROUTES.LANDING} className="flex items-center gap-3 w-fit">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              isSuperadmin ? 'bg-white/10 backdrop-blur border border-white/20' : 'bg-white/20 backdrop-blur'
            }`}>
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold">InternHub</span>
              <p className="text-[10px] uppercase tracking-widest opacity-70">
                {isSuperadmin ? 'Administration' : 'Premium Management'}
              </p>
            </div>
          </Link>

          <div>
            <h2 className="text-3xl xl:text-4xl font-bold leading-tight mb-4">
              {isSuperadmin ? (
                <>Secure Admin<br />Control Center</>
              ) : (
                <>Start Your<br />Internship Journey</>
              )}
            </h2>
            <p className={`text-base leading-relaxed max-w-md ${isSuperadmin ? 'text-slate-300' : 'text-emerald-50'}`}>
              {isSuperadmin
                ? 'Manage interns, track progress, and oversee your entire internship program from one powerful dashboard.'
                : 'Access your tasks, submit work, track progress, and connect with mentors — all in one premium portal.'}
            </p>
            {features.length > 0 && (
              <ul className="mt-8 space-y-3">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm opacity-90">
                    <span className={`w-1.5 h-1.5 rounded-full ${isSuperadmin ? 'bg-emerald-400' : 'bg-white'}`} />
                    {f}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <p className="text-xs opacity-50">&copy; 2024 InternHub. All rights reserved.</p>
        </div>
      </motion.div>

      <div className="flex-1 flex flex-col min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="lg:hidden p-4 border-b border-gray-100 bg-white/80 backdrop-blur">
          <Link to={backLink} className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-600">
            <ArrowLeft className="w-4 h-4" />
            {backLabel}
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="w-full max-w-[420px]"
          >
            <Link
              to={backLink}
              className="hidden lg:inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-emerald-600 mb-8 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              {backLabel}
            </Link>

            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">{title}</h1>
              <p className="text-gray-500 mt-2 text-sm leading-relaxed">{subtitle}</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-premium-lg p-6 sm:p-8">
              {children}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
