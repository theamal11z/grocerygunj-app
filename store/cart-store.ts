import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Interface representing a product in the cart
 */
export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  discountedPrice?: number;
  quantity: number;
  image: string;
  unit: string;
}

/**
 * Cart state interface
 */
interface CartState {
  // State
  items: CartItem[];
  isCartOpen: boolean;
  lastAddedItem: string | null;

  // Computed values (implemented as getters)
  totalItems: () => number;
  totalPrice: () => number;
  
  // Actions
  addItem: (item: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  incrementQuantity: (productId: string) => void;
  decrementQuantity: (productId: string) => void;
  clearCart: () => void;
  setIsCartOpen: (isOpen: boolean) => void;
}

/**
 * Create the cart store with persistence using AsyncStorage
 * Following the .windsurfrules guidelines for state management
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      lastAddedItem: null,
      
      // Computed values
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      totalPrice: () => {
        return get().items.reduce((total, item) => {
          const price = item.discountedPrice ?? item.price;
          return total + (price * item.quantity);
        }, 0);
      },
      
      // Actions
      addItem: (item) => {
        const { items } = get();
        const existingItemIndex = items.findIndex(i => i.productId === item.productId);
        
        // If item already exists, increment quantity
        if (existingItemIndex !== -1) {
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += 1;
          set({ items: updatedItems, lastAddedItem: item.productId });
          return;
        }
        
        // Otherwise, add new item
        const newItem: CartItem = {
          ...item,
          id: `cart-item-${Date.now()}`,
          quantity: 1,
        };
        
        set({ 
          items: [...items, newItem],
          lastAddedItem: item.productId
        });
      },
      
      removeItem: (productId) => {
        set(state => ({
          items: state.items.filter(item => item.productId !== productId)
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set(state => ({
          items: state.items.map(item => 
            item.productId === productId 
              ? { ...item, quantity } 
              : item
          )
        }));
      },
      
      incrementQuantity: (productId) => {
        set(state => ({
          items: state.items.map(item => 
            item.productId === productId 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        }));
      },
      
      decrementQuantity: (productId) => {
        const item = get().items.find(item => item.productId === productId);
        
        if (item && item.quantity <= 1) {
          get().removeItem(productId);
          return;
        }
        
        set(state => ({
          items: state.items.map(item => 
            item.productId === productId 
              ? { ...item, quantity: item.quantity - 1 } 
              : item
          )
        }));
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      setIsCartOpen: (isOpen) => {
        set({ isCartOpen: isOpen });
      },
    }),
    {
      name: 'grocerygunj-cart-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
