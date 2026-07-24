import { ClerkProvider } from '@clerk/clerk-react';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './components/ui/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import AppRoutes from './routes/AppRoutes';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const MissingClerkKey = () => (
  <div className="flex min-h-screen items-center justify-center bg-surface px-4">
    <div className="max-w-lg rounded-2xl border border-line bg-white p-8 text-center shadow-sm">
      <h1 className="font-display text-2xl font-semibold text-ink">
        Authentication is not configured
      </h1>
      <p className="mt-3 text-sm leading-relaxed text-muted">
        Add your Clerk publishable and secret keys to the frontend and backend
        environment files, then restart the servers.
      </p>
    </div>
  </div>
);

function App() {
  if (!publishableKey || publishableKey.includes('your_publishable_key')) {
    return <MissingClerkKey />;
  }

  return (
    <ErrorBoundary>
      <ClerkProvider
        publishableKey={publishableKey}
        afterSignOutUrl="/"
        signInUrl="/login"
        signUpUrl="/register"
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
        signInForceRedirectUrl="/dashboard"
        signUpForceRedirectUrl="/dashboard"
      >
        <BrowserRouter>
          <AuthProvider>
            <ToastProvider>
              <AppRoutes />
            </ToastProvider>
          </AuthProvider>
        </BrowserRouter>
      </ClerkProvider>
    </ErrorBoundary>
  );
}

export default App;
