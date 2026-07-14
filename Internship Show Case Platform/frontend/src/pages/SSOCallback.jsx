import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react';
import PageLoader from '../components/ui/PageLoader';

/**
 * Completes OAuth redirect for Google / GitHub / Apple.
 * No Clerk hosted auth UI — only finishes the callback after the provider.
 */
const SSOCallback = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <PageLoader message="Finishing sign-in..." />
      <AuthenticateWithRedirectCallback />
    </div>
  );
};

export default SSOCallback;
