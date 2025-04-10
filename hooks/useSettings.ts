import { useCallback } from 'react';
import { useSettingsStore } from '@/store';

export function useSettings() {
  const { 
    settings, 
    loading, 
    error, 
    loadSettings, 
    updateDeliverySettings 
  } = useSettingsStore();

  const refreshSettings = useCallback(async () => {
    await loadSettings();
  }, [loadSettings]);

  // For backward compatibility, extract deliverySettings from the store
  return {
    deliverySettings: settings.deliverySettings,
    loading,
    error,
    refreshSettings,
    updateDeliverySettings
  };
} 