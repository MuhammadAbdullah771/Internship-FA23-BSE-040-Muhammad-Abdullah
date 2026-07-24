const Skeleton = ({ className = '' }) => (
  <div
    className={`skeleton-shimmer rounded-xl ${className}`}
    aria-hidden="true"
  />
);

export default Skeleton;
