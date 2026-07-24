import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const Footer = () => {
  const year = new Date().getFullYear();
  const { isSignedIn } = useAuthContext();

  return (
    <footer className="mt-auto bg-ink text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-2xl font-semibold tracking-tight">
              Intern<span className="text-brand-300">Showcase</span>
            </p>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60">
              A focused portfolio platform for interns — profiles, projects, and
              one shareable link recruiters can trust.
            </p>
            {!isSignedIn && (
              <Link
                to="/register"
                className="mt-8 inline-flex rounded-lg bg-brand-400 px-4 py-2.5 text-sm font-semibold text-ink transition hover:bg-brand-300"
              >
                Get started
              </Link>
            )}
          </div>

          <div>
            <p className="font-display text-xs font-semibold tracking-[0.18em] text-brand-300 uppercase">
              Explore
            </p>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              <li>
                <Link to="/" className="transition hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/explore" className="transition hover:text-white">
                  Explore projects
                </Link>
              </li>
              <li>
                <Link to="/interns" className="transition hover:text-white">
                  Discover interns
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition hover:text-white">
                  Sign in
                </Link>
              </li>
              <li>
                <Link to="/register" className="transition hover:text-white">
                  Create account
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-display text-xs font-semibold tracking-[0.18em] text-brand-300 uppercase">
              Platform
            </p>
            <ul className="mt-5 space-y-3 text-sm text-white/65">
              <li>
                <Link to="/dashboard" className="transition hover:text-white">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/status" className="transition hover:text-white">
                  API Status
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-white/45 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {year} InternShowcase</p>
          <p>Built for interns · Shared with recruiters</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
