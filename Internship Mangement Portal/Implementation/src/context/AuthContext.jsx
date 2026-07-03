import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ROLES, getHomePath } from '../constants';
import {
  loginUser,
  registerStudent,
  fetchCurrentUser,
  refreshSession,
  logoutUser,
} from '../services/authService';
import { hasStoredSession } from '../services/tokenStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function restoreSession() {
      if (!hasStoredSession()) {
        setIsLoading(false);
        return;
      }

      try {
        const currentUser = await fetchCurrentUser();
        if (!cancelled) setUser(currentUser);
      } catch {
        try {
          const currentUser = await refreshSession();
          if (!cancelled) setUser(currentUser);
        } catch {
          if (!cancelled) setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    restoreSession();
    return () => { cancelled = true; };
  }, []);

  const login = useCallback(async (email, password, expectedRole) => {
    const result = await loginUser({ email, password, expectedRole });
    if (!result.success) return result;

    setUser(result.user);
    return { success: true, redirect: getHomePath(result.user.role) };
  }, []);

  const signup = useCallback(async ({ firstName, lastName, email, password }) => {
    const result = await registerStudent({ firstName, lastName, email, password });
    if (!result.success) return result;

    setUser(result.user);
    return { success: true, redirect: getHomePath(ROLES.STUDENT) };
  }, []);

  const logout = useCallback(async () => {
    await logoutUser();
    setUser(null);
  }, []);

  const value = {
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    isSuperadmin: user?.role === ROLES.SUPERADMIN,
    isStudent: user?.role === ROLES.STUDENT,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
