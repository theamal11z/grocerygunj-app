import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import translations
import en from '@/locales/en.json';
import hi from '@/locales/hi.json';

// Define supported locales
export type Locale = 'en' | 'hi';

// Create i18n instance
const i18n = new I18n({
  en,
  hi,
});

// Set the locale once at the beginning of your app
i18n.locale = Localization.locale.split('-')[0];
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

/**
 * Translate function - shorthand for i18n.t
 * @param key Translation key
 * @param options Translation options (interpolation, etc)
 */
export const t = (key: string, options?: Record<string, any>): string => {
  return i18n.t(key, options);
};

/**
 * Save the user's locale preference
 * @param locale Locale code to save
 */
export const saveLocale = async (locale: string): Promise<void> => {
  try {
    await AsyncStorage.setItem('user-locale', locale);
    i18n.locale = locale;
  } catch (error) {
    console.error('Failed to save locale:', error);
  }
};

/**
 * Load saved locale from AsyncStorage
 */
export const loadSavedLocale = async (): Promise<string> => {
  try {
    const savedLocale = await AsyncStorage.getItem('user-locale');
    
    if (savedLocale) {
      i18n.locale = savedLocale;
      return savedLocale;
    }
    
    // If no saved locale, use device locale
    const deviceLocale = Localization.locale.split('-')[0];
    
    // Only set if it's one of our supported locales
    if (Object.keys(i18n.translations).includes(deviceLocale)) {
      i18n.locale = deviceLocale;
    } else {
      i18n.locale = 'en'; // Fallback to English
    }
    
    return i18n.locale;
  } catch (error) {
    console.error('Failed to load locale:', error);
    return 'en';
  }
};

/**
 * Asynchronously load localization settings
 * Returns a tuple with successful loading status and potential error
 */
export const loadLocaleAsync = async (): Promise<[boolean, Error | null]> => {
  try {
    await loadSavedLocale();
    return [true, null];
  } catch (error) {
    console.error('Failed to load localization:', error);
    return [false, error as Error];
  }
};

/**
 * Get all available locales
 */
export const getAvailableLocales = (): string[] => {
  return Object.keys(i18n.translations);
};

/**
 * Format a date according to the current locale
 * @param date Date to format
 * @param options Intl.DateTimeFormat options
 */
export const formatDate = (
  date: Date,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
): string => {
  return new Intl.DateTimeFormat(i18n.locale, options).format(date);
};

/**
 * Format a number according to the current locale
 * @param number Number to format
 * @param options Intl.NumberFormat options
 */
export const formatNumber = (
  number: number,
  options: Intl.NumberFormatOptions = {}
): string => {
  return new Intl.NumberFormat(i18n.locale, options).format(number);
};

/**
 * Format a currency according to the current locale
 * @param amount Amount to format
 * @param currency Currency code (default: INR)
 */
export const formatCurrency = (
  amount: number,
  currency: string = 'INR'
): string => {
  return new Intl.NumberFormat(i18n.locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export default i18n;
