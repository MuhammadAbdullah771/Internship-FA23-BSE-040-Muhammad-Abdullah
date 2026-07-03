import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { DEMO_USERS, ROLES, getHomePath } from '../constants';

const STORAGE_KEY = 'internhub_auth';
const USERS_KEY = 'internhub_users';

const AuthContext = createContext(null);

function loadSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function loadRegisteredUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function getAllUsers() {
  return { ...DEMO_USERS, ...loadRegisteredUsers() };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => loadSession());
  const [registeredUsers, setRegisteredUsers] = useState(() => loadRegisteredUsers());

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(registeredUsers));
  }, [registeredUsers]);

  const login = useCallback((email, password, expectedRole) => {
    const normalized = email.toLowerCase().trim();
    const account = getAllUsers()[normalized];
    if (!account || account.password !== password) {
      return { success: false, error: 'Invalid email or password' };
    }
    if (expectedRole && account.role !== expectedRole) {
      return {
        success: false,
        error:
          expectedRole === ROLES.SUPERADMIN
            ? 'Access denied. Superadmin credentials required.'
            : 'This account cannot access the internship portal.',
      };
    }
    const session = {
      email: normalized,
      name: account.name,
      role: account.role,
      avatar: account.avatar,
    };
    setUser(session);
    return { success: true, redirect: getHomePath(account.role) };
  }, []);

  const signup = useCallback(({ firstName, lastName, email, password }) => {
    const normalized = email.toLowerCase().trim();
    const allUsers = { ...DEMO_USERS, ...registeredUsers };

    if (allUsers[normalized]) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const name = `${firstName.trim()} ${lastName.trim()}`;
    const newUser = {
      password,
      role: ROLES.STUDENT,
      name,
      avatar: `https://i.pravatar.cc/150?u=${encodeURIComponent(normalized)}`,
    };

    setRegisteredUsers((prev) => ({ ...prev, [normalized]: newUser }));
    setUser({
      email: normalized,
      name,
      role: ROLES.STUDENT,
      avatar: newUser.avatar,
    });

    return { success: true, redirect: getHomePath(ROLES.STUDENT) };
  }, [registeredUsers]);

  const logout = useCallback(() => setUser(null), []);

  const value = {
    user,
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
