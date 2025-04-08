import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Interface representing a product in the wishlist
 */
export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  discountedPrice?: number;
  image: string;
  unit: string;
  dateAdded: number;
}

/**
 * Wishlist state interface
 */
interface WishlistState {
  // State
  items: WishlistItem[];
  lastAddedItem: string | null;
  
  // Actions
  addItem: (item: Omit<WishlistItem, 'dateAdded'>) => void;
  removeItem: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  toggleItem: (item: Omit<WishlistItem, 'dateAdded'>) => void;
  clearWishlist: () => void;
}

/**
 * Create the wishlist store with persistence using AsyncStorage
 * Following the .windsurfrules guidelines for state management
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      lastAddedItem: null,
      
      // Add item to wishlist
      addItem: (item) => {
        // Check if item already exists
        if (get().isInWishlist(item.id)) return;
        
        const newItem = {
          ...item,
          dateAdded: Date.now(),
        };
        
        set(state => ({ 
          items: [...state.items, newItem],
          lastAddedItem: item.id
        }));
      },
      
      // Remove item from wishlist
      removeItem: (id) => {
        set(state => ({
          items: state.items.filter(item => item.id !== id),
          lastAddedItem: null
        }));
      },
      
      // Check if item is in wishlist
      isInWishlist: (id) => {
        return get().items.some(item => item.id === id);
      },
      
      // Toggle item in wishlist (add if not present, remove if present)
      toggleItem: (item) => {
        const isInWishlist = get().isInWishlist(item.id);
        
        if (isInWishlist) {
          get().removeItem(item.id);
        } else {
          get().addItem(item);
        }
      },
      
      // Clear all items from wishlist
      clearWishlist: () => {
        set({ items: [], lastAddedItem: null });
      },
    }),
    {
      name: 'grocerygunj-wishlist-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
