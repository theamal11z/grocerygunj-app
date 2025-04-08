import Constants from 'expo-constants';

/**
 * Environment type definition
 */
export type Environment = 'development' | 'staging' | 'production';

/**
 * Configuration interface defining all available config values
 */
interface AppConfig {
  // API configuration
  apiUrl: string;
  apiTimeout: number;
  
  // Supabase configuration
  supabaseUrl: string;
  supabaseAnonKey: string;
  
  // App configuration
  appEnv: Environment;
  cacheTtl: number;
  
  // Feature flags
  enableAnalytics: boolean;
  enableCrashReporting: boolean;
  enableRemoteConfig: boolean;
  
  // Derived values
  isDevelopment: boolean;
  isStaging: boolean;
  isProduction: boolean;
}

/**
 * Load and parse a configuration value from Expo Constants
 * with type checking and default value
 */
function getConfigValue<T>(key: string, defaultValue: T): T {
  const publicKey = `EXPO_PUBLIC_${key}`;
  const value = Constants.expoConfig?.extra?.[key] || process.env[publicKey];
  
  if (value === undefined) {
    console.warn(`Config key "${key}" not found, using default value: ${defaultValue}`);
    return defaultValue;
  }
  
  // Convert string boolean values to actual booleans
  if (typeof defaultValue === 'boolean' && typeof value === 'string') {
    return (value.toLowerCase() === 'true') as unknown as T;
  }
  
  // Convert string number values to actual numbers
  if (typeof defaultValue === 'number' && typeof value === 'string') {
    return Number(value) as unknown as T;
  }
  
  return value as T;
}

/**
 * Create and expose the application configuration
 * Uses environment variables with fallbacks to ensure the app always works
 */
const appEnv = getConfigValue<Environment>('APP_ENV', 'development');

export const config: AppConfig = {
  // API configuration
  apiUrl: getConfigValue<string>('API_URL', 'https://dev-api.grocerygunj.com'),
  apiTimeout: getConfigValue<number>('API_TIMEOUT', 30000),
  
  // Supabase configuration
  supabaseUrl: getConfigValue<string>('SUPABASE_URL', ''),
  supabaseAnonKey: getConfigValue<string>('SUPABASE_ANON_KEY', ''),
  
  // App configuration
  appEnv,
  cacheTtl: getConfigValue<number>('CACHE_TTL', 300),
  
  // Feature flags
  enableAnalytics: getConfigValue<boolean>('ENABLE_ANALYTICS', false),
  enableCrashReporting: getConfigValue<boolean>('ENABLE_CRASH_REPORTING', false),
  enableRemoteConfig: getConfigValue<boolean>('ENABLE_REMOTE_CONFIG', false),
  
  // Derived values
  isDevelopment: appEnv === 'development',
  isStaging: appEnv === 'staging',
  isProduction: appEnv === 'production',
};

export default config;
