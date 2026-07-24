import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import api, { setAuthTokenGetter } from '../api/axios';
import PageLoader from '../components/ui/PageLoader';

const AuthContext = createContext(null);

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const isRetryableSyncError = (error) => {
  const status = error?.status || error?.response?.status;
  const message = String(error?.message || '');
  if (message.includes('token-not-active-yet') || message.includes('not-active')) {
    return true;
  }
  if (!status) return true;
  return [408, 429, 500, 502, 503, 504].includes(status);
};

export const AuthProvider = ({ children }) => {
  const { isLoaded, isSignedIn, getToken, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const { openUserProfile } = useClerk();

  const [appUser, setAppUser] = useState(null);
  const [authError, setAuthError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setAuthTokenGetter(async () => {
      if (!isSignedIn) return null;
      try {
        return await getToken();
      } catch {
        return null;
      }
    });

    return () => setAuthTokenGetter(null);
  }, [getToken, isSignedIn]);

  const refreshAppUser = useCallback(async () => {
    if (!isSignedIn) {
      setAppUser(null);
      setAuthError('');
      return null;
    }

    setIsSyncing(true);
    setAuthError('');

    let lastError = null;

    for (let attempt = 0; attempt < 5; attempt += 1) {
      try {
        const token = await getToken();
        if (!token) {
          throw Object.assign(new Error('Session token not ready yet'), {
            status: 401,
          });
        }

        const headers = { Authorization: `Bearer ${token}` };

        await api.post('/auth/sync', {}, { headers });
        const response = await api.get('/auth/me', { headers });
        const user = response.data?.data?.user || null;

        setAppUser(user);
        setAuthError('');
        setIsSyncing(false);
        return user;
      } catch (error) {
        lastError = error;
        if (!isRetryableSyncError(error) || attempt === 4) break;
        const message = String(error?.message || '');
        const delay = message.includes('token-not-active')
          ? 1500 * (attempt + 1)
          : 500 * (attempt + 1);
        await wait(delay);
      }
    }

    const status = lastError?.status || lastError?.response?.status;
    const message =
      status === 502 || status === 503
        ? 'API is restarting or unavailable. Please try again in a moment.'
        : lastError?.message || 'Failed to sync user session';

    setAuthError(message);
    setAppUser(null);
    setIsSyncing(false);
    return null;
  }, [getToken, isSignedIn]);

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setAppUser(null);
      setAuthError('');
      return;
    }

    refreshAppUser();
  }, [isLoaded, isSignedIn, clerkUser?.id, refreshAppUser]);

  const logout = useCallback(async () => {
    setAppUser(null);
    setAuthError('');
    await signOut({ redirectUrl: '/' });
  }, [signOut]);

  const value = useMemo(
    () => ({
      isLoaded,
      isSignedIn: Boolean(isSignedIn),
      isSyncing,
      clerkUser,
      appUser,
      authError,
      refreshAppUser,
      logout,
      openUserProfile,
    }),
    [
      isLoaded,
      isSignedIn,
      isSyncing,
      clerkUser,
      appUser,
      authError,
      refreshAppUser,
      logout,
      openUserProfile,
    ]
  );

  if (!isLoaded) {
    return <PageLoader message="Preparing secure session..." />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
