import { useState } from 'react';

const ChipInput = ({
  label,
  values,
  onChange,
  placeholder = 'Type and press Enter',
  maxItems = 20,
  disabled = false,
  hint,
}) => {
  const [draft, setDraft] = useState('');

  const addValue = () => {
    const next = draft.trim().replace(/\s+/g, ' ');
    if (!next) return;
    if (values.some((item) => item.toLowerCase() === next.toLowerCase())) {
      setDraft('');
      return;
    }
    if (values.length >= maxItems) return;
    onChange([...values, next]);
    setDraft('');
  };

  const removeValue = (item) => {
    onChange(values.filter((entry) => entry !== item));
  };

  return (
    <div>
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-ink">{label}</label>
        <span className="text-xs text-muted">
          {values.length}/{maxItems}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap gap-2">
        {values.map((item) => (
          <button
            key={item}
            type="button"
            disabled={disabled}
            onClick={() => removeValue(item)}
            className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50/90 px-2.5 py-1 text-xs font-medium text-brand-800 transition hover:bg-brand-100 disabled:opacity-60"
            title="Remove"
          >
            {item}
            <span aria-hidden="true">×</span>
          </button>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={draft}
          disabled={disabled || values.length >= maxItems}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              addValue();
            }
          }}
          placeholder={placeholder}
          className="field-premium w-full rounded-xl px-3.5 py-2.5 text-sm text-ink disabled:opacity-60"
        />
        <button
          type="button"
          disabled={disabled || !draft.trim() || values.length >= maxItems}
          onClick={addValue}
          className="rounded-xl border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface disabled:opacity-60"
        >
          Add
        </button>
      </div>
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </div>
  );
};

export default ChipInput;
