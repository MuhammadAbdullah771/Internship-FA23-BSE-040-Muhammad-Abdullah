const ConfirmDialog = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  busy = false,
  tone = 'danger',
  onConfirm,
  onCancel,
}) => {
  if (!open) return null;

  const confirmClass =
    tone === 'danger'
      ? 'bg-gradient-to-b from-red-500 to-red-700 shadow-[0_12px_30px_rgba(185,28,28,0.28)] hover:brightness-105'
      : 'btn-premium';

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/50 px-4 backdrop-blur-[6px] animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
    >
      <div className="panel-premium w-full max-w-md animate-scale-in rounded-[1.6rem] p-6 sm:p-7">
        <p className="font-display text-[10px] font-semibold tracking-[0.22em] text-brand-600 uppercase">
          Confirm action
        </p>
        <h2
          id="confirm-dialog-title"
          className="mt-3 font-display text-2xl font-semibold tracking-tight text-ink"
        >
          {title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{message}</p>
        <div className="mt-7 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="btn-ghost rounded-xl px-4 py-2.5 text-sm font-medium text-ink disabled:opacity-60"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60 ${confirmClass}`}
          >
            {busy ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
