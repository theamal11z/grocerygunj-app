import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import type { AuthError, User, Session } from '@supabase/supabase-js';
import { router } from 'expo-router';
import { useUserStore } from '@/store';
import { showToast } from '@/components/Toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
  signIn: (email: string, password: string) => Promise<{ success: boolean }>;
  signUp: (email: string, password: string, options?: { data?: { full_name?: string } }) => Promise<{ success: boolean; requiresEmailVerification: boolean }>;
  signOut: () => Promise<void>;
  navigateAfterAuth: (route?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError | null>(null);
  
  // Get Zustand store actions
  const { 
    setProfile, 
    setAuthenticated, 
    fetchProfile, 
    clearUserState 
  } = useUserStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setSession(session);
      setAuthenticated(!!session);
      setLoading(false);
      
      // If we have a session, fetch the user profile
      if (session) {
        fetchProfile();
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSession(session);
      setAuthenticated(!!session);
      setLoading(false);
      
      // If authentication state changes, update the profile
      if (session) {
        fetchProfile();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      const { error, data } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      
      // Set authenticated in our Zustand store
      setAuthenticated(true);
      
      // Fetch user profile
      await fetchProfile();
      
      showToast('Successfully signed in', 'success');
      return { success: true };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      showToast(authError.message || 'Failed to sign in', 'error');
      return { success: false };
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
      const requiresEmailVerification = !signUpData.session;
      
      // If no email verification is required, set as authenticated
      if (!requiresEmailVerification) {
        setAuthenticated(true);
        await fetchProfile();
        showToast('Successfully signed up', 'success');
      } else {
        showToast('Please check your email to verify your account', 'info');
      }
      
      return { 
        success: true, 
        requiresEmailVerification 
      };
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      showToast(authError.message || 'Failed to sign up', 'error');
      return { 
        success: false, 
        requiresEmailVerification: false 
      };
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Clear user state from Zustand store
      clearUserState();
      
      showToast('Successfully signed out', 'success');
    } catch (err) {
      const authError = err as AuthError;
      setError(authError);
      showToast(authError.message || 'Failed to sign out', 'error');
    }
  };

  const navigateAfterAuth = (route?: string) => {
    if (route) {
      router.replace(route as any);
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    navigateAfterAuth,
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