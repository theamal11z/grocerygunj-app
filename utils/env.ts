import Constants from 'expo-constants';

/**
 * Safely get environment variables from Expo's Constants
 * @param key The name of the environment variable to retrieve
 * @param defaultValue Optional default value to return if the variable is not found
 * @returns The value of the environment variable or the default value
 */
export function getEnv<T>(key: string, defaultValue?: T): string | T {
  const value = Constants.expoConfig?.extra?.[key];
  
  if (value === undefined) {
    // If no value is found and no default is provided, log a warning
    if (defaultValue === undefined) {
      console.warn(`Environment variable ${key} is not defined`);
    }
    return defaultValue as T;
  }
  
  return value as string;
}

/**
 * Environment variable configuration object
 */
export const ENV = {
  SUPABASE_URL: getEnv('supabaseUrl', ''),
  SUPABASE_ANON_KEY: getEnv('supabaseAnonKey', ''),
}; 