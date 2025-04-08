import EncryptedStorage from 'react-native-encrypted-storage';
import { logError } from '@/utils/errorLogger';

/**
 * Securely store sensitive data with encryption
 */
export async function setSecureItem(key: string, value: string): Promise<boolean> {
  try {
    await EncryptedStorage.setItem(key, value);
    return true;
  } catch (error) {
    logError({
      message: 'Failed to store item securely',
      error,
      context: { key },
    });
    return false;
  }
}

/**
 * Retrieve securely stored data
 */
export async function getSecureItem(key: string): Promise<string | null> {
  try {
    return await EncryptedStorage.getItem(key);
  } catch (error) {
    logError({
      message: 'Failed to retrieve secure item',
      error,
      context: { key },
    });
    return null;
  }
}

/**
 * Remove a securely stored item
 */
export async function removeSecureItem(key: string): Promise<boolean> {
  try {
    await EncryptedStorage.removeItem(key);
    return true;
  } catch (error) {
    logError({
      message: 'Failed to remove secure item',
      error,
      context: { key },
    });
    return false;
  }
}

/**
 * Clear all securely stored data
 * Use with caution - this will remove all stored credentials
 */
export async function clearSecureStorage(): Promise<boolean> {
  try {
    await EncryptedStorage.clear();
    return true;
  } catch (error) {
    logError({
      message: 'Failed to clear secure storage',
      error,
    });
    return false;
  }
}

// Commonly used secure storage keys
export const SECURE_STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  PAYMENT_METHODS: 'payment_methods',
};
