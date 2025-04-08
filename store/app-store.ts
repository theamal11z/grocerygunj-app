import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Locale } from '@/lib/i18n';

/**
 * App theme type
 */
export type Theme = 'light' | 'dark' | 'system';

/**
 * Interface for the global app state 
 */
interface AppState {
  // User preferences
  theme: Theme;
  locale: Locale;
  isFirstLaunch: boolean;
  hasSeenOnboarding: boolean;
  
  // UI state
  isNetworkConnected: boolean;
  
  // Actions
  setTheme: (theme: Theme) => void;
  setLocale: (locale: Locale) => void;
  setIsFirstLaunch: (isFirstLaunch: boolean) => void;
  setHasSeenOnboarding: (hasSeenOnboarding: boolean) => void;
  setIsNetworkConnected: (isConnected: boolean) => void;
  
  // Reset state (for logout)
  resetState: () => void;
}

/**
 * Default state when app first launches
 */
const initialState = {
  theme: 'system' as Theme,
  locale: 'en' as Locale,
  isFirstLaunch: true,
  hasSeenOnboarding: false,
  isNetworkConnected: true,
};

/**
 * Create the global app store using Zustand with persistence
 * Following the .windsurfrules guidelines for state management
 */
export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial state
      ...initialState,
      
      // Actions
      setTheme: (theme) => set({ theme }),
      setLocale: (locale) => set({ locale }),
      setIsFirstLaunch: (isFirstLaunch) => set({ isFirstLaunch }),
      setHasSeenOnboarding: (hasSeenOnboarding) => set({ hasSeenOnboarding }),
      setIsNetworkConnected: (isConnected) => set({ isNetworkConnected: isConnected }),
      
      // Reset to initial state but preserve certain values
      resetState: () => set(state => ({ 
        ...initialState,
        theme: state.theme, // Preserve theme preference
        locale: state.locale, // Preserve language preference
        isFirstLaunch: false, // User has already launched the app
      })),
    }),
    {
      name: 'grocerygunj-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain state properties
      partialize: (state) => ({
        theme: state.theme,
        locale: state.locale,
        isFirstLaunch: state.isFirstLaunch,
        hasSeenOnboarding: state.hasSeenOnboarding,
      }),
    }
  )
);
