import { Link } from 'react-router-dom';
import { resolveMediaUrl } from '../../utils/mediaUrl';

const InternCard = ({ intern, index = 0 }) => {
  const avatar = resolveMediaUrl(intern.profileImage);
  const delayClass = `delay-${Math.min((index % 4) + 1, 4)}`;

  return (
    <article
      className={`panel-premium animate-scale-in overflow-hidden rounded-[1.6rem] p-5 transition duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(12,23,20,0.12)] ${delayClass}`}
    >
      <div className="flex items-start gap-4">
        {avatar ? (
          <img
            src={avatar}
            alt=""
            className="h-14 w-14 rounded-2xl object-cover ring-2 ring-white shadow-sm"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-200 to-brand-600 font-display text-xl font-semibold text-white">
            {(intern.fullName || 'I').charAt(0)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-lg font-semibold text-ink">
            {intern.fullName}
          </h3>
          <p className="mt-0.5 truncate text-sm text-muted">
            {intern.professionalTitle || 'Intern'}
          </p>
          {intern.location && (
            <p className="mt-1 text-xs text-muted">{intern.location}</p>
          )}
        </div>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted">
        {intern.customHeadline ||
          intern.bio ||
          'Published portfolio available for recruiters.'}
      </p>

      {intern.skills?.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {intern.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-brand-100 bg-brand-50/90 px-2.5 py-1 text-[11px] font-medium text-brand-800"
            >
              {skill}
            </span>
          ))}
          {intern.skills.length > 5 && (
            <span className="rounded-full bg-surface px-2.5 py-1 text-[11px] text-muted">
              +{intern.skills.length - 5}
            </span>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-line/60 pt-4">
        <p className="text-xs text-muted">
          {intern.projectCount || 0} project
          {(intern.projectCount || 0) === 1 ? '' : 's'}
        </p>
        <Link
          to={`/portfolio/${intern.username}`}
          className="rounded-xl bg-brand-600 px-3.5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          View portfolio
        </Link>
      </div>
    </article>
  );
};

export default InternCard;
