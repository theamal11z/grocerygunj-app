import { useCallback, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage key for animation settings
const ANIMATION_ENABLED_KEY = 'animation_enabled';

// Default to enabled animations
let globalAnimationsEnabled = true;

/**
 * Utility to control global animation state
 */
export const AnimationConfig = {
  // Check if animations are enabled
  isEnabled: () => globalAnimationsEnabled,
  
  // Set animation state (for direct imperative use)
  setEnabled: (enabled: boolean) => {
    globalAnimationsEnabled = enabled;
    // Persist the setting
    AsyncStorage.setItem(ANIMATION_ENABLED_KEY, JSON.stringify(enabled))
      .catch(err => console.error('Failed to save animation settings', err));
  },
  
  // Toggle animation state
  toggle: () => {
    const newState = !globalAnimationsEnabled;
    AnimationConfig.setEnabled(newState);
    return newState;
  },
  
  // Initialize from storage
  init: async () => {
    try {
      const storedValue = await AsyncStorage.getItem(ANIMATION_ENABLED_KEY);
      if (storedValue !== null) {
        globalAnimationsEnabled = JSON.parse(storedValue);
      }
    } catch (error) {
      console.error('Failed to load animation settings', error);
    }
  }
};

/**
 * Hook to use and control animation settings in components
 */
export function useAnimationConfig() {
  const [animationsEnabled, setAnimationsEnabled] = useState(globalAnimationsEnabled);
  
  // Load saved animation state on mount
  useEffect(() => {
    const loadSetting = async () => {
      try {
        const storedValue = await AsyncStorage.getItem(ANIMATION_ENABLED_KEY);
        if (storedValue !== null) {
          const enabled = JSON.parse(storedValue);
          globalAnimationsEnabled = enabled;
          setAnimationsEnabled(enabled);
        }
      } catch (error) {
        console.error('Failed to load animation settings', error);
      }
    };
    
    loadSetting();
  }, []);
  
  // Toggle animations
  const toggleAnimations = useCallback(() => {
    const newState = !animationsEnabled;
    globalAnimationsEnabled = newState;
    setAnimationsEnabled(newState);
    
    // Persist the setting
    AsyncStorage.setItem(ANIMATION_ENABLED_KEY, JSON.stringify(newState))
      .catch(err => console.error('Failed to save animation settings', err));
    
    return newState;
  }, [animationsEnabled]);
  
  return {
    animationsEnabled,
    toggleAnimations,
    setAnimationsEnabled: (enabled: boolean) => {
      globalAnimationsEnabled = enabled;
      setAnimationsEnabled(enabled);
      AsyncStorage.setItem(ANIMATION_ENABLED_KEY, JSON.stringify(enabled))
        .catch(err => console.error('Failed to save animation settings', err));
    }
  };
}

// Initialize from storage when module loads
AnimationConfig.init(); 