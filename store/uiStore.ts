import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}

interface ModalConfig {
  isOpen: boolean;
  modalType: string | null;
  data?: any;
}

interface UiState {
  // Toast notifications
  toastMessages: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Modal state
  modal: ModalConfig;
  openModal: (modalType: string, data?: any) => void;
  closeModal: () => void;
  
  // Loading indicators
  loadingStates: Record<string, boolean>;
  setLoading: (key: string, isLoading: boolean) => void;
  
  // Theme
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
  
  // Other UI preferences
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  
  // Reset all UI state
  resetUiState: () => void;
}

const initialState = {
  toastMessages: [],
  modal: {
    isOpen: false,
    modalType: null,
    data: undefined,
  },
  loadingStates: {},
  isDarkMode: false,
  fontSize: 'medium' as const,
};

export const useUiStore = create<UiState>()(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Toast methods
      addToast: (toast) => {
        const id = Math.random().toString(36).substring(2, 9);
        set((state) => ({
          toastMessages: [...state.toastMessages, { ...toast, id }],
        }));
        
        // Auto-remove toast after duration
        if (toast.duration !== 0) {
          setTimeout(() => {
            get().removeToast(id);
          }, toast.duration || 3000);
        }
        
        return id;
      },
      
      removeToast: (id) => set((state) => ({
        toastMessages: state.toastMessages.filter((toast) => toast.id !== id),
      })),
      
      clearToasts: () => set({ toastMessages: [] }),
      
      // Modal methods
      openModal: (modalType, data) => set({
        modal: { isOpen: true, modalType, data },
      }),
      
      closeModal: () => set({
        modal: { isOpen: false, modalType: null, data: undefined },
      }),
      
      // Loading state methods
      setLoading: (key, isLoading) => set((state) => ({
        loadingStates: {
          ...state.loadingStates,
          [key]: isLoading,
        },
      })),
      
      // Theme methods
      toggleDarkMode: () => set((state) => ({
        isDarkMode: !state.isDarkMode,
      })),
      
      setDarkMode: (isDark) => set({
        isDarkMode: isDark,
      }),
      
      // Font size methods
      setFontSize: (size) => set({
        fontSize: size,
      }),
      
      // Reset method
      resetUiState: () => set({
        ...initialState,
        // Keep some persisted preferences
        isDarkMode: get().isDarkMode,
        fontSize: get().fontSize,
      }),
    }),
    {
      name: 'ui-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist theme and font settings
      partialize: (state) => ({
        isDarkMode: state.isDarkMode,
        fontSize: state.fontSize,
      }),
    }
  )
); 