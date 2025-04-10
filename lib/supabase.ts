import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';
import { ENV } from '@/utils/env';

// Initialize the Supabase client
export const supabase = createClient<Database>(
  ENV.SUPABASE_URL,
  ENV.SUPABASE_ANON_KEY
);

// Re-export types from database.types.ts
export * from './database.types';