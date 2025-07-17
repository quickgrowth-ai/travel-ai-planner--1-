import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { AuthAPI, SignUpData, LoginData } from '@/lib/auth';

interface User {
  id: string;
  email: string;
  name: string;
  provider: string;
  profilePicture?: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: LoginData) => Promise<void>;
  signup: (data: SignUpData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let mounted = true;
    
    const initializeAuth = async () => {
      try {
        // Check for existing session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
        } else if (session?.user && mounted) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email || '',
            provider: session.user.app_metadata?.provider || 'email'
          };
          setUser(userData);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };
    
    initializeAuth();
    
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        
        if (!mounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          const userData: User = {
            id: session.user.id,
            email: session.user.email || '',
            name: session.user.user_metadata?.name || session.user.email || '',
            provider: session.user.app_metadata?.provider || 'email'
          };
          setUser(userData);
          setIsAuthenticated(true);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          setIsAuthenticated(false);
        }
        setLoading(false);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = async (data: LoginData): Promise<void> => {
    setLoading(true);
    try {
      const result = await AuthAPI.login(data);
      
      if (result.error) {
        throw new Error(result.error.message || 'Login failed');
      }
      
      // User state will be updated by the auth state change listener
    } catch (error) {
      console.error('Login error:', error);
      setLoading(false);
      throw error;
    }
  };

  const signup = async (data: SignUpData): Promise<void> => {
    setLoading(true);
    try {
      const result = await AuthAPI.signup(data);
      
      if (result.error) {
        throw new Error(result.error.message || 'Signup failed');
      }
      
      // User state will be updated by the auth state change listener
    } catch (error) {
      console.error('Signup error:', error);
      setLoading(false);
      throw error;
    }
  };

  const updateUser = async (userData: User): Promise<void> => {
    setUser(userData);
  };

  const logout = async (): Promise<void> => {
    const { error } = await AuthAPI.logout();
    if (error) {
      console.error('Logout error:', error);
    }
    // User state will be updated by the auth state change listener
  };

  const value = {
    user,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;