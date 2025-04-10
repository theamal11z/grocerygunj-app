import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { supabase } from '@/lib/supabase';

// Types
export interface DeliverySettings {
  deliveryFee: number;
  freeDeliveryThreshold: number | null;
  enableFreeDelivery: boolean;
}

export interface AppSettings {
  deliverySettings: DeliverySettings;
  // Add other app settings here as needed
  version: string;
  dateFormat: string;
  currencySymbol: string;
}

interface SettingsState {
  // Settings data
  settings: AppSettings;
  initialized: boolean;
  loading: boolean;
  error: Error | null;
  
  // Actions
  setSettings: (settings: AppSettings) => void;
  updateDeliverySettings: (settings: Partial<DeliverySettings>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  
  // Operations
  loadSettings: () => Promise<void>;
  saveSettings: () => Promise<void>;
}

// Default settings
const defaultSettings: AppSettings = {
  deliverySettings: {
    deliveryFee: 40,
    freeDeliveryThreshold: null,
    enableFreeDelivery: false,
  },
  version: '1.0.0',
  dateFormat: 'MMM d, yyyy',
  currencySymbol: '₹',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: defaultSettings,
      initialized: false,
      loading: false,
      error: null,
      
      // Actions
      setSettings: (settings) => set({ settings }),
      updateDeliverySettings: (deliveryUpdates) => 
        set((state) => ({
          settings: {
            ...state.settings,
            deliverySettings: {
              ...state.settings.deliverySettings,
              ...deliveryUpdates,
            },
          },
        })),
      setLoading: (loading) => set({ loading }),
      setError: (error) => set({ error }),
      
      // Operations
      loadSettings: async () => {
        const { setLoading, setError, setSettings } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          // First try to load from database
          const { data, error } = await supabase
            .from('settings')
            .select('settings_data')
            .limit(1)
            .single();
          
          if (error) {
            // Check if it's because no settings exist
            if (error.code === 'PGRST116') {
              console.log('No settings found, creating default settings');
              await get().saveSettings();
              return;
            }
            throw new Error(`Error fetching settings: ${error.message}`);
          }
          
          // Process the settings data
          if (data?.settings_data) {
            const loadedSettings: AppSettings = {
              ...defaultSettings,
              ...data.settings_data,
              // Ensure deliverySettings is properly handled
              deliverySettings: {
                ...defaultSettings.deliverySettings,
                ...data.settings_data.deliverySettings,
              },
            };
            
            setSettings(loadedSettings);
          } else {
            // If settings_data is null or undefined, save defaults
            await get().saveSettings();
          }
          
          set({ initialized: true });
        } catch (error) {
          setError(error instanceof Error ? error : new Error('Unknown error occurred'));
          console.error('Error loading settings:', error);
        } finally {
          setLoading(false);
        }
      },
      
      saveSettings: async () => {
        const { setLoading, setError, settings } = get();
        
        try {
          setLoading(true);
          setError(null);
          
          // Check if settings record exists
          const { data: settingsRecord } = await supabase
            .from('settings')
            .select('id')
            .limit(1)
            .maybeSingle();
          
          if (settingsRecord) {
            // Update existing settings
            await supabase
              .from('settings')
              .update({ settings_data: settings })
              .eq('id', settingsRecord.id);
          } else {
            // Create new settings
            await supabase
              .from('settings')
              .insert({ settings_data: settings });
          }
          
          set({ initialized: true });
        } catch (error) {
          setError(error instanceof Error ? error : new Error('Failed to save settings'));
          console.error('Error saving settings:', error);
        } finally {
          setLoading(false);
        }
      },
    }),
    {
      name: 'app-settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist the settings state, not loading or error states
      partialize: (state) => ({ 
        settings: state.settings,
        initialized: state.initialized
      }),
    }
  )
); 