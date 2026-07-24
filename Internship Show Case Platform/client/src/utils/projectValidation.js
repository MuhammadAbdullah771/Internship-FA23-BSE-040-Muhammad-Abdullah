export const PROJECT_CATEGORIES = [
  { value: 'web', label: 'Web' },
  { value: 'mobile', label: 'Mobile' },
  { value: 'ai-ml', label: 'AI / ML' },
  { value: 'devops', label: 'DevOps' },
  { value: 'design', label: 'Design' },
  { value: 'data', label: 'Data' },
  { value: 'other', label: 'Other' },
];

export const categoryLabel = (value) =>
  PROJECT_CATEGORIES.find((item) => item.value === value)?.label || value || 'Other';

const looksLikeUrl = (value) => {
  if (!value?.trim()) return true;
  try {
    // eslint-disable-next-line no-new
    new URL(value.trim());
    return true;
  } catch {
    return false;
  }
};

export const validateProjectForm = (form) => {
  const errors = {};

  if (!form.title?.trim()) errors.title = 'Title is required';
  else if (form.title.trim().length > 120) errors.title = 'Title is too long';

  if (!form.shortDescription?.trim()) {
    errors.shortDescription = 'Short description is required';
  } else if (form.shortDescription.trim().length > 280) {
    errors.shortDescription = 'Keep the short description under 280 characters';
  }

  if (!form.fullDescription?.trim()) {
    errors.fullDescription = 'Full description is required';
  } else if (form.fullDescription.trim().length < 40) {
    errors.fullDescription = 'Add a bit more detail (at least 40 characters)';
  }

  if (!form.category) errors.category = 'Choose a category';

  if (!looksLikeUrl(form.githubUrl)) {
    errors.githubUrl = 'Enter a valid GitHub URL';
  }

  if (!looksLikeUrl(form.liveDemoUrl)) {
    errors.liveDemoUrl = 'Enter a valid live demo URL';
  }

  if ((form.technologies || []).length > 25) {
    errors.technologies = 'You can add at most 25 technologies';
  }

  if ((form.tags || []).length > 20) {
    errors.tags = 'You can add at most 20 tags';
  }

  return errors;
};
