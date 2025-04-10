import React, { ReactNode, useEffect } from 'react';
import { WishlistProvider } from '@/hooks/WishlistContext';
import { CartProvider } from '@/lib/CartContext';
import { AuthProvider } from '@/hooks/AuthContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { useInitializeStores } from '@/store';
import { ToastContainer } from '@/components/Toast';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Initialize all stores
  useInitializeStores();
  
  return (
    <GestureHandlerRootView style={styles.container}>
      <AuthProvider>
        <WishlistProvider>
          <CartProvider>
            {children}
            <ToastContainer />
          </CartProvider>
        </WishlistProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 