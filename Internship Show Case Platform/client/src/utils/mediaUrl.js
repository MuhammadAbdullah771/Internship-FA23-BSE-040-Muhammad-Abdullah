/**
 * Resolve uploaded or remote image URLs for the UI.
 */
export const resolveMediaUrl = (value) => {
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/')) return value;
  return `/${value}`;
};
