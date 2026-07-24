import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-display text-6xl font-semibold text-brand-600">404</p>
      <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
        Page not found
      </h1>
      <p className="mt-2 max-w-md text-muted">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
      >
        Back to home
      </Link>
    </section>
  );
};

export default NotFound;
