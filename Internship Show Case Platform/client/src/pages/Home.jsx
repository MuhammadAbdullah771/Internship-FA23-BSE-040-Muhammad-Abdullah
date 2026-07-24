import { Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const STEPS = [
  {
    title: 'Create your profile',
    copy: 'Skills, education, and the story behind your internship path.',
  },
  {
    title: 'Showcase your projects',
    copy: 'Ship proof of work — stacks, outcomes, and the craft behind them.',
  },
  {
    title: 'Publish one link',
    copy: 'Share a clean public page recruiters can open and trust in seconds.',
  },
];

const Home = () => {
  const { isSignedIn } = useAuthContext();

  return (
    <>
      <section className="relative isolate min-h-[100svh] overflow-hidden">
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2400&q=80"
            alt=""
            className="hero-photo h-full w-full object-cover animate-ken will-change-transform"
          />
          <div className="hero-grade absolute inset-0" />
          <div className="landing-grain pointer-events-none absolute inset-0" />
          <div
            className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-40 bg-[radial-gradient(circle_at_30%_40%,rgba(255,210,160,0.18),transparent_42%)]"
            aria-hidden="true"
          />
        </div>

        <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-4 pb-24 pt-28 sm:px-6 sm:pb-28 lg:justify-center lg:pb-32 lg:pt-24">
          <div className="max-w-3xl">
            <p className="animate-fade-up font-display text-5xl font-semibold tracking-tight text-white sm:text-6xl lg:text-7xl">
              Intern<span className="text-brand-300">Showcase</span>
            </p>

            <h1 className="animate-fade-up delay-1 mt-8 max-w-[18ch] font-display text-[2rem] font-semibold leading-[1.12] tracking-tight text-white text-balance sm:text-5xl lg:text-[3.4rem]">
              Your internship work, made undeniable.
            </h1>

            <p className="animate-fade-up delay-2 mt-6 max-w-md text-base leading-relaxed text-[#d7ebe2] sm:text-lg">
              Build a focused portfolio and share one link that shows recruiters
              what you can actually ship.
            </p>

            <div className="animate-fade-up delay-3 mt-10 flex flex-wrap items-center gap-3">
              {isSignedIn ? (
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center gap-2 rounded-xl bg-[#f4faf7] px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-white"
                >
                  Open dashboard
                  <span
                    aria-hidden="true"
                    className="transition group-hover:translate-x-0.5"
                  >
                    →
                  </span>
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="group inline-flex items-center gap-2 rounded-xl bg-[#f4faf7] px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-white"
                  >
                    Start your showcase
                    <span
                      aria-hidden="true"
                      className="transition group-hover:translate-x-0.5"
                    >
                      →
                    </span>
                  </Link>
                  <Link
                    to="/login"
                    className="rounded-xl border border-white/25 bg-transparent px-6 py-3.5 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    Sign in
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-surface">
        <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
          <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
            <div className="animate-rise">
              <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand-600 uppercase">
                How it works
              </p>
              <h2 className="mt-4 max-w-[14ch] font-display text-4xl font-semibold tracking-tight text-ink text-balance sm:text-5xl">
                From draft to shareable in three moves.
              </h2>
            </div>
            <p className="animate-rise delay-1 max-w-md text-base leading-relaxed text-muted sm:text-lg">
              No noisy dashboards. Just the pieces recruiters need — your
              profile, your projects, and a public URL that feels finished.
            </p>
          </div>

          <ol className="mt-20 space-y-0 border-t border-line">
            {STEPS.map((step, index) => (
              <li
                key={step.title}
                className="animate-rise grid gap-4 border-b border-line py-10 sm:grid-cols-[7rem_1fr] sm:gap-10"
                style={{ animationDelay: `${160 + index * 110}ms` }}
              >
                <p className="font-display text-sm font-semibold tracking-[0.18em] text-brand-600">
                  {String(index + 1).padStart(2, '0')}
                </p>
                <div>
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
                    {step.copy}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="relative isolate overflow-hidden text-white">
        <div className="absolute inset-0" aria-hidden="true">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2400&q=90"
            alt=""
            className="h-full w-full object-cover scale-105 brightness-[0.72] contrast-[1.08] saturate-[1.05]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(8,16,14,0.88)_0%,rgba(10,28,22,0.72)_45%,rgba(12,40,32,0.55)_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(110,198,168,0.22),transparent_50%)]" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-24 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:py-28">
          <div className="animate-rise">
            <h2 className="max-w-[12ch] font-display text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
              A portfolio page that feels hire-ready.
            </h2>
            <p className="mt-5 max-w-md text-base leading-relaxed text-[#d7ebe2] sm:text-lg">
              Your public showcase will look like a finished product page —
              clear profile, real project work, and a link recruiters can open
              with confidence.
            </p>
            {!isSignedIn && (
              <Link
                to="/register"
                className="mt-8 inline-flex rounded-xl bg-[#f4faf7] px-6 py-3.5 text-sm font-semibold text-ink transition hover:bg-white"
              >
                Create free account
              </Link>
            )}
          </div>

          {/* Realistic portfolio sample */}
          <div className="animate-rise delay-2 relative mx-auto w-full max-w-md">
            <div className="overflow-hidden rounded-2xl border border-white/15 bg-[#0d1714]/90 shadow-[0_30px_80px_rgba(0,0,0,0.45)] backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-white/10 bg-black/25 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                <span className="ml-3 truncate rounded-md bg-white/5 px-2.5 py-1 font-mono text-[11px] text-white/55">
                  internshowcase.app/u/abdullah
                </span>
              </div>

              <div className="relative h-36 overflow-hidden sm:h-40">
                <img
                  src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80"
                  alt=""
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d1714] via-[#0d1714]/40 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80"
                    alt=""
                    className="h-14 w-14 rounded-xl object-cover ring-2 ring-white/20"
                  />
                  <div className="min-w-0 pb-0.5">
                    <p className="truncate font-display text-lg font-semibold text-white">
                      Muhammad Abdullah
                    </p>
                    <p className="truncate text-xs text-white/70">
                      Full-Stack Intern · MERN
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4 px-4 py-5">
                <p className="text-sm leading-relaxed text-white/65">
                  Building production-ready web apps during internship —
                  authentication, APIs, and polished UI systems.
                </p>

                <div>
                  <p className="font-display text-xs font-semibold tracking-[0.16em] text-brand-300 uppercase">
                    Featured projects
                  </p>
                  <div className="mt-3 grid grid-cols-2 gap-3">
                    <article className="overflow-hidden rounded-xl bg-white/5">
                      <img
                        src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80"
                        alt=""
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <div className="px-2.5 py-2">
                        <p className="truncate text-xs font-semibold text-white">
                          Analytics Dashboard
                        </p>
                        <p className="truncate text-[11px] text-white/50">
                          React · Charts · API
                        </p>
                      </div>
                    </article>
                    <article className="overflow-hidden rounded-xl bg-white/5">
                      <img
                        src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=600&q=80"
                        alt=""
                        className="aspect-[4/3] w-full object-cover"
                      />
                      <div className="px-2.5 py-2">
                        <p className="truncate text-xs font-semibold text-white">
                          Intern Portal API
                        </p>
                        <p className="truncate text-[11px] text-white/50">
                          Node · MongoDB · JWT
                        </p>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
