import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, userService, LoginRequest, RegisterRequest } from '../services/userService';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<{ success: boolean; error?: string }>;
  register: (userData: RegisterRequest) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshBalance: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in on app start
    const token = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('user_data');
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
      }
    }
    
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginRequest): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const response = await userService.login(credentials);
      
      if (response.data) {
        setUser(response.data.user);
        localStorage.setItem('user_data', JSON.stringify(response.data.user));
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: response.error || 'Login failed' };
      }
    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  const register = async (userData: RegisterRequest): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    
    try {
      const response = await userService.register(userData);
      
      if (response.data) {
        setIsLoading(false);
        return { success: true };
      } else {
        setIsLoading(false);
        return { success: false, error: response.error || 'Registration failed' };
      }
    } catch (error) {
      setIsLoading(false);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'An unexpected error occurred' 
      };
    }
  };

  const logout = () => {
    userService.logout();
    setUser(null);
    localStorage.removeItem('user_data');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('user_data', JSON.stringify(updatedUser));
    }
  };

  const refreshBalance = async () => {
    if (!user) return;
    
    try {
      const response = await userService.getUserBalance(user.id);
      if (response.data) {
        updateUser({ balance: response.data.balance });
      }
    } catch (error) {
      console.error('Error refreshing balance:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateUser,
    refreshBalance,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
