import { useCallback } from 'react';
import { useSettingsStore } from '@/store';
import { useAnimationConfig } from '@/lib/AnimationConfig';

export function useSettings() {
  const { 
    settings, 
    loading, 
    error, 
    loadSettings, 
    updateDeliverySettings 
  } = useSettingsStore();

  const { 
    animationsEnabled, 
    toggleAnimations, 
    setAnimationsEnabled 
  } = useAnimationConfig();

  const refreshSettings = useCallback(async () => {
    await loadSettings();
  }, [loadSettings]);

  // For backward compatibility, extract deliverySettings from the store
  return {
    deliverySettings: settings.deliverySettings,
    loading,
    error,
    refreshSettings,
    updateDeliverySettings,
    // Animation settings
    animationsEnabled,
    toggleAnimations,
    setAnimationsEnabled
  };
} 