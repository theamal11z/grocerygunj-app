/**
 * Error logger utility for centralized error handling
 * Following the .windsurfrules guidelines for error handling
 */

// Error severity levels
export enum ErrorSeverity {
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
  CRITICAL = 'critical',
}

// Error source types
export enum ErrorSource {
  API = 'api',
  NETWORK = 'network',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  UNKNOWN = 'unknown',
}

interface ErrorLogParams {
  message: string;
  error?: Error;
  source?: ErrorSource;
  severity?: ErrorSeverity;
  context?: Record<string, any>;
}

/**
 * Log an error with optional context and metadata
 */
export function logError({
  message,
  error,
  source = ErrorSource.UNKNOWN,
  severity = ErrorSeverity.ERROR,
  context = {},
}: ErrorLogParams): void {
  // In development, log to console
  if (__DEV__) {
    console.error(`[${severity.toUpperCase()}][${source}] ${message}`, {
      error,
      context,
    });
  }

  // In production, you would send this to a service like Sentry
  // Example:
  // if (!__DEV__) {
  //   Sentry.captureException(error || new Error(message), {
  //     level: mapSeverityToSentryLevel(severity),
  //     tags: { source },
  //     extra: context,
  //   });
  // }
}

/**
 * Helper function to handle API errors consistently
 */
export function handleApiError(error: any, customMessage?: string): never {
  const message = customMessage || 'API request failed';
  
  // Extract error details if available
  const errorMessage = error?.response?.data?.message || error?.message || message;
  const status = error?.response?.status;
  
  // Log the error
  logError({
    message: errorMessage,
    error,
    source: ErrorSource.API,
    severity: status >= 500 ? ErrorSeverity.ERROR : ErrorSeverity.WARNING,
    context: {
      status,
      url: error?.config?.url,
      method: error?.config?.method,
    },
  });
  
  // Rethrow with a cleaner message
  throw new Error(errorMessage);
}

/**
 * Helper function for early validation error handling
 */
export function validateOrThrow<T>(
  condition: boolean,
  errorMessage: string
): asserts condition {
  if (!condition) {
    logError({
      message: errorMessage,
      source: ErrorSource.VALIDATION,
      severity: ErrorSeverity.WARNING,
    });
    throw new Error(errorMessage);
  }
}

/**
 * Safe function execution with error handling
 */
export async function tryCatch<T>(
  fn: () => Promise<T> | T,
  errorHandler?: (error: Error) => void
): Promise<T | null> {
  try {
    return await fn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error as Error);
    } else {
      logError({
        message: 'An error occurred during operation',
        error: error as Error,
      });
    }
    return null;
  }
}
