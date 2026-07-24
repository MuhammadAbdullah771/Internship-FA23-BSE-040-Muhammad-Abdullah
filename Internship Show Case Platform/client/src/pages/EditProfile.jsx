import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  addSkill,
  createProfile,
  getMyProfile,
  removeSkill,
  updateProfile,
  updateSocialLinks,
  uploadProfileImage,
} from '../api/profile';
import ProfileCompletion from '../components/profile/ProfileCompletion';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuthContext } from '../context/AuthContext';
import { resolveMediaUrl } from '../utils/mediaUrl';

const emptyForm = {
  fullName: '',
  professionalTitle: '',
  bio: '',
  location: '',
  university: '',
  degree: '',
  graduationYear: '',
  githubUrl: '',
  linkedinUrl: '',
  portfolioUrl: '',
};

const fieldClass =
  'w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-60';

const EditProfile = () => {
  const navigate = useNavigate();
  const { appUser, refreshAppUser } = useAuthContext();
  const [exists, setExists] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [completion, setCompletion] = useState(0);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [skillBusy, setSkillBusy] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getMyProfile();
        if (!active) return;
        const profile = res.data?.data?.profile;
        setCompletion(res.data?.data?.completionPercent || 0);

        if (profile) {
          setExists(true);
          setForm({
            fullName: profile.fullName || '',
            professionalTitle: profile.professionalTitle || '',
            bio: profile.bio || '',
            location: profile.location || '',
            university: profile.university || '',
            degree: profile.degree || '',
            graduationYear: profile.graduationYear || '',
            githubUrl: profile.githubUrl || '',
            linkedinUrl: profile.linkedinUrl || '',
            portfolioUrl: profile.portfolioUrl || '',
          });
          setSkills(profile.skills || []);
          setPreview(resolveMediaUrl(profile.profileImage));
        } else {
          setExists(false);
          setForm((prev) => ({
            ...prev,
            fullName: appUser?.fullName || '',
          }));
          setPreview(resolveMediaUrl(appUser?.profileImage));
        }
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load profile');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [appUser?.fullName, appUser?.profileImage]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setSuccess('');
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    const payload = {
      ...form,
      graduationYear: form.graduationYear
        ? Number(form.graduationYear)
        : null,
      skills,
    };

    try {
      const res = exists
        ? await updateProfile(payload)
        : await createProfile(payload);

      const profile = res.data?.data?.profile;
      setExists(true);
      setCompletion(res.data?.data?.completionPercent || 0);
      setSkills(profile?.skills || skills);
      setSuccess(exists ? 'Profile updated' : 'Profile created');
      await refreshAppUser();
    } catch (err) {
      setError(err.message || 'Unable to save profile');
    } finally {
      setSaving(false);
    }
  };

  const handleImage = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const res = await uploadProfileImage(file);
      const profile = res.data?.data?.profile;
      setExists(true);
      setPreview(resolveMediaUrl(profile?.profileImage));
      setCompletion(res.data?.data?.completionPercent || 0);
      setSuccess('Profile image uploaded');
      await refreshAppUser();
    } catch (err) {
      setError(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleAddSkill = async (event) => {
    event.preventDefault();
    const value = skillInput.trim();
    if (!value) return;

    if (!exists) {
      if (skills.some((s) => s.toLowerCase() === value.toLowerCase())) {
        setError('Skill already added');
        return;
      }
      setSkills((prev) => [...prev, value]);
      setSkillInput('');
      setSuccess('Skill added locally. Save profile to keep it.');
      return;
    }

    setSkillBusy(true);
    setError('');
    try {
      const res = await addSkill(value);
      setSkills(res.data?.data?.profile?.skills || []);
      setCompletion(res.data?.data?.completionPercent || 0);
      setSkillInput('');
      setSuccess('Skill added');
    } catch (err) {
      setError(err.message || 'Unable to add skill');
    } finally {
      setSkillBusy(false);
    }
  };

  const handleRemoveSkill = async (skill) => {
    if (!exists) {
      setSkills((prev) => prev.filter((item) => item !== skill));
      return;
    }

    setSkillBusy(true);
    setError('');
    try {
      const res = await removeSkill(skill);
      setSkills(res.data?.data?.profile?.skills || []);
      setCompletion(res.data?.data?.completionPercent || 0);
      setSuccess('Skill removed');
    } catch (err) {
      setError(err.message || 'Unable to remove skill');
    } finally {
      setSkillBusy(false);
    }
  };

  const handleSocialSave = async (event) => {
    event.preventDefault();
    if (!exists) {
      setError('Create/save your profile first, then update social links.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      const res = await updateSocialLinks({
        githubUrl: form.githubUrl,
        linkedinUrl: form.linkedinUrl,
        portfolioUrl: form.portfolioUrl,
      });
      setCompletion(res.data?.data?.completionPercent || 0);
      setSuccess('Social links updated');
    } catch (err) {
      setError(err.message || 'Unable to update social links');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-muted">
        <LoadingSpinner />
        Loading editor...
      </div>
    );
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(40,163,122,0.12),transparent_42%),linear-gradient(180deg,#eef4f1_0%,#ffffff_70%)]"
        aria-hidden="true"
      />

      <section className="relative mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-display text-xs font-semibold tracking-[0.2em] text-brand-600 uppercase">
              Profile studio
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
              {exists ? 'Edit your profile' : 'Create your profile'}
            </h1>
            <p className="mt-3 max-w-xl text-muted">
              Keep this polished — recruiters will judge clarity as much as
              credentials.
            </p>
          </div>
          <Link
            to="/profile"
            className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface"
          >
            View profile
          </Link>
        </div>

        <div className="mt-8">
          <ProfileCompletion
            percent={completion}
            className="rounded-3xl border border-line bg-white/80 p-6 shadow-[0_16px_50px_rgba(12,23,20,0.05)]"
          />
        </div>

        {(error || success) && (
          <div className="mt-6">
            {error ? (
              <ErrorMessage message={error} />
            ) : (
              <p className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 text-sm text-brand-800">
                {success}
              </p>
            )}
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-3xl border border-line bg-white/85 p-6 shadow-[0_16px_50px_rgba(12,23,20,0.05)]">
            <h2 className="font-display text-xl font-semibold text-ink">
              Profile image
            </h2>
            <p className="mt-2 text-sm text-muted">
              JPG, PNG, WEBP or GIF · max 5MB
            </p>
            <div className="mt-6 flex items-center gap-4">
              {preview ? (
                <img
                  src={preview}
                  alt=""
                  className="h-24 w-24 rounded-2xl object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-brand-100 font-display text-2xl font-semibold text-brand-800">
                  {(form.fullName || 'I').charAt(0)}
                </div>
              )}
              <label className="cursor-pointer rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-white">
                {uploading ? 'Uploading...' : 'Upload image'}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploading}
                  onChange={handleImage}
                />
              </label>
            </div>
          </div>

          <form
            onSubmit={handleSaveProfile}
            className="rounded-3xl border border-line bg-white/85 p-6 shadow-[0_16px_50px_rgba(12,23,20,0.05)] sm:p-8"
          >
            <h2 className="font-display text-xl font-semibold text-ink">
              Personal information
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Full name
                </label>
                <input
                  name="fullName"
                  value={form.fullName}
                  onChange={onChange}
                  required
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Professional title
                </label>
                <input
                  name="professionalTitle"
                  value={form.professionalTitle}
                  onChange={onChange}
                  placeholder="Full-Stack Intern"
                  className={fieldClass}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Bio / About
                </label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={onChange}
                  rows={5}
                  placeholder="Tell recruiters what you build and what you care about..."
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Location
                </label>
                <input
                  name="location"
                  value={form.location}
                  onChange={onChange}
                  placeholder="Islamabad, Pakistan"
                  className={fieldClass}
                />
              </div>
            </div>

            <h2 className="mt-10 font-display text-xl font-semibold text-ink">
              Professional information
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  University
                </label>
                <input
                  name="university"
                  value={form.university}
                  onChange={onChange}
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Degree
                </label>
                <input
                  name="degree"
                  value={form.degree}
                  onChange={onChange}
                  placeholder="BS Software Engineering"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Graduation year
                </label>
                <input
                  name="graduationYear"
                  type="number"
                  min="1950"
                  max="2100"
                  value={form.graduationYear}
                  onChange={onChange}
                  className={fieldClass}
                />
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
              >
                {saving && (
                  <LoadingSpinner
                    size="sm"
                    className="border-white border-t-transparent"
                  />
                )}
                {saving ? 'Saving...' : exists ? 'Save changes' : 'Create profile'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/profile')}
                className="rounded-xl border border-line px-5 py-2.5 text-sm font-medium text-ink transition hover:bg-surface"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={handleAddSkill}
            className="rounded-3xl border border-line bg-white/85 p-6 shadow-[0_16px_50px_rgba(12,23,20,0.05)]"
          >
            <h2 className="font-display text-xl font-semibold text-ink">
              Skills management
            </h2>
            <div className="mt-5 flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                placeholder="React, Node.js, MongoDB..."
                className={fieldClass}
              />
              <button
                type="submit"
                disabled={skillBusy}
                className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-70"
              >
                Add
              </button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {skills.length === 0 ? (
                <p className="text-sm text-muted">No skills yet.</p>
              ) : (
                skills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="rounded-lg bg-brand-50 px-3 py-1.5 text-sm font-medium text-brand-800 transition hover:bg-brand-100"
                    title="Remove skill"
                  >
                    {skill} ×
                  </button>
                ))
              )}
            </div>
          </form>

          <form
            onSubmit={handleSocialSave}
            className="rounded-3xl border border-line bg-white/85 p-6 shadow-[0_16px_50px_rgba(12,23,20,0.05)]"
          >
            <h2 className="font-display text-xl font-semibold text-ink">
              Social links
            </h2>
            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  GitHub URL
                </label>
                <input
                  name="githubUrl"
                  value={form.githubUrl}
                  onChange={onChange}
                  placeholder="https://github.com/username"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  LinkedIn URL
                </label>
                <input
                  name="linkedinUrl"
                  value={form.linkedinUrl}
                  onChange={onChange}
                  placeholder="https://linkedin.com/in/username"
                  className={fieldClass}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">
                  Portfolio URL
                </label>
                <input
                  name="portfolioUrl"
                  value={form.portfolioUrl}
                  onChange={onChange}
                  placeholder="https://your-portfolio.com"
                  className={fieldClass}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={saving}
              className="mt-6 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
            >
              Save social links
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
