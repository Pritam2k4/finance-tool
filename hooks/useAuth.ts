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
  const [isLoading, setIsLoading] = useState<boolean>(true);

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
      const isValid = token === 'authenticated';
      setIsAuthenticated(isValid);
      console.log(`Auth check for ${user.name}: ${isValid ? 'authenticated' : 'not authenticated'}`);
    } catch (error) {
      console.error("Error reading auth status from localStorage:", error);
      setIsAuthenticated(false);
    }
    setIsLoading(false);
  }, [user, getAuthKey]);

  const login = (password: string): boolean => {
    if (!user) {
      console.log('No user provided to login');
      return false;
    }
    
    console.log(`Login attempt for ${user.name} with password: "${password}"`);
    console.log(`Expected password: "${user.passwordPlain}"`);
    
    // WARNING: This is insecure plain text password checking. For demo purposes only.
    if (password === user.passwordPlain) {
      const authKey = getAuthKey();
      try {
        localStorage.setItem(authKey, 'authenticated');
        setIsAuthenticated(true);
        console.log(`Login successful for ${user.name}`);
        return true;
      } catch (error) {
        console.error("Error setting auth status in localStorage:", error);
        return false;
      }
    } else {
      console.log(`Login failed for ${user.name}: password mismatch`);
      return false;
    }
  };

  const logout = (): void => {
    if (!user) return;
    const authKey = getAuthKey();
    try {
      localStorage.removeItem(authKey);
      setIsAuthenticated(false);
      console.log(`Logout successful for ${user.name}`);
    } catch (error) {
      console.error("Error removing auth status from localStorage:", error);
    }
  };

  return { isAuthenticated, login, logout, isLoading };
}

export default useAuth;