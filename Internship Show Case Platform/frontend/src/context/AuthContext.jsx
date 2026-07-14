import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { getCurrentUser, syncCurrentUser } from '../api/auth';
import { setAuthTokenGetter } from '../api/axios';
import PageLoader from '../components/ui/PageLoader';

const AuthContext = createContext(null);

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
      return getToken();
    });

    return () => setAuthTokenGetter(null);
  }, [getToken, isSignedIn]);

  const refreshAppUser = useCallback(async () => {
    if (!isSignedIn) {
      setAppUser(null);
      return null;
    }

    setIsSyncing(true);
    setAuthError('');

    try {
      await syncCurrentUser();
      const response = await getCurrentUser();
      const user = response.data?.data?.user || null;
      setAppUser(user);
      return user;
    } catch (error) {
      setAuthError(error.message || 'Failed to sync user session');
      setAppUser(null);
      return null;
    } finally {
      setIsSyncing(false);
    }
  }, [isSignedIn]);

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
