import { QueryClient } from '@tanstack/react-query';
import { logError } from '@/utils/errorLogger';

/**
 * Create a QueryClient with custom configurations
 * This client will be used for all data fetching operations
 */
export function createQueryClient() {
  // Create query client with default options
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Configure default query behavior
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 30, // 30 minutes (previously cacheTime)
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
      },
      mutations: {
        // Configure default mutation behavior
        retry: 1,
      },
    },
  });
}
