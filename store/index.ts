// Export all stores
export * from './userStore';
export * from './settingsStore';
export * from './uiStore';

// Helper hooks for common store operations
import { useEffect } from 'react';
import { useUserStore } from './userStore';
import { useSettingsStore } from './settingsStore';

/**
 * Hook to initialize all stores with data from the backend
 * Use this in your root component
 */
export function useInitializeStores() {
  const fetchProfile = useUserStore((state) => state.fetchProfile);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  
  useEffect(() => {
    // Initialize all stores
    fetchProfile();
    loadSettings();
  }, [fetchProfile, loadSettings]);
}

/**
 * Reset all state when user logs out
 */
export function resetAllStores() {
  const clearUserState = useUserStore.getState().clearUserState;
  const resetUiState = useUserStore.getState().clearUserState;
  
  clearUserState();
  resetUiState();
  // Settings are not reset on logout
} 