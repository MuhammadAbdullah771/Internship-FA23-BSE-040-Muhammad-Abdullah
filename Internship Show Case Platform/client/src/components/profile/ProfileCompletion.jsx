const ProfileCompletion = ({ percent = 0, className = '' }) => {
  const value = Math.max(0, Math.min(100, Number(percent) || 0));
  const label =
    value >= 80 ? 'Looking sharp' : value >= 40 ? 'Keep going' : 'Just started';

  return (
    <div className={className}>
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="font-display text-xs font-semibold tracking-[0.18em] text-brand-600 uppercase">
            Profile completion
          </p>
          <p className="mt-1 text-sm text-muted">{label}</p>
        </div>
        <p className="font-display text-3xl font-semibold text-ink">{value}%</p>
      </div>
      <div className="mt-4 h-2 overflow-hidden rounded-full bg-brand-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-600 to-brand-400 transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export default ProfileCompletion;
