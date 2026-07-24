import { useState } from 'react';
import { useSignIn, useSignUp } from '@clerk/clerk-react';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getClerkErrorMessage } from '../../utils/authValidation';

const PROVIDERS = [
  {
    strategy: 'oauth_google',
    label: 'Continue with Google',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M12 10.2v3.6h5.1c-.2 1.2-.9 2.3-1.9 3l3.1 2.4c1.8-1.7 2.9-4.1 2.9-7 0-.7-.1-1.3-.2-1.9H12z"
        />
        <path
          fill="#34A853"
          d="M6.6 14.3l-.7.5-2.3 1.8C5.4 19.3 8.5 21 12 21c2.4 0 4.4-.8 5.9-2.1l-3.1-2.4c-.8.6-1.9.9-2.8.9-2.2 0-4-1.5-4.7-3.4z"
        />
        <path
          fill="#4A90E2"
          d="M3.6 7.4C2.9 8.8 2.5 10.3 2.5 12s.4 3.2 1.1 4.6c0 .1 3.1-2.4 3.1-2.4-.2-.5-.3-1.1-.3-1.7s.1-1.2.3-1.7L3.6 7.4z"
        />
        <path
          fill="#FBBC05"
          d="M12 5.3c1.3 0 2.5.5 3.4 1.3l2.6-2.6C16.4 2.5 14.4 1.7 12 1.7 8.5 1.7 5.4 3.4 3.6 6.1l3.1 2.4C7.9 6.8 9.8 5.3 12 5.3z"
        />
      </svg>
    ),
  },
  {
    strategy: 'oauth_github',
    label: 'Continue with GitHub',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M12 2C6.5 2 2 6.6 2 12.3c0 4.5 2.9 8.3 6.9 9.6.5.1.7-.2.7-.5v-1.9c-2.8.6-3.4-1.4-3.4-1.4-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.6 2.4 1.1 3 .9.1-.7.4-1.1.6-1.4-2.2-.3-4.6-1.2-4.6-5.1 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.7 0 0 .8-.3 2.8 1 .8-.2 1.6-.3 2.4-.3s1.6.1 2.4.3c2-.1 2.8-1 2.8-1 .5 1.4.2 2.4.1 2.7.6.7 1 1.6 1 2.7 0 3.9-2.4 4.8-4.6 5.1.4.3.7.9.7 1.9v2.8c0 .3.2.6.7.5 4-1.3 6.9-5.1 6.9-9.6C22 6.6 17.5 2 12 2z" />
      </svg>
    ),
  },
  {
    strategy: 'oauth_apple',
    label: 'Continue with Apple',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
        <path d="M16.4 12.7c0-2.1 1.7-3.1 1.8-3.2-1-1.4-2.5-1.6-3-1.6-1.3-.1-2.5.8-3.1.8-.7 0-1.7-.7-2.8-.7-1.4 0-2.8.9-3.5 2.2-1.5 2.6-.4 6.4 1.1 8.5.7 1 1.6 2.2 2.8 2.1 1.1 0 1.5-.7 2.9-.7s1.7.7 2.9.7c1.2 0 2-1 2.7-2 .8-1.2 1.2-2.3 1.2-2.4-.1 0-2.2-.9-2.2-3.7zM14.4 6.5c.6-.7 1-1.7.9-2.7-1 .1-2.1.7-2.7 1.4-.6.7-1.1 1.7-1 2.7 1.1.1 2.1-.5 2.8-1.4z" />
      </svg>
    ),
  },
];

/**
 * Custom social buttons for InternShowcase pages.
 * Uses Clerk OAuth under the hood without Clerk's hosted UI.
 */
const SocialAuthButtons = ({ mode = 'signIn', disabled = false, onError }) => {
  const { isLoaded: signInLoaded, signIn } = useSignIn();
  const { isLoaded: signUpLoaded, signUp } = useSignUp();
  const [activeStrategy, setActiveStrategy] = useState('');

  const isReady = mode === 'signUp' ? signUpLoaded && signUp : signInLoaded && signIn;

  const handleSocial = async (strategy) => {
    if (!isReady || disabled) return;

    setActiveStrategy(strategy);
    onError?.('');

    try {
      const auth = mode === 'signUp' ? signUp : signIn;

      await auth.authenticateWithRedirect({
        strategy,
        redirectUrl: `${window.location.origin}/sso-callback`,
        redirectUrlComplete: `${window.location.origin}/dashboard`,
      });
    } catch (error) {
      setActiveStrategy('');
      onError?.(getClerkErrorMessage(error));
    }
  };

  return (
    <div className="space-y-3">
      {PROVIDERS.map((provider) => {
        const loading = activeStrategy === provider.strategy;

        return (
          <button
            key={provider.strategy}
            type="button"
            disabled={disabled || !isReady || Boolean(activeStrategy)}
            onClick={() => handleSocial(provider.strategy)}
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-line bg-white px-4 py-2.5 text-sm font-medium text-ink transition hover:bg-surface disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <LoadingSpinner size="sm" />
            ) : (
              provider.icon
            )}
            <span>{provider.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default SocialAuthButtons;
