import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(47,145,112,0.12),_transparent_55%),linear-gradient(180deg,#f6f9f7_0%,#eef5f1_100%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <p className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl lg:text-6xl">
          Intern<span className="text-brand-600">Showcase</span>
        </p>
        <h1 className="max-w-2xl font-display text-2xl font-medium leading-snug text-ink sm:text-3xl">
          Build a professional profile and share internship projects with
          recruiters.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Create your portfolio, upload projects, customize your showcase, and
          publish a public link employers can review.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/status"
            className="rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700"
          >
            Check API Status
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
