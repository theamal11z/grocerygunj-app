import { useState, useEffect } from 'react';
import i18n, { t, saveLocale, getAvailableLocales } from '@/lib/i18n';
import { useAppState } from './useAppState';
import * as Localization from 'expo-localization';

export function useTranslation() {
  // Make it optional to handle cases where AppStateProvider isn't available yet
  let appState = { preferences: { currency: 'INR' } };
  
  try {
    // Try to use AppState, but don't fail if not available
    const { state } = useAppState();
    appState = state;
  } catch (error) {
    // Silently handle the error when AppStateProvider isn't available
    console.log('AppStateProvider not available, using defaults');
  }
  
  const [locale, setLocale] = useState(i18n.locale);
  const [isRTL, setIsRTL] = useState(Localization.isRTL);
  
  // Get available locales
  const availableLocales = getAvailableLocales();
  
  // Change locale
  const changeLocale = async (newLocale: string) => {
    if (availableLocales.includes(newLocale)) {
      await saveLocale(newLocale);
      setLocale(newLocale);
      
      // Check if the new locale is RTL
      const rtlLocales = ['ar', 'he', 'ur', 'fa'];
      const localePrefix = newLocale.split('-')[0];
      setIsRTL(rtlLocales.includes(localePrefix));
    }
  };
  
  // Return the translation function and locale utilities
  return {
    t, // Translation function
    locale, // Current locale
    changeLocale, // Function to change locale
    availableLocales, // List of available locales
    isRTL, // Whether the current locale is RTL,
    currency: appState.preferences.currency // Currency from app state
  };
}
