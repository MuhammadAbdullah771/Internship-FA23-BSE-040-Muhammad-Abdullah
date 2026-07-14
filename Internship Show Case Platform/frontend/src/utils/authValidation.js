export const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email.trim());

export const validateLoginForm = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
};

export const validateRegisterForm = ({ fullName, email, password, confirmPassword }) => {
  const errors = {};

  if (!fullName.trim()) {
    errors.fullName = 'Full name is required';
  } else if (fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters';
  }

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(email)) {
    errors.email = 'Enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  }

  if (!confirmPassword) {
    errors.confirmPassword = 'Please confirm your password';
  } else if (password !== confirmPassword) {
    errors.confirmPassword = 'Passwords do not match';
  }

  return errors;
};

export const getClerkErrorMessage = (err) => {
  if (!err) return 'Authentication failed. Please try again.';

  const first =
    err.errors?.[0]?.longMessage ||
    err.errors?.[0]?.message ||
    err.message;

  return first || 'Authentication failed. Please try again.';
};

export const splitFullName = (fullName) => {
  const parts = fullName.trim().split(/\s+/);
  const firstName = parts[0] || '';
  const lastName = parts.slice(1).join(' ') || '';
  return { firstName, lastName };
};
