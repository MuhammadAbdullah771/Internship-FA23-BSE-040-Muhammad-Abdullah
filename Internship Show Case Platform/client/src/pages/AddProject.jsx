import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createProject, uploadProjectImages } from '../api/projects';
import ChipInput from '../components/projects/ChipInput';
import ErrorMessage from '../components/ui/ErrorMessage';
import PageShell from '../components/ui/PageShell';
import {
  PROJECT_CATEGORIES,
  validateProjectForm,
} from '../utils/projectValidation';

const fieldClass =
  'field-premium w-full rounded-xl px-3.5 py-2.5 text-sm text-ink disabled:opacity-60';

const emptyForm = {
  title: '',
  shortDescription: '',
  fullDescription: '',
  category: 'web',
  githubUrl: '',
  liveDemoUrl: '',
  technologies: [],
  tags: [],
};

const AddProject = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews(urls);
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, [files]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onFiles = (event) => {
    const selected = Array.from(event.target.files || []);
    const next = [...files, ...selected].slice(0, 8);
    setFiles(next);
    event.target.value = '';
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validateProjectForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    setError('');

    try {
      const res = await createProject({
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim(),
        category: form.category,
        githubUrl: form.githubUrl.trim(),
        liveDemoUrl: form.liveDemoUrl.trim(),
        technologies: form.technologies,
        tags: form.tags,
      });

      const project = res.data?.data?.project;
      if (project?._id && files.length) {
        await uploadProjectImages(project._id, files);
      }

      navigate(`/projects/${project._id}`);
    } catch (err) {
      setError(err.message || 'Failed to create project');
    } finally {
      setSaving(false);
    }
  };

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <Link
          to="/projects"
          className="btn-ghost inline-flex rounded-xl px-3.5 py-2 text-sm font-medium text-ink"
        >
          ← Library
        </Link>
        <div className="animate-fade-up mt-6">
          <p className="font-display text-[11px] font-semibold tracking-[0.22em] text-brand-600 uppercase">
            New piece
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
            Add project
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted">
            Share what you built — story, stack, tags, and a sharp gallery.
          </p>
        </div>

        {error && (
          <div className="mt-6">
            <ErrorMessage message={error} />
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="panel-premium animate-scale-in mt-8 space-y-6 rounded-[1.75rem] p-6 sm:p-8"
        >
          <div>
            <label htmlFor="title" className="text-sm font-medium text-ink">
              Project title
            </label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={onChange}
              className={`mt-2 ${fieldClass}`}
              placeholder="Campus Event Finder"
              disabled={saving}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="shortDescription"
              className="text-sm font-medium text-ink"
            >
              Short description
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              rows={2}
              value={form.shortDescription}
              onChange={onChange}
              className={`mt-2 ${fieldClass}`}
              placeholder="One or two lines for project cards"
              disabled={saving}
            />
            <p className="mt-1 text-xs text-muted">
              {form.shortDescription.length}/280
            </p>
            {errors.shortDescription && (
              <p className="mt-1 text-xs text-red-600">
                {errors.shortDescription}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="fullDescription"
              className="text-sm font-medium text-ink"
            >
              Full description
            </label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              rows={7}
              value={form.fullDescription}
              onChange={onChange}
              className={`mt-2 ${fieldClass}`}
              placeholder="Problem, approach, your role, and outcomes"
              disabled={saving}
            />
            {errors.fullDescription && (
              <p className="mt-1 text-xs text-red-600">
                {errors.fullDescription}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="category" className="text-sm font-medium text-ink">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={onChange}
              className={`mt-2 ${fieldClass}`}
              disabled={saving}
            >
              {PROJECT_CATEGORIES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="githubUrl"
                className="text-sm font-medium text-ink"
              >
                GitHub URL
              </label>
              <input
                id="githubUrl"
                name="githubUrl"
                value={form.githubUrl}
                onChange={onChange}
                className={`mt-2 ${fieldClass}`}
                placeholder="https://github.com/..."
                disabled={saving}
              />
              {errors.githubUrl && (
                <p className="mt-1 text-xs text-red-600">{errors.githubUrl}</p>
              )}
            </div>
            <div>
              <label
                htmlFor="liveDemoUrl"
                className="text-sm font-medium text-ink"
              >
                Live demo URL
              </label>
              <input
                id="liveDemoUrl"
                name="liveDemoUrl"
                value={form.liveDemoUrl}
                onChange={onChange}
                className={`mt-2 ${fieldClass}`}
                placeholder="https://..."
                disabled={saving}
              />
              {errors.liveDemoUrl && (
                <p className="mt-1 text-xs text-red-600">{errors.liveDemoUrl}</p>
              )}
            </div>
          </div>

          <ChipInput
            label="Technologies"
            values={form.technologies}
            onChange={(technologies) =>
              setForm((prev) => ({ ...prev, technologies }))
            }
            maxItems={25}
            placeholder="React, Node.js…"
            disabled={saving}
            hint="Press Enter to add each technology"
          />

          <ChipInput
            label="Tags"
            values={form.tags}
            onChange={(tags) => setForm((prev) => ({ ...prev, tags }))}
            maxItems={20}
            placeholder="internship, fullstack…"
            disabled={saving}
          />

          <div>
            <label className="text-sm font-medium text-ink">
              Project images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onFiles}
              disabled={saving || files.length >= 8}
              className="mt-2 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-800 hover:file:bg-brand-100"
            />
            <p className="mt-2 text-xs text-muted">
              Up to 8 images, 5MB each. Preview appears below.
            </p>
            {previews.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {previews.map((src, index) => (
                  <div
                    key={src}
                    className="group relative overflow-hidden rounded-xl border border-line"
                  >
                    <img
                      src={src}
                      alt=""
                      className="aspect-video w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 rounded-md bg-black/60 px-2 py-1 text-[11px] font-medium text-white opacity-0 transition group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="btn-premium rounded-xl px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
            >
              {saving ? 'Creating…' : 'Create project'}
            </button>
            <Link
              to="/projects"
              className="btn-ghost rounded-xl px-5 py-2.5 text-sm font-medium text-ink"
            >
              Cancel
            </Link>
          </div>
        </form>
      </section>
    </PageShell>
  );
};

export default AddProject;
