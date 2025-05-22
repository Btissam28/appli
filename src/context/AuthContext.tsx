import React, { createContext, useState, useContext, useEffect } from 'react';
import { User } from '../types';
import usersData from '../data/users.json';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for saved authentication on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('bolt_auth');
    if (savedAuth) {
      try {
        const { userId } = JSON.parse(savedAuth);
        const foundUser = usersData.users.find(u => u.id === userId);
        if (foundUser) {
          setUser(foundUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error restoring authentication:', error);
        localStorage.removeItem('bolt_auth');
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would validate against a backend
    // Here we're just checking if email matches our mock user
    const foundUser = usersData.users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      
      // Save auth state to localStorage
      localStorage.setItem('bolt_auth', JSON.stringify({ 
        userId: foundUser.id,
        loggedInAt: new Date().toISOString()
      }));
      
      return true;
    }
    
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // In a real app, this would create a new user in the backend
    // Here we'll just pretend it worked and log in as our mock user
    const foundUser = usersData.users[0];
    
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      
      // Save auth state to localStorage
      localStorage.setItem('bolt_auth', JSON.stringify({ 
        userId: foundUser.id,
        loggedInAt: new Date().toISOString()
      }));
      
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('bolt_auth');
  };

  const updateUserProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      
      // In a real app, this would send the update to a backend
      console.log('User profile updated:', updatedUser);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      login, 
      signup, 
      logout,
      updateUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};