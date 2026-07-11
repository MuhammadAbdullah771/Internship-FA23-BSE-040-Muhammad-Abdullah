import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { ROUTES } from '../../constants';
import { staggerContainer, viewportOnce, cardReveal } from '../../utils/landingMotion';

const footerLinks = {
  Platform: [
    { label: 'Internships', href: '#internships' },
    { label: 'How It Works', href: '#startup' },
  ],
  Account: [
    { label: 'Internship Portal', to: ROUTES.STUDENT.LOGIN },
    { label: 'Sign Up', to: ROUTES.STUDENT.SIGNUP },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="relative bg-slate-900 text-slate-300 overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-transparent to-teal-900/10 pointer-events-none" />

      <div className="landing-container relative py-12 lg:py-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10"
        >
          <motion.div variants={cardReveal} custom={0} className="sm:col-span-2 lg:col-span-1">
            <Link to={ROUTES.LANDING} className="flex items-center gap-2.5 mb-4 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <GraduationCap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-extrabold text-white tracking-tight">
                Intern<span className="text-emerald-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Pakistan&apos;s leading virtual internship platform. Build skills, gain experience, and land your dream job.
            </p>
          </motion.div>

          {Object.entries(footerLinks).map(([title, links], sectionIdx) => (
            <motion.div key={title} variants={cardReveal} custom={sectionIdx + 1}>
              <h4 className="text-xs font-bold text-white uppercase tracking-[0.12em] mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link
                        to={link.to}
                        className="group inline-flex items-center gap-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="group inline-flex items-center gap-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors"
                      >
                        {link.label}
                        <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          <motion.div variants={cardReveal} custom={3}>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.12em] mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <Mail className="w-3.5 h-3.5 text-emerald-500" />
                </span>
                support@internhub.io
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <Phone className="w-3.5 h-3.5 text-emerald-500" />
                </span>
                +92 300 1234567
              </li>
              <li className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                </span>
                Lahore, Pakistan
              </li>
            </ul>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          transition={{ delay: 0.2 }}
          className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-sm text-slate-500">&copy; 2026 InternHub. All rights reserved.</p>
          <div className="flex gap-5 text-sm text-slate-500">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
