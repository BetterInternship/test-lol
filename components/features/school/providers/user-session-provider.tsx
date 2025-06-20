import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
interface User {
  username: string;
  name?: string;
}

interface SessionContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, pass: string) => void;
  logout: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USERNAME = 'session_username';
const LOCAL_STORAGE_KEY_PASSWORD = 'session_password'; // Storing passwords in localStorage is insecure for real apps

interface UserSessionProviderProps {
  children: ReactNode;
}

export const UserSessionProvider: React.FC<UserSessionProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem(LOCAL_STORAGE_KEY_USERNAME);
    // We check for username to determine if session exists.
    // Password is not directly used for this check here but stored alongside.
    if (storedUsername) {
      setUser({ username: storedUsername });
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const login = (username: string, pass: string) => {
    localStorage.setItem(LOCAL_STORAGE_KEY_USERNAME, username);
    localStorage.setItem(LOCAL_STORAGE_KEY_PASSWORD, pass); // Again, highly insecure for production
    setUser({ username });
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY_USERNAME);
    localStorage.removeItem(LOCAL_STORAGE_KEY_PASSWORD);
    setUser(null);
    setIsAuthenticated(false);
    router.push('/');
  };

  return (
    <SessionContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = (): SessionContextType => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a UserSessionProvider');
  }
  return context;
};