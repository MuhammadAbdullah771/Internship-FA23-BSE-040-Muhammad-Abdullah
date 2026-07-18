const RESERVED_USERNAMES = new Set([
  'me',
  'public',
  'check',
  'username',
  'edit',
  'new',
  'api',
  'admin',
  'settings',
  'login',
  'register',
  'dashboard',
  'profile',
  'projects',
  'portfolio',
  'status',
  'www',
  'help',
  'support',
]);

const USERNAME_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/**
 * Normalize a display name or raw input into a portfolio slug candidate.
 */
const slugifyUsername = (value = '') =>
  String(value)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 30)
    .replace(/-+$/g, '');

/**
 * Validate username format. Returns an error message or null if valid.
 */
const validateUsernameFormat = (username) => {
  const value = String(username || '')
    .trim()
    .toLowerCase();

  if (!value) return 'Username is required';
  if (value.length < 3) return 'Username must be at least 3 characters';
  if (value.length > 30) return 'Username cannot exceed 30 characters';
  if (!USERNAME_REGEX.test(value)) {
    return 'Username may only contain lowercase letters, numbers, and hyphens';
  }
  if (RESERVED_USERNAMES.has(value)) {
    return 'This username is reserved';
  }
  return null;
};

const normalizeUsername = (username) =>
  String(username || '')
    .trim()
    .toLowerCase();

module.exports = {
  RESERVED_USERNAMES,
  USERNAME_REGEX,
  slugifyUsername,
  validateUsernameFormat,
  normalizeUsername,
};
