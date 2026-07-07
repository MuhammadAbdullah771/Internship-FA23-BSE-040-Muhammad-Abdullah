import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import ClerkSetupRequired from './pages/ClerkSetupRequired';
import { clerkPublishableKey, isClerkConfigured } from './config/clerk';
import { ROUTES } from './constants';
import './styles/index.css';

const root = createRoot(document.getElementById('root'));

if (!isClerkConfigured()) {
  root.render(
    <StrictMode>
      <ClerkSetupRequired />
    </StrictMode>,
  );
} else {
  root.render(
    <StrictMode>
      <ClerkProvider
        publishableKey={clerkPublishableKey}
        afterSignOutUrl={ROUTES.LANDING}
        signInFallbackRedirectUrl={ROUTES.STUDENT.AUTH_CALLBACK}
        signUpFallbackRedirectUrl={ROUTES.STUDENT.AUTH_CALLBACK}
      >
        <App />
      </ClerkProvider>
    </StrictMode>,
  );
}
