
import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';

const AUTH_KEY_PREFIX = 'user_auth_token_';

interface AuthHookResult {
  isAuthenticated: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  isLoading: boolean;
}

function useAuth(user: User | null): AuthHookResult {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // Check auth status on mount

  const getAuthKey = useCallback(() => user ? `${AUTH_KEY_PREFIX}${user.id}` : '', [user]);

  useEffect(() => {
    if (!user) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }
    const authKey = getAuthKey();
    try {
      const token = localStorage.getItem(authKey);
      if (token === 'authenticated') { // Simple token check
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error reading auth status from localStorage:", error);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [user, getAuthKey]);

  const login = (password: string): boolean => {
    if (!user) return false;
    // WARNING: This is insecure plain text password checking. For demo purposes only.
    // In a real app, use a secure authentication mechanism (e.g., OAuth, hashed passwords with a backend).
    if (password === user.passwordPlain) {
      const authKey = getAuthKey();
      try {
        localStorage.setItem(authKey, 'authenticated');
        setIsAuthenticated(true);
        return true;
      } catch (error) {
        console.error("Error setting auth status in localStorage:", error);
        return false;
      }
    }
    return false;
  };

  const logout = (): void => {
    if (!user) return;
    const authKey = getAuthKey();
    try {
      localStorage.removeItem(authKey);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Error removing auth status from localStorage:", error);
    }
  };

  return { isAuthenticated, login, logout, isLoading };
}

export default useAuth;
