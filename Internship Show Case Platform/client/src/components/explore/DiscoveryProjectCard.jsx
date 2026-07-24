import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../utils/mediaUrl';
import { categoryLabel } from '../../utils/projectValidation';

const DiscoveryProjectCard = ({ project, index = 0 }) => {
  const cover = resolveMediaUrl(project.images?.[0]);
  const delayClass = `delay-${Math.min((index % 4) + 1, 4)}`;
  const avatar = resolveMediaUrl(project.intern?.profileImage);

  return (
    <article
      className={`group overflow-hidden rounded-[1.6rem] panel-premium transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_70px_rgba(12,23,20,0.14)] animate-scale-in ${delayClass}`}
    >
      <Link to={`/explore/projects/${project.id}`} className="block">
        <div className="media-frame aspect-[16/10] bg-brand-900/5">
          {cover ? (
            <img
              src={cover}
              alt=""
              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#cfeadd,transparent_55%),linear-gradient(145deg,#1d6f52,#0f372b)]">
              <span className="font-display text-sm font-semibold tracking-[0.18em] text-white/85 uppercase">
                {categoryLabel(project.category)}
              </span>
            </div>
          )}
          <div className="absolute top-3 left-3 z-10">
            <span className="rounded-full border border-white/25 bg-black/35 px-3 py-1 text-[10px] font-semibold tracking-[0.16em] text-white uppercase backdrop-blur-md">
              {categoryLabel(project.category)}
            </span>
          </div>
          <div className="absolute inset-x-0 bottom-0 z-10 p-4">
            <h3 className="font-display text-xl font-semibold tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.35)]">
              {project.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/80">
              {project.shortDescription}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-4 pt-4 pb-4">
        {project.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line/80 bg-surface/80 px-2.5 py-1 text-[11px] font-medium text-ink/80"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center gap-3 border-t border-line/60 pt-3">
          {avatar ? (
            <img
              src={avatar}
              alt=""
              className="h-8 w-8 rounded-lg object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-100 text-xs font-semibold text-brand-800">
              {(project.intern?.fullName || 'I').charAt(0)}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-ink">
              {project.intern?.fullName || 'Intern'}
            </p>
            {project.intern?.username && (
              <Link
                to={`/portfolio/${project.intern.username}`}
                className="truncate text-xs font-medium text-brand-700 hover:underline"
              >
                View portfolio
              </Link>
            )}
          </div>
          <Link
            to={`/explore/projects/${project.id}`}
            className="rounded-lg px-3 py-1.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
          >
            Open
          </Link>
        </div>
      </div>
    </article>
  );
};

export default DiscoveryProjectCard;
