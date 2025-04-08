import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { AuthError, User, Session } from '@supabase/supabase-js';
import { router } from 'expo-router';
import SessionManager, { UserData } from '@/utils/sessionManager';
import { logError } from '@/utils/errorLogger';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: AuthError | null;
  isAuthenticated: boolean;
  isAuthStateReady: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, options?: { data?: { full_name?: string } }) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  const [isAuthStateReady, setIsAuthStateReady] = useState(false);

  // Initialize auth state from secure storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        setLoading(true);
        
        // First try to get session from secure storage
        const isValid = await SessionManager.isSessionValid();
        
        if (isValid) {
          // If we have a valid session in secure storage, use that
          const sessionData = await SessionManager.loadSession();
          const userData = await SessionManager.getUserData();
          
          if (sessionData?.authToken && userData) {
            // Set session in Supabase client
            await supabase.auth.setSession({
              access_token: sessionData.authToken,
              refresh_token: sessionData.refreshToken || '',
            });
            
            // Convert UserData to Supabase User format
            const user: User = {
              id: userData.id,
              email: userData.email,
              user_metadata: {
                full_name: userData.fullName,
              },
              app_metadata: {},
              aud: 'authenticated',
              created_at: '',
            };
            
            setUser(user);
            setIsAuthStateReady(true);
            setLoading(false);
            return;
          }
        }
        
        // If no valid session in secure storage, try to get from Supabase
        const { data: { session } } = await supabase.auth.getSession();
        handleSessionChange(session);
        
        // Subscribe to auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          handleSessionChange(session);
        });
        
        return () => subscription.unsubscribe();
      } catch (err) {
        logError({
          message: 'Failed to initialize authentication',
          error: err as Error,
        });
        setUser(null);
        setIsAuthStateReady(true);
        setLoading(false);
      }
    };
    
    initAuth();
  }, []);
  
  // Handle session changes and update secure storage
  const handleSessionChange = async (session: Session | null) => {
    try {
      if (session?.user) {
        // Save session to secure storage
        const userData: UserData = {
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name,
        };
        
        await SessionManager.saveUserData(userData);
        await SessionManager.saveSession({
          authToken: session.access_token,
          refreshToken: session.refresh_token,
          expiresAt: new Date(session.expires_at || '').getTime(),
          userData,
        });
        
        setUser(session.user);
      } else {
        setUser(null);
        
        // Clear session on logout or session expiry
        await SessionManager.clearSession();
      }
      
      setIsAuthStateReady(true);
      setLoading(false);
    } catch (err) {
      logError({
        message: 'Failed to handle session change',
        error: err as Error,
      });
      setUser(null);
      setIsAuthStateReady(true);
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      
      // Save session data to secure storage
      if (data.session) {
        const userData: UserData = {
          id: data.user.id,
          email: data.user.email || '',
          fullName: data.user.user_metadata?.full_name,
        };
        
        await SessionManager.saveUserData(userData);
        await SessionManager.saveSession({
          authToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: new Date(data.session.expires_at || '').getTime(),
          userData,
        });
      }
      
      router.replace('/(tabs)');
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    options?: { 
      data?: { 
        full_name?: string;
      } 
    }
  ) => {
    try {
      setError(null);
      setLoading(true);
      
      // Sign up the user
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: options?.data?.full_name || null,
          },
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      if (!signUpData.user) {
        throw new Error('No user data returned from signup');
      }
      
      // Check if email confirmation is required
      if (!signUpData.session) {
        // Redirect to email verification page
        router.push('/verify-email');
        return;
      }
      
      // Save session data to secure storage
      if (signUpData.session) {
        const userData: UserData = {
          id: signUpData.user.id,
          email: signUpData.user.email || '',
          fullName: signUpData.user.user_metadata?.full_name,
        };
        
        await SessionManager.saveUserData(userData);
        await SessionManager.saveSession({
          authToken: signUpData.session.access_token,
          refreshToken: signUpData.session.refresh_token,
          expiresAt: new Date(signUpData.session.expires_at || '').getTime(),
          userData,
        });
      }
      
      // If we have a session (email confirmation not required), proceed normally
      router.replace('/(tabs)');
    } catch (err) {
      setError(err as AuthError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      setLoading(true);
      
      // Clear session from supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear session from secure storage
      await SessionManager.clearSession();
      
      router.replace('/auth');
    } catch (err) {
      setError(err as AuthError);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    isAuthStateReady,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 