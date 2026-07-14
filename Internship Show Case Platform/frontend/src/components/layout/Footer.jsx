import { Link } from 'react-router-dom';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-line bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-sm font-semibold text-ink">
            InternShowcase
          </p>
          <p className="mt-1 text-sm text-muted">
            Showcase internship projects to recruiters and employers.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-muted">
          <Link to="/" className="hover:text-ink">
            Home
          </Link>
          <Link to="/status" className="hover:text-ink">
            API Status
          </Link>
        </div>
      </div>
      <div className="border-t border-line">
        <p className="mx-auto max-w-6xl px-4 py-3 text-xs text-muted sm:px-6">
          © {year} Intern Project Showcase Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
