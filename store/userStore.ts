import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';
import { Profile } from '@/lib/database.types';

interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  language: string;
}

interface UserState {
  // User data
  profile: Profile | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: Error | null;
  
  // User preferences
  preferences: UserPreferences;
  
  // User actions
  setProfile: (profile: Profile | null) => void;
  setAuthenticated: (value: boolean) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  
  // User operations
  fetchProfile: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
  clearUserState: () => void;
}

const defaultPreferences: UserPreferences = {
  theme: 'system',
  notificationsEnabled: true,
  language: 'en',
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // Initial state
      profile: null,
      isAuthenticated: false,
      loading: false,
      error: null,
      preferences: defaultPreferences,
      
      // State setters
      setProfile: (profile) => set({ profile }),
      setAuthenticated: (value) => set({ isAuthenticated: value }),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      updatePreferences: (preferences) => 
        set((state) => ({ 
          preferences: { ...state.preferences, ...preferences } 
        })),
      
      // Operations
      fetchProfile: async () => {
        const { setLoading, setError, setProfile } = get();
        try {
          setLoading(true);
          setError(null);
          
          const { data: { user } } = await supabase.auth.getUser();
          
          if (!user) {
            setProfile(null);
            return;
          }
          
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (error) throw new Error(error.message);
          
          setProfile(data);
        } catch (error) {
          setError(error instanceof Error ? error : new Error('Failed to fetch profile'));
          console.error('Error fetching profile:', error);
        } finally {
          setLoading(false);
        }
      },
      
      updateProfile: async (updates) => {
        const { setLoading, setError, profile, setProfile } = get();
        
        if (!profile) {
          setError(new Error('No profile to update'));
          return;
        }
        
        try {
          setLoading(true);
          setError(null);
          
          const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', profile.id)
            .select()
            .single();
            
          if (error) throw new Error(error.message);
          
          setProfile(data);
        } catch (error) {
          setError(error instanceof Error ? error : new Error('Failed to update profile'));
          console.error('Error updating profile:', error);
        } finally {
          setLoading(false);
        }
      },
      
      clearUserState: () => set({
        profile: null,
        isAuthenticated: false,
        error: null,
        preferences: defaultPreferences,
      }),
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain parts of the state
      partialize: (state) => ({
        preferences: state.preferences,
        profile: state.profile,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
); 