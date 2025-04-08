import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logError } from '@/utils/errorLogger';

// SecureStore keys
const SESSION_KEY = 'grocery_session';
const AUTH_TOKEN_KEY = 'grocery_auth_token';
const REFRESH_TOKEN_KEY = 'grocery_refresh_token';
const SESSION_EXPIRY_KEY = 'grocery_session_expiry';
const USER_DATA_KEY = 'grocery_user_data';

// Types for session data
export interface SessionData {
  authToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  userData: UserData | null;
}

export interface UserData {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  role?: string;
  preferences?: UserPreferences;
  [key: string]: any; // Allow for additional user data fields
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'system';
  language?: string;
  notifications?: boolean;
  [key: string]: any; // Allow for additional preferences
}

/**
 * Check if secure storage is available on this device
 * Falls back to AsyncStorage on web or if SecureStore is unavailable
 */
const isSecureStoreAvailable = async (): Promise<boolean> => {
  // SecureStore is not available on web
  if (Platform.OS === 'web') {
    return false;
  }
  
  try {
    // Test if SecureStore works by setting and getting a test value
    await SecureStore.setItemAsync('secure_store_test', 'test');
    const testValue = await SecureStore.getItemAsync('secure_store_test');
    return testValue === 'test';
  } catch (error) {
    logError({
      message: 'SecureStore unavailable',
      error: error as Error,
      context: { platform: Platform.OS }
    });
    return false;
  }
};

/**
 * Store a value securely
 * Falls back to AsyncStorage if SecureStore is unavailable
 */
const secureStore = async (key: string, value: string): Promise<void> => {
  try {
    const useSecureStore = await isSecureStoreAvailable();
    
    if (useSecureStore) {
      await SecureStore.setItemAsync(key, value, {
        keychainAccessible: SecureStore.WHEN_UNLOCKED
      });
    } else {
      // Fall back to AsyncStorage if SecureStore isn't available
      await AsyncStorage.setItem(key, value);
    }
  } catch (error) {
    logError({
      message: 'Failed to store value securely',
      error: error as Error,
      context: { key }
    });
    throw error;
  }
};

/**
 * Retrieve a value from secure storage
 * Falls back to AsyncStorage if SecureStore is unavailable
 */
const secureRetrieve = async (key: string): Promise<string | null> => {
  try {
    const useSecureStore = await isSecureStoreAvailable();
    
    if (useSecureStore) {
      return await SecureStore.getItemAsync(key);
    } else {
      // Fall back to AsyncStorage if SecureStore isn't available
      return await AsyncStorage.getItem(key);
    }
  } catch (error) {
    logError({
      message: 'Failed to retrieve value from secure storage',
      error: error as Error,
      context: { key }
    });
    return null;
  }
};

/**
 * Delete a value from secure storage
 * Falls back to AsyncStorage if SecureStore is unavailable
 */
const secureDelete = async (key: string): Promise<void> => {
  try {
    const useSecureStore = await isSecureStoreAvailable();
    
    if (useSecureStore) {
      await SecureStore.deleteItemAsync(key);
    } else {
      // Fall back to AsyncStorage if SecureStore isn't available
      await AsyncStorage.removeItem(key);
    }
  } catch (error) {
    logError({
      message: 'Failed to delete value from secure storage',
      error: error as Error,
      context: { key }
    });
  }
};

/**
 * Session Management API
 */
export const SessionManager = {
  /**
   * Save the complete session data
   */
  saveSession: async (sessionData: SessionData): Promise<void> => {
    try {
      await secureStore(SESSION_KEY, JSON.stringify(sessionData));
    } catch (error) {
      logError({
        message: 'Failed to save session',
        error: error as Error
      });
      throw error;
    }
  },
  
  /**
   * Load the complete session data
   */
  loadSession: async (): Promise<SessionData | null> => {
    try {
      const sessionString = await secureRetrieve(SESSION_KEY);
      if (!sessionString) return null;
      
      return JSON.parse(sessionString) as SessionData;
    } catch (error) {
      logError({
        message: 'Failed to load session',
        error: error as Error
      });
      return null;
    }
  },
  
  /**
   * Clear all session data (logout)
   */
  clearSession: async (): Promise<void> => {
    try {
      await secureDelete(SESSION_KEY);
      await secureDelete(AUTH_TOKEN_KEY);
      await secureDelete(REFRESH_TOKEN_KEY);
      await secureDelete(SESSION_EXPIRY_KEY);
      await secureDelete(USER_DATA_KEY);
    } catch (error) {
      logError({
        message: 'Failed to clear session',
        error: error as Error
      });
      throw error;
    }
  },
  
  /**
   * Save authentication token
   */
  saveAuthToken: async (token: string): Promise<void> => {
    await secureStore(AUTH_TOKEN_KEY, token);
  },
  
  /**
   * Get authentication token
   */
  getAuthToken: async (): Promise<string | null> => {
    return await secureRetrieve(AUTH_TOKEN_KEY);
  },
  
  /**
   * Save refresh token
   */
  saveRefreshToken: async (token: string): Promise<void> => {
    await secureStore(REFRESH_TOKEN_KEY, token);
  },
  
  /**
   * Get refresh token
   */
  getRefreshToken: async (): Promise<string | null> => {
    return await secureRetrieve(REFRESH_TOKEN_KEY);
  },
  
  /**
   * Save user data
   */
  saveUserData: async (userData: UserData): Promise<void> => {
    await secureStore(USER_DATA_KEY, JSON.stringify(userData));
  },
  
  /**
   * Get user data
   */
  getUserData: async (): Promise<UserData | null> => {
    const userDataString = await secureRetrieve(USER_DATA_KEY);
    if (!userDataString) return null;
    
    return JSON.parse(userDataString) as UserData;
  },
  
  /**
   * Check if the session is valid (not expired)
   */
  isSessionValid: async (): Promise<boolean> => {
    try {
      const session = await SessionManager.loadSession();
      if (!session || !session.expiresAt) return false;
      
      const now = Date.now();
      return session.expiresAt > now;
    } catch (error) {
      return false;
    }
  },
  
  /**
   * Get remaining session time in seconds
   */
  getSessionTimeRemaining: async (): Promise<number> => {
    try {
      const session = await SessionManager.loadSession();
      if (!session || !session.expiresAt) return 0;
      
      const now = Date.now();
      const remaining = session.expiresAt - now;
      return Math.max(0, Math.floor(remaining / 1000));
    } catch (error) {
      return 0;
    }
  }
};

export default SessionManager;
