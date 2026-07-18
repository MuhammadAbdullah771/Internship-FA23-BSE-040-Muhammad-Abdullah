import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  checkUsernameAvailability,
  generateMyUsername,
  getMyPortfolio,
  saveCustomization,
  saveProjectOrder,
  saveSectionVisibility,
  saveTheme,
  setMyUsername,
  updateMyPortfolio,
} from '../api/portfolio';
import PortfolioPreview from '../components/portfolio/PortfolioPreview';
import ProjectOrderList from '../components/portfolio/ProjectOrderList';
import ShareBar from '../components/portfolio/ShareBar';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageShell from '../components/ui/PageShell';

const THEME_OPTIONS = [
  {
    id: 'minimal',
    label: 'Minimal',
    hint: 'Clean editorial layout',
  },
  {
    id: 'professional',
    label: 'Professional',
    hint: 'Polished recruiter-ready',
  },
  {
    id: 'creative',
    label: 'Creative',
    hint: 'Dark expressive canvas',
  },
  {
    id: 'bold',
    label: 'Bold',
    hint: 'High-contrast impact',
  },
];

const COLOR_PRESETS = [
  '#1d6f52',
  '#0f766e',
  '#1d4ed8',
  '#b45309',
  '#be123c',
  '#111111',
];

const fieldClass =
  'field-premium w-full rounded-xl px-3.5 py-2.5 text-sm text-ink disabled:opacity-60';

const defaultDraft = {
  theme: 'professional',
  primaryColor: '#1d6f52',
  customHeadline: '',
  portfolioStatus: 'draft',
  username: '',
  sectionVisibility: {
    about: true,
    skills: true,
    projects: true,
    contact: true,
  },
  customization: {
    about: {
      headline: '',
      intro: '',
      showEducation: true,
      showLocation: true,
    },
    skills: {
      title: 'Skills',
      layout: 'chips',
    },
    projects: {
      title: 'Projects',
      showTechnologies: true,
    },
    contact: {
      title: 'Get in touch',
      message: '',
      showEmail: true,
      showGithub: true,
      showLinkedin: true,
    },
  },
};

const Toggle = ({ checked, onChange, label, disabled }) => (
  <div className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-3.5 py-3">
    <span className="text-sm font-medium text-ink">{label}</span>
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={[
        'relative h-6 w-11 shrink-0 rounded-full transition',
        checked ? 'bg-brand-600' : 'bg-line',
        disabled ? 'opacity-60' : '',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition',
          checked ? 'translate-x-5' : 'translate-x-0',
        ].join(' ')}
      />
    </button>
  </div>
);

const PortfolioEditor = () => {
  const [draft, setDraft] = useState(defaultDraft);
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [panel, setPanel] = useState('theme');
  const [usernameHint, setUsernameHint] = useState('');
  const [usernameBusy, setUsernameBusy] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getMyPortfolio();
        if (!active) return;
        const data = res.data?.data || {};
        const settings = data.settings || {};

        setDraft({
          theme: settings.theme || 'professional',
          primaryColor: settings.primaryColor || '#1d6f52',
          customHeadline: settings.customHeadline || '',
          portfolioStatus: settings.portfolioStatus || 'draft',
          username: settings.username || '',
          sectionVisibility: {
            about: settings.sectionVisibility?.about !== false,
            skills: settings.sectionVisibility?.skills !== false,
            projects: settings.sectionVisibility?.projects !== false,
            contact: settings.sectionVisibility?.contact !== false,
          },
          customization: {
            about: {
              headline: settings.customization?.about?.headline || '',
              intro: settings.customization?.about?.intro || '',
              showEducation:
                settings.customization?.about?.showEducation !== false,
              showLocation:
                settings.customization?.about?.showLocation !== false,
            },
            skills: {
              title: settings.customization?.skills?.title || 'Skills',
              layout: settings.customization?.skills?.layout || 'chips',
            },
            projects: {
              title: settings.customization?.projects?.title || 'Projects',
              showTechnologies:
                settings.customization?.projects?.showTechnologies !== false,
            },
            contact: {
              title: settings.customization?.contact?.title || 'Get in touch',
              message: settings.customization?.contact?.message || '',
              showEmail: settings.customization?.contact?.showEmail !== false,
              showGithub: settings.customization?.contact?.showGithub !== false,
              showLinkedin:
                settings.customization?.contact?.showLinkedin !== false,
            },
          },
        });
        setProjects(data.projects || []);
        setProfile(data.profile || null);
        setUser(data.user || null);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load portfolio settings');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  const previewSettings = useMemo(
    () => ({
      ...draft,
      projectOrder: projects.map((project) => project._id),
    }),
    [draft, projects]
  );

  const setVisibility = (key, value) => {
    setDraft((prev) => ({
      ...prev,
      sectionVisibility: { ...prev.sectionVisibility, [key]: value },
    }));
  };

  const setCustomization = (section, patch) => {
    setDraft((prev) => ({
      ...prev,
      customization: {
        ...prev.customization,
        [section]: { ...prev.customization[section], ...patch },
      },
    }));
  };

  const flashSuccess = (message) => {
    setSuccess(message);
    window.setTimeout(() => setSuccess(''), 2800);
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await updateMyPortfolio({
        theme: draft.theme,
        primaryColor: draft.primaryColor,
        customHeadline: draft.customHeadline,
        portfolioStatus: draft.portfolioStatus,
        username: draft.username,
        sectionVisibility: draft.sectionVisibility,
        projectOrder: projects.map((project) => project._id),
        customization: draft.customization,
      });
      const data = res.data?.data || {};
      if (data.projects) setProjects(data.projects);
      if (data.profile) setProfile(data.profile);
      if (data.user) setUser(data.user);
      if (data.settings?.username) {
        setDraft((prev) => ({ ...prev, username: data.settings.username }));
      }
      flashSuccess('Portfolio changes saved');
    } catch (err) {
      setError(err.message || 'Failed to save portfolio');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickSaveTheme = async () => {
    setSaving(true);
    setError('');
    try {
      await saveTheme({
        theme: draft.theme,
        primaryColor: draft.primaryColor,
      });
      flashSuccess('Theme saved');
    } catch (err) {
      setError(err.message || 'Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickSaveVisibility = async () => {
    setSaving(true);
    setError('');
    try {
      await saveSectionVisibility(draft.sectionVisibility);
      flashSuccess('Section visibility saved');
    } catch (err) {
      setError(err.message || 'Failed to save visibility');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickSaveOrder = async () => {
    setSaving(true);
    setError('');
    try {
      await saveProjectOrder(projects.map((project) => project._id));
      flashSuccess('Project order saved');
    } catch (err) {
      setError(err.message || 'Failed to save project order');
    } finally {
      setSaving(false);
    }
  };

  const handleQuickSaveCustomization = async () => {
    setSaving(true);
    setError('');
    try {
      await saveCustomization({
        customHeadline: draft.customHeadline,
        customization: draft.customization,
      });
      flashSuccess('Customization saved');
    } catch (err) {
      setError(err.message || 'Failed to save customization');
    } finally {
      setSaving(false);
    }
  };

  const handleCheckUsername = async () => {
    setUsernameBusy(true);
    setUsernameHint('');
    try {
      const res = await checkUsernameAvailability(draft.username);
      const result = res.data?.data;
      if (result?.available) {
        setUsernameHint('Username is available');
      } else {
        setUsernameHint(result?.reason || 'Username is not available');
      }
    } catch (err) {
      setUsernameHint(err.message || 'Unable to check username');
    } finally {
      setUsernameBusy(false);
    }
  };

  const handleSaveUsername = async () => {
    setUsernameBusy(true);
    setError('');
    try {
      const res = await setMyUsername(draft.username);
      const next = res.data?.data?.settings?.username || draft.username;
      setDraft((prev) => ({ ...prev, username: next }));
      flashSuccess('Username saved');
      setUsernameHint('');
    } catch (err) {
      setError(err.message || 'Failed to save username');
    } finally {
      setUsernameBusy(false);
    }
  };

  const handleGenerateUsername = async () => {
    setUsernameBusy(true);
    setError('');
    try {
      const res = await generateMyUsername(
        profile?.fullName || user?.fullName || ''
      );
      const next = res.data?.data?.username || '';
      if (next) {
        setDraft((prev) => ({ ...prev, username: next }));
        setUsernameHint('Suggestion ready — save to claim it');
      }
    } catch (err) {
      setError(err.message || 'Failed to generate username');
    } finally {
      setUsernameBusy(false);
    }
  };

  const panels = [
    { id: 'theme', label: 'Theme' },
    { id: 'sections', label: 'Sections' },
    { id: 'about', label: 'About' },
    { id: 'skills', label: 'Skills' },
    { id: 'projects', label: 'Projects' },
    { id: 'contact', label: 'Contact' },
  ];

  const publicPath = draft.username ? `/portfolio/${draft.username}` : '';

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="animate-fade-up max-w-2xl">
            <p className="font-display text-[11px] font-semibold tracking-[0.24em] text-brand-600 uppercase">
              Module 5
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
              Portfolio editor
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
              Customize theme, colors, sections, and project order — then watch
              the live preview update instantly.
            </p>
          </div>
          <div className="animate-fade-up delay-2 flex flex-wrap items-center gap-3">
            {publicPath && draft.portfolioStatus === 'published' && (
              <Link
                to={publicPath}
                className="btn-ghost rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
              >
                View public page
              </Link>
            )}
            <Link
              to="/projects"
              className="btn-ghost rounded-xl px-4 py-2.5 text-sm font-medium text-ink"
            >
              Manage projects
            </Link>
            <button
              type="button"
              disabled={saving || loading}
              onClick={handleSaveAll}
              className="btn-premium rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6">
            <ErrorMessage message={error} onRetry={handleSaveAll} />
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800">
            {success}
          </div>
        )}

        {loading ? (
          <div className="mt-16 flex items-center gap-3 text-muted">
            <LoadingSpinner />
            Loading portfolio editor…
          </div>
        ) : (
          <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
            <div className="animate-scale-in space-y-6">
              <div className="panel-premium rounded-[1.75rem] p-5 sm:p-6">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="font-display text-lg font-semibold text-ink">
                      Portfolio status
                    </h2>
                    <p className="mt-1 text-sm text-muted">
                      Draft stays private. Publish when you are ready to share.
                    </p>
                  </div>
                  <div className="inline-flex rounded-xl border border-line bg-white p-1">
                    {['draft', 'published'].map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() =>
                          setDraft((prev) => ({
                            ...prev,
                            portfolioStatus: status,
                          }))
                        }
                        className={[
                          'rounded-lg px-3.5 py-2 text-sm font-medium capitalize transition',
                          draft.portfolioStatus === status
                            ? 'bg-brand-600 text-white'
                            : 'text-muted hover:text-ink',
                        ].join(' ')}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="mt-5 block">
                  <span className="text-sm font-medium text-ink">
                    Public username
                  </span>
                  <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-xs text-muted">
                        /portfolio/
                      </span>
                      <input
                        type="text"
                        value={draft.username}
                        onChange={(event) =>
                          setDraft((prev) => ({
                            ...prev,
                            username: event.target.value
                              .toLowerCase()
                              .replace(/[^a-z0-9-]/g, ''),
                          }))
                        }
                        maxLength={30}
                        placeholder="your-name"
                        className={`${fieldClass} pl-[5.75rem]`}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={usernameBusy || !draft.username}
                        onClick={handleCheckUsername}
                        className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink hover:bg-surface disabled:opacity-60"
                      >
                        Check
                      </button>
                      <button
                        type="button"
                        disabled={usernameBusy}
                        onClick={handleGenerateUsername}
                        className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink hover:bg-surface disabled:opacity-60"
                      >
                        Generate
                      </button>
                      <button
                        type="button"
                        disabled={usernameBusy || !draft.username}
                        onClick={handleSaveUsername}
                        className="rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm font-medium text-ink hover:bg-surface disabled:opacity-60"
                      >
                        Save slug
                      </button>
                    </div>
                  </div>
                  {usernameHint && (
                    <p className="mt-2 text-xs text-muted">{usernameHint}</p>
                  )}
                </label>

                {publicPath && draft.portfolioStatus === 'published' && (
                  <div className="mt-5 rounded-2xl border border-brand-100 bg-brand-50/60 p-4">
                    <p className="text-sm font-medium text-brand-900">
                      Live at{' '}
                      <Link
                        to={publicPath}
                        className="font-semibold underline-offset-2 hover:underline"
                      >
                        {publicPath}
                      </Link>
                    </p>
                    <div className="mt-3">
                      <ShareBar
                        url={publicPath}
                        title={`${profile?.fullName || 'Intern'} — Portfolio`}
                      />
                    </div>
                  </div>
                )}

                {publicPath && draft.portfolioStatus !== 'published' && (
                  <p className="mt-4 text-xs text-muted">
                    Public link ready at {publicPath} — publish to make it
                    visible.
                  </p>
                )}

                <label className="mt-5 block">
                  <span className="text-sm font-medium text-ink">
                    Custom headline
                  </span>
                  <input
                    type="text"
                    value={draft.customHeadline}
                    onChange={(event) =>
                      setDraft((prev) => ({
                        ...prev,
                        customHeadline: event.target.value,
                      }))
                    }
                    maxLength={160}
                    placeholder="e.g. Full-stack intern building recruiter-ready products"
                    className={`${fieldClass} mt-2`}
                  />
                </label>
              </div>

              <div className="panel-premium rounded-[1.75rem] p-5 sm:p-6">
                <div className="flex flex-wrap gap-2 border-b border-line/70 pb-4">
                  {panels.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setPanel(item.id)}
                      className={[
                        'rounded-lg px-3 py-2 text-sm font-medium transition',
                        panel === item.id
                          ? 'bg-brand-600 text-white'
                          : 'bg-white text-muted hover:text-ink border border-line',
                      ].join(' ')}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>

                <div className="mt-5">
                  {panel === 'theme' && (
                    <div className="space-y-5">
                      <div>
                        <h3 className="font-display text-base font-semibold text-ink">
                          Theme selection
                        </h3>
                        <div className="mt-3 grid gap-3 sm:grid-cols-2">
                          {THEME_OPTIONS.map((theme) => (
                            <button
                              key={theme.id}
                              type="button"
                              onClick={() =>
                                setDraft((prev) => ({
                                  ...prev,
                                  theme: theme.id,
                                }))
                              }
                              className={[
                                'rounded-2xl border px-4 py-4 text-left transition',
                                draft.theme === theme.id
                                  ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/20'
                                  : 'border-line bg-white hover:border-brand-300',
                              ].join(' ')}
                            >
                              <p className="font-display text-sm font-semibold text-ink">
                                {theme.label}
                              </p>
                              <p className="mt-1 text-xs text-muted">
                                {theme.hint}
                              </p>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="font-display text-base font-semibold text-ink">
                          Color customization
                        </h3>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          {COLOR_PRESETS.map((color) => (
                            <button
                              key={color}
                              type="button"
                              title={color}
                              onClick={() =>
                                setDraft((prev) => ({
                                  ...prev,
                                  primaryColor: color,
                                }))
                              }
                              className={[
                                'h-9 w-9 rounded-full border-2 transition',
                                draft.primaryColor === color
                                  ? 'border-ink scale-110'
                                  : 'border-white shadow-sm',
                              ].join(' ')}
                              style={{ background: color }}
                            />
                          ))}
                          <label className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm text-ink">
                            Custom
                            <input
                              type="color"
                              value={draft.primaryColor}
                              onChange={(event) =>
                                setDraft((prev) => ({
                                  ...prev,
                                  primaryColor: event.target.value,
                                }))
                              }
                              className="h-7 w-9 cursor-pointer rounded border-0 bg-transparent p-0"
                            />
                          </label>
                        </div>
                      </div>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={handleQuickSaveTheme}
                        className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface disabled:opacity-60"
                      >
                        Save theme
                      </button>
                    </div>
                  )}

                  {panel === 'sections' && (
                    <div className="space-y-3">
                      <h3 className="font-display text-base font-semibold text-ink">
                        Show / hide sections
                      </h3>
                      <Toggle
                        label="About"
                        checked={draft.sectionVisibility.about}
                        onChange={(value) => setVisibility('about', value)}
                        disabled={saving}
                      />
                      <Toggle
                        label="Skills"
                        checked={draft.sectionVisibility.skills}
                        onChange={(value) => setVisibility('skills', value)}
                        disabled={saving}
                      />
                      <Toggle
                        label="Projects"
                        checked={draft.sectionVisibility.projects}
                        onChange={(value) => setVisibility('projects', value)}
                        disabled={saving}
                      />
                      <Toggle
                        label="Contact"
                        checked={draft.sectionVisibility.contact}
                        onChange={(value) => setVisibility('contact', value)}
                        disabled={saving}
                      />
                      <button
                        type="button"
                        disabled={saving}
                        onClick={handleQuickSaveVisibility}
                        className="mt-2 rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface disabled:opacity-60"
                      >
                        Save visibility
                      </button>
                    </div>
                  )}

                  {panel === 'about' && (
                    <div className="space-y-4">
                      <h3 className="font-display text-base font-semibold text-ink">
                        About section
                      </h3>
                      <label className="block">
                        <span className="text-sm font-medium text-ink">
                          Section headline
                        </span>
                        <input
                          type="text"
                          value={draft.customization.about.headline}
                          onChange={(event) =>
                            setCustomization('about', {
                              headline: event.target.value,
                            })
                          }
                          className={`${fieldClass} mt-2`}
                          placeholder="Optional about headline"
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-ink">
                          Custom intro
                        </span>
                        <textarea
                          rows={4}
                          value={draft.customization.about.intro}
                          onChange={(event) =>
                            setCustomization('about', {
                              intro: event.target.value,
                            })
                          }
                          className={`${fieldClass} mt-2 resize-y`}
                          placeholder="Leave blank to use your profile bio"
                        />
                      </label>
                      <Toggle
                        label="Show education"
                        checked={draft.customization.about.showEducation}
                        onChange={(value) =>
                          setCustomization('about', { showEducation: value })
                        }
                      />
                      <Toggle
                        label="Show location"
                        checked={draft.customization.about.showLocation}
                        onChange={(value) =>
                          setCustomization('about', { showLocation: value })
                        }
                      />
                      <button
                        type="button"
                        disabled={saving}
                        onClick={handleQuickSaveCustomization}
                        className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface disabled:opacity-60"
                      >
                        Save about customization
                      </button>
                    </div>
                  )}

                  {panel === 'skills' && (
                    <div className="space-y-4">
                      <h3 className="font-display text-base font-semibold text-ink">
                        Skills section
                      </h3>
                      <label className="block">
                        <span className="text-sm font-medium text-ink">
                          Section title
                        </span>
                        <input
                          type="text"
                          value={draft.customization.skills.title}
                          onChange={(event) =>
                            setCustomization('skills', {
                              title: event.target.value,
                            })
                          }
                          className={`${fieldClass} mt-2`}
                        />
                      </label>
                      <div>
                        <p className="text-sm font-medium text-ink">Layout</p>
                        <div className="mt-2 inline-flex rounded-xl border border-line bg-white p-1">
                          {['chips', 'list'].map((layout) => (
                            <button
                              key={layout}
                              type="button"
                              onClick={() =>
                                setCustomization('skills', { layout })
                              }
                              className={[
                                'rounded-lg px-3.5 py-2 text-sm font-medium capitalize transition',
                                draft.customization.skills.layout === layout
                                  ? 'bg-brand-600 text-white'
                                  : 'text-muted hover:text-ink',
                              ].join(' ')}
                            >
                              {layout}
                            </button>
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-muted">
                        Skills content comes from your profile.{' '}
                        <Link
                          to="/profile/edit"
                          className="font-medium text-brand-700 hover:underline"
                        >
                          Edit skills →
                        </Link>
                      </p>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={handleQuickSaveCustomization}
                        className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface disabled:opacity-60"
                      >
                        Save skills customization
                      </button>
                    </div>
                  )}

                  {panel === 'projects' && (
                    <div className="space-y-4">
                      <h3 className="font-display text-base font-semibold text-ink">
                        Projects section
                      </h3>
                      <label className="block">
                        <span className="text-sm font-medium text-ink">
                          Section title
                        </span>
                        <input
                          type="text"
                          value={draft.customization.projects.title}
                          onChange={(event) =>
                            setCustomization('projects', {
                              title: event.target.value,
                            })
                          }
                          className={`${fieldClass} mt-2`}
                        />
                      </label>
                      <Toggle
                        label="Show technologies"
                        checked={draft.customization.projects.showTechnologies}
                        onChange={(value) =>
                          setCustomization('projects', {
                            showTechnologies: value,
                          })
                        }
                      />
                      <div>
                        <div className="mb-2 flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-ink">
                            Drag to reorder projects
                          </p>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={handleQuickSaveOrder}
                            className="text-sm font-semibold text-brand-700 hover:underline disabled:opacity-60"
                          >
                            Save order
                          </button>
                        </div>
                        <ProjectOrderList
                          projects={projects}
                          onReorder={setProjects}
                        />
                      </div>
                      <button
                        type="button"
                        disabled={saving}
                        onClick={handleQuickSaveCustomization}
                        className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface disabled:opacity-60"
                      >
                        Save projects customization
                      </button>
                    </div>
                  )}

                  {panel === 'contact' && (
                    <div className="space-y-4">
                      <h3 className="font-display text-base font-semibold text-ink">
                        Contact section
                      </h3>
                      <label className="block">
                        <span className="text-sm font-medium text-ink">
                          Section title
                        </span>
                        <input
                          type="text"
                          value={draft.customization.contact.title}
                          onChange={(event) =>
                            setCustomization('contact', {
                              title: event.target.value,
                            })
                          }
                          className={`${fieldClass} mt-2`}
                        />
                      </label>
                      <label className="block">
                        <span className="text-sm font-medium text-ink">
                          Contact message
                        </span>
                        <textarea
                          rows={3}
                          value={draft.customization.contact.message}
                          onChange={(event) =>
                            setCustomization('contact', {
                              message: event.target.value,
                            })
                          }
                          className={`${fieldClass} mt-2 resize-y`}
                          placeholder="A short note for recruiters"
                        />
                      </label>
                      <Toggle
                        label="Show email"
                        checked={draft.customization.contact.showEmail}
                        onChange={(value) =>
                          setCustomization('contact', { showEmail: value })
                        }
                      />
                      <Toggle
                        label="Show GitHub"
                        checked={draft.customization.contact.showGithub}
                        onChange={(value) =>
                          setCustomization('contact', { showGithub: value })
                        }
                      />
                      <Toggle
                        label="Show LinkedIn"
                        checked={draft.customization.contact.showLinkedin}
                        onChange={(value) =>
                          setCustomization('contact', { showLinkedin: value })
                        }
                      />
                      <button
                        type="button"
                        disabled={saving}
                        onClick={handleQuickSaveCustomization}
                        className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink hover:bg-surface disabled:opacity-60"
                      >
                        Save contact customization
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <aside className="animate-scale-in delay-2 xl:sticky xl:top-24 xl:self-start">
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="font-display text-lg font-semibold text-ink">
                  Live preview
                </h2>
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-brand-800 uppercase">
                  {draft.portfolioStatus}
                </span>
              </div>
              <PortfolioPreview
                settings={previewSettings}
                profile={profile}
                projects={projects}
                user={user}
              />
            </aside>
          </div>
        )}
      </section>
    </PageShell>
  );
};

export default PortfolioEditor;
