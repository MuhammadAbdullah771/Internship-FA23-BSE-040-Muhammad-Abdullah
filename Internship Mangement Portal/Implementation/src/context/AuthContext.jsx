import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
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

export function AuthProvider({ children }) {
  const { isLoaded: clerkLoaded, isSignedIn, getToken } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const { signOut } = useClerk();
  const [user, setUser] = useState(null);
  const [authMode, setAuthMode] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setClerkTokenGetter(() => getToken());
  }, [getToken]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      if (hasStoredSession()) {
        try {
          const appUser = await refreshStoredSession();
          if (!cancelled && appUser.role === ROLES.SUPERADMIN) {
            setUser(appUser);
            setAuthMode('admin');
            setIsLoading(false);
            return;
          }
          clearTokens();
        } catch {
          clearTokens();
        }
      }

      if (!clerkLoaded) return;

      if (!isSignedIn) {
        if (!cancelled) {
          setUser(null);
          setAuthMode(null);
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      try {
        const appUser = await fetchCurrentUser();
        if (cancelled) return;

        if (appUser.role === ROLES.SUPERADMIN) {
          await signOut();
          setUser(null);
          setAuthMode(null);
        } else {
          setUser(appUser);
          setAuthMode('clerk');
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          setAuthMode(null);
          await signOut();
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    bootstrap();
    return () => { cancelled = true; };
  }, [clerkLoaded, isSignedIn, clerkUser?.id, signOut]);

  const loginSuperadmin = useCallback(async ({ email, password }) => {
    if (isSignedIn) {
      await signOut();
    }

    const result = await loginWithPassword({
      email,
      password,
      expectedRole: ROLES.SUPERADMIN,
    });

    setUser(result.user);
    setAuthMode('admin');
    return result.user;
  }, [isSignedIn, signOut]);

  const logout = useCallback(async () => {
    if (authMode === 'admin') {
      await logoutSession();
      setUser(null);
      setAuthMode(null);
      return;
    }

    await signOut();
    setUser(null);
    setAuthMode(null);
  }, [authMode, signOut]);

  const refreshUser = useCallback(async () => {
    if (authMode === 'admin') {
      const appUser = await refreshStoredSession();
      setUser(appUser);
      return;
    }

    if (!isSignedIn) return;
    const appUser = await fetchCurrentUser();
    setUser(appUser);
  }, [authMode, isSignedIn]);

  const isAuthenticated = authMode === 'admin'
    ? Boolean(user)
    : Boolean(isSignedIn && user);

  const value = {
    user,
    authMode,
    isLoading: authMode === 'admin' ? isLoading : (!clerkLoaded || isLoading),
    isAuthenticated,
    isSuperadmin: user?.role === ROLES.SUPERADMIN,
    isStudent: user?.role === ROLES.STUDENT,
    loginSuperadmin,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
