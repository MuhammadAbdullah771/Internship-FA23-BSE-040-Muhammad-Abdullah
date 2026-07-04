import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth, useClerk } from '@clerk/clerk-react';
import { ROLES } from '../constants';
import { fetchCurrentUser } from '../services/authService';
import { setClerkTokenGetter } from '../services/api';

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setClerkTokenGetter(() => getToken());
  }, [getToken]);

  useEffect(() => {
    let cancelled = false;

    async function loadAppUser() {
      if (!clerkLoaded) return;

      if (!isSignedIn) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const appUser = await fetchCurrentUser();
        if (!cancelled) setUser(appUser);
      } catch {
        if (!cancelled) {
          setUser(null);
          await signOut();
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadAppUser();
    return () => { cancelled = true; };
  }, [clerkLoaded, isSignedIn, clerkUser?.id, signOut]);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
  }, [signOut]);

  const refreshUser = useCallback(async () => {
    if (!isSignedIn) return;
    const appUser = await fetchCurrentUser();
    setUser(appUser);
  }, [isSignedIn]);

  const value = {
    user,
    isLoading: !clerkLoaded || isLoading,
    isAuthenticated: Boolean(isSignedIn && user),
    isSuperadmin: user?.role === ROLES.SUPERADMIN,
    isStudent: user?.role === ROLES.STUDENT,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
