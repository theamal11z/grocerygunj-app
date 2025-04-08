import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';

// Define the state types
interface AppState {
  isLoading: boolean;
  hasError: boolean;
  errorMessage: string | null;
  toast: {
    visible: boolean;
    message: string;
    type: 'success' | 'error' | 'info';
  };
  preferences: {
    useLocationServices: boolean;
    notificationsEnabled: boolean;
    currency: string;
  };
}

// Define action types using discriminated unions for type safety
type AppAction = 
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: { hasError: boolean; message: string | null } }
  | { type: 'SHOW_TOAST'; payload: { message: string; type: 'success' | 'error' | 'info' } }
  | { type: 'HIDE_TOAST' }
  | { type: 'SET_PREFERENCES'; payload: Partial<AppState['preferences']> }
  | { type: 'RESET_STATE' };

// Define the initial state
const initialState: AppState = {
  isLoading: false,
  hasError: false,
  errorMessage: null,
  toast: {
    visible: false,
    message: '',
    type: 'info',
  },
  preferences: {
    useLocationServices: true,
    notificationsEnabled: true,
    currency: 'INR',
  },
};

// Create the reducer function
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        hasError: action.payload.hasError,
        errorMessage: action.payload.message,
      };
    case 'SHOW_TOAST':
      return {
        ...state,
        toast: {
          visible: true,
          message: action.payload.message,
          type: action.payload.type,
        },
      };
    case 'HIDE_TOAST':
      return {
        ...state,
        toast: {
          ...state.toast,
          visible: false,
        },
      };
    case 'SET_PREFERENCES':
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload,
        },
      };
    case 'RESET_STATE':
      return initialState;
    default:
      return state;
  }
}

// Create the context
const AppStateContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | undefined>(undefined);

// Create the context provider
export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  
  // Register dispatch function for global toast access
  useEffect(() => {
    registerToastDispatch(dispatch);
    return () => {
      // Clean up by setting globalToastDispatch to null when unmounted
      globalToastDispatch = null;
    };
  }, [dispatch]);
  
  return (
    <AppStateContext.Provider value={{ state, dispatch }}>
      {children}
    </AppStateContext.Provider>
  );
}

// Create a hook to use the app state
export function useAppState() {
  const context = useContext(AppStateContext);
  
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  
  return context;
}

// Global reference for toast functionality outside React components
let globalToastDispatch: React.Dispatch<AppAction> | null = null;

// Register the dispatch function when the provider is mounted
export function registerToastDispatch(dispatch: React.Dispatch<AppAction>) {
  globalToastDispatch = dispatch;
}

// Helper function to show toasts easily
export function useToast() {
  let dispatch: React.Dispatch<AppAction>;
  
  try {
    // Try to use AppState's dispatch, but don't fail if not available
    const context = useAppState();
    dispatch = context.dispatch;
  } catch (error) {
    // If AppStateProvider isn't available, use a dummy dispatch
    // that logs the toast message but doesn't crash
    if (!globalToastDispatch) {
      console.warn('Toast was triggered before AppStateProvider was mounted');
      dispatch = (action) => {
        if (action.type === 'SHOW_TOAST') {
          console.log(`Toast (unavailable): ${action.payload.message}`);
        }
      };
    } else {
      dispatch = globalToastDispatch;
    }
  }
  
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    dispatch({ type: 'SHOW_TOAST', payload: { message, type } });
    
    // Automatically hide toast after 3 seconds
    setTimeout(() => {
      dispatch({ type: 'HIDE_TOAST' });
    }, 3000);
  };
  
  return { showToast };
}

// Export a toast function that can be used outside React components
export const showGlobalToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
  if (globalToastDispatch) {
    globalToastDispatch({ type: 'SHOW_TOAST', payload: { message, type } });
    
    // Automatically hide toast after 3 seconds
    setTimeout(() => {
      globalToastDispatch?.({ type: 'HIDE_TOAST' });
    }, 3000);
  } else {
    console.warn('Toast was triggered before AppStateProvider was mounted');
    console.log(`Toast (unavailable): ${message}`);
  }
};
