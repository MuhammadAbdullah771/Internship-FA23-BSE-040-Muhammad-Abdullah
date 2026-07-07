import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
import { ROLES } from '../constants';
import {
  fetchCurrentUser,
  loginWithPassword,
  logoutSession,
  refreshStoredSession,
} from '../services/authService';
import { setClerkTokenGetter } from '../services/api';
import { hasStoredSession, clearTokens } from '../services/tokenStorage';

const AuthContext = createContext(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

async function waitForClerkToken(getToken, attempts = 15, delayMs = 200) {
  for (let index = 0; index < attempts; index += 1) {
    const token = await getToken({ skipCache: true }).catch(() => null);
    if (token) return token;
    if (index < attempts - 1) {
      await new Promise((resolve) => { setTimeout(resolve, delayMs); });
    }
  }
  return null;
}

export function AuthProvider({ children }) {
  const { isLoaded: clerkLoaded, isSignedIn, getToken } = useClerkAuth();
  const { signOut } = useClerk();
  const getTokenRef = useRef(getToken);
  const signOutRef = useRef(signOut);

  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [syncStatus, setSyncStatus] = useState('pending');
  const [syncError, setSyncError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  getTokenRef.current = getToken;
  signOutRef.current = signOut;

  useEffect(() => {
    setClerkTokenGetter(async () => {
      if (!isSignedIn) return null;
      return getTokenRef.current({ skipCache: true }).catch(() => null);
    });
  }, [isSignedIn]);

  const syncClerkSession = useCallback(async () => {
    clearTokens();

    const token = await waitForClerkToken((opts) => getTokenRef.current(opts));
    if (!token) {
      throw new Error('Clerk session token unavailable');
    }

    const appUser = await fetchCurrentUser(token);

    if (appUser.role === ROLES.SUPERADMIN) {
      await signOutRef.current();
      throw new Error('Superadmin accounts must use the admin login');
    }

    setUser(appUser);
    setAuthMode('clerk');
    setSyncStatus('synced');
    setSyncError('');
    return appUser;
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (hasStoredSession()) {
        try {
          const appUser = await refreshStoredSession();
          if (!cancelled && appUser.role === ROLES.SUPERADMIN) {
            setUser(appUser);
            setAuthMode('admin');
            setSyncStatus('synced');
            setIsLoading(false);
            return;
          }
        } catch {
          // continue to Clerk flow
        }
        clearTokens();
      }

      if (!clerkLoaded) return;

      if (!isSignedIn) {
        if (!cancelled) {
          setUser(null);
          setAuthMode(null);
          setSyncStatus('pending');
          setIsLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setIsLoading(true);
        setSyncStatus('syncing');
      }

      try {
        await syncClerkSession();
      } catch (error) {
        if (!cancelled) {
          setUser(null);
          setAuthMode(null);
          setSyncStatus('error');
          setSyncError(error?.message || 'Failed to sync portal profile');
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    bootstrap();
    return () => { cancelled = true; };
  }, [clerkLoaded, isSignedIn, syncClerkSession]);

  const loginSuperadmin = useCallback(async ({ email, password }) => {
    if (isSignedIn) {
      await signOutRef.current();
    }

    const result = await loginWithPassword({
      email,
      password,
      expectedRole: ROLES.SUPERADMIN,
    });

    setUser(result.user);
    setAuthMode('admin');
    setSyncStatus('synced');
    return result.user;
  }, [isSignedIn]);

  const logout = useCallback(async () => {
    if (authMode === 'admin') {
      await logoutSession();
      setUser(null);
      setAuthMode(null);
      setSyncStatus('pending');
      return;
    }

    await signOutRef.current();
    setUser(null);
    setAuthMode(null);
    setSyncStatus('pending');
  }, [authMode]);

  const refreshUser = useCallback(async () => {
    if (authMode === 'admin') {
      const appUser = await refreshStoredSession();
      setUser(appUser);
      return;
    }

    if (!isSignedIn) return;
    setSyncStatus('syncing');
    try {
      await syncClerkSession();
    } catch (error) {
      setSyncStatus('error');
      setSyncError(error?.message || 'Failed to sync portal profile');
    }
  }, [authMode, isSignedIn, syncClerkSession]);

  const retrySync = useCallback(async () => {
    if (!isSignedIn) return;
    setIsLoading(true);
    setSyncStatus('syncing');
    setSyncError('');
    try {
      await syncClerkSession();
    } catch (error) {
      setSyncStatus('error');
      setSyncError(error?.message || 'Failed to sync portal profile');
    } finally {
      setIsLoading(false);
    }
  }, [isSignedIn, syncClerkSession]);

  const isClerkSignedIn = Boolean(isSignedIn);
  const isAuthenticated = authMode === 'admin'
    ? Boolean(user)
    : syncStatus === 'synced' && Boolean(user);

  const value = {
    user,
    authMode,
    syncStatus,
    syncError,
    isLoading: authMode === 'admin'
      ? isLoading
      : (!clerkLoaded || isLoading || (isClerkSignedIn && syncStatus === 'syncing')),
    isAuthenticated,
    isClerkSignedIn,
    isSuperadmin: user?.role === ROLES.SUPERADMIN,
    isStudent: user?.role === ROLES.STUDENT,
    loginSuperadmin,
    logout,
    refreshUser,
    retrySync,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
