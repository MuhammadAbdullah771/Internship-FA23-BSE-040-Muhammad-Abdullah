import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  getProject,
  updateProject,
  uploadProjectImages,
} from '../api/projects';
import ChipInput from '../components/projects/ChipInput';
import ErrorMessage from '../components/ui/ErrorMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import PageShell from '../components/ui/PageShell';
import { resolveMediaUrl } from '../utils/mediaUrl';
import {
  PROJECT_CATEGORIES,
  validateProjectForm,
} from '../utils/projectValidation';

const fieldClass =
  'field-premium w-full rounded-xl px-3.5 py-2.5 text-sm text-ink disabled:opacity-60';

const EditProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [existingImages, setExistingImages] = useState([]);
  const [removeImages, setRemoveImages] = useState([]);
  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await getProject(id);
        if (!active) return;
        const project = res.data?.data?.project;
        if (!project) {
          setError('Project not found');
          return;
        }
        setForm({
          title: project.title || '',
          shortDescription: project.shortDescription || '',
          fullDescription: project.fullDescription || '',
          category: project.category || 'web',
          githubUrl: project.githubUrl || '',
          liveDemoUrl: project.liveDemoUrl || '',
          technologies: project.technologies || [],
          tags: project.tags || [],
        });
        setExistingImages(project.images || []);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Unable to load project');
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, [id]);

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
    const remainingSlots =
      8 - (existingImages.length - removeImages.length) - files.length;
    const next = [...files, ...selected].slice(0, Math.max(0, remainingSlots));
    setFiles(next);
    event.target.value = '';
  };

  const toggleRemoveImage = (imagePath) => {
    setRemoveImages((prev) =>
      prev.includes(imagePath)
        ? prev.filter((item) => item !== imagePath)
        : [...prev, imagePath]
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form) return;

    const nextErrors = validateProjectForm(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setSaving(true);
    setError('');

    try {
      await updateProject(id, {
        title: form.title.trim(),
        shortDescription: form.shortDescription.trim(),
        fullDescription: form.fullDescription.trim(),
        category: form.category,
        githubUrl: form.githubUrl.trim(),
        liveDemoUrl: form.liveDemoUrl.trim(),
        technologies: form.technologies,
        tags: form.tags,
        removeImages,
      });

      if (files.length) {
        await uploadProjectImages(id, files);
      }

      navigate(`/projects/${id}`);
    } catch (err) {
      setError(err.message || 'Failed to update project');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="flex min-h-[50vh] items-center justify-center gap-3 text-muted">
          <LoadingSpinner />
          Loading project...
        </div>
      </PageShell>
    );
  }

  if (!form) {
    return (
      <PageShell>
        <div className="mx-auto max-w-3xl px-4 py-16">
          <ErrorMessage message={error || 'Project not found'} />
          <Link
            to="/projects"
            className="mt-6 inline-flex text-sm font-semibold text-brand-700 hover:underline"
          >
            ← Back to projects
          </Link>
        </div>
      </PageShell>
    );
  }

  const visibleExisting = existingImages.filter(
    (image) => !removeImages.includes(image)
  );

  return (
    <PageShell>
      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
        <Link
          to={`/projects/${id}`}
          className="btn-ghost inline-flex rounded-xl px-3.5 py-2 text-sm font-medium text-ink"
        >
          ← Details
        </Link>
        <div className="animate-fade-up mt-6">
          <p className="font-display text-[11px] font-semibold tracking-[0.22em] text-brand-600 uppercase">
            Refine
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight text-ink">
            Edit project
          </h1>
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
              disabled={saving}
            />
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
                disabled={saving}
              />
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
                disabled={saving}
              />
            </div>
          </div>

          <ChipInput
            label="Technologies"
            values={form.technologies}
            onChange={(technologies) =>
              setForm((prev) => ({ ...prev, technologies }))
            }
            maxItems={25}
            disabled={saving}
          />

          <ChipInput
            label="Tags"
            values={form.tags}
            onChange={(tags) => setForm((prev) => ({ ...prev, tags }))}
            maxItems={20}
            disabled={saving}
          />

          <div>
            <p className="text-sm font-medium text-ink">Current images</p>
            {existingImages.length === 0 ? (
              <p className="mt-2 text-sm text-muted">No images yet.</p>
            ) : (
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {existingImages.map((image) => {
                  const marked = removeImages.includes(image);
                  return (
                    <button
                      key={image}
                      type="button"
                      onClick={() => toggleRemoveImage(image)}
                      className={`relative overflow-hidden rounded-xl border text-left transition ${
                        marked
                          ? 'border-red-300 opacity-50'
                          : 'border-line hover:border-brand-400'
                      }`}
                    >
                      <img
                        src={resolveMediaUrl(image)}
                        alt=""
                        className="aspect-video w-full object-cover"
                      />
                      <span className="absolute inset-x-0 bottom-0 bg-black/55 px-2 py-1 text-[11px] font-medium text-white">
                        {marked ? 'Marked for removal' : 'Click to remove'}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-ink">
              Add more images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={onFiles}
              disabled={
                saving || visibleExisting.length + files.length >= 8
              }
              className="mt-2 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-brand-800 hover:file:bg-brand-100"
            />
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
                      onClick={() =>
                        setFiles((prev) => prev.filter((_, i) => i !== index))
                      }
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
              {saving ? 'Saving…' : 'Save changes'}
            </button>
            <Link
              to={`/projects/${id}`}
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

export default EditProject;
