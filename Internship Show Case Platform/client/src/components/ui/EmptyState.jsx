const EmptyState = ({
  title = 'Nothing here yet',
  message = 'Try adjusting your search or filters.',
  action = null,
}) => (
  <div className="rounded-[1.75rem] border border-dashed border-line bg-white/60 px-6 py-16 text-center">
    <p className="font-display text-xl font-semibold text-ink">{title}</p>
    <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-muted">
      {message}
    </p>
    {action && <div className="mt-6 flex justify-center">{action}</div>}
  </div>
);

export default EmptyState;
