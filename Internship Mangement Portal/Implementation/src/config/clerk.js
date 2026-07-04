const PLACEHOLDER_PATTERN = /your_publishable_key|your_secret_key|replace_me|xxx/i;

export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY || '';

export function isClerkConfigured() {
  return Boolean(
    clerkPublishableKey
    && clerkPublishableKey.startsWith('pk_')
    && !PLACEHOLDER_PATTERN.test(clerkPublishableKey),
  );
}

export const clerkAppearance = {
  variables: {
    colorPrimary: '#059669',
    colorText: '#111827',
    colorTextSecondary: '#6b7280',
    borderRadius: '0.75rem',
    fontFamily: 'inherit',
  },
  elements: {
    rootBox: 'w-full',
    card: 'shadow-none border-0 p-0 w-full',
    headerTitle: 'text-gray-900 font-bold',
    headerSubtitle: 'text-gray-500',
    formButtonPrimary:
      'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20',
    footerActionLink: 'text-emerald-600 hover:text-emerald-500 font-semibold',
    socialButtonsBlockButton: 'border-gray-200 hover:bg-gray-50',
  },
};
