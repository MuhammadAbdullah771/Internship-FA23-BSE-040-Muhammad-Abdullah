import { Link } from 'react-router-dom';
import { GraduationCap, Mail, MapPin, Phone } from 'lucide-react';
import { ROUTES } from '../../constants';

const footerLinks = {
  Platform: [
    { label: 'Internships', href: '#internships' },
    { label: 'Startup Journey', href: '#startup' },
    { label: 'Resources', href: '#resources' },
  ],
  Account: [
    { label: 'Sign In', to: ROUTES.STUDENT_LOGIN },
    { label: 'Create Account', to: ROUTES.STUDENT_SIGNUP },
    { label: 'Internship Portal', href: '#internships' },
  ],
};

export default function LandingFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1">
            <Link to={ROUTES.LANDING} className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Intern<span className="text-emerald-400">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed">
              Pakistan&apos;s leading virtual internship platform. Build skills, gain experience, and land your dream job.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.to ? (
                      <Link to={link.to} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-slate-400 hover:text-emerald-400 transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                support@internhub.io
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                +92 300 1234567
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                Lahore, Pakistan
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">&copy; 2024 InternHub. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-emerald-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-emerald-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
