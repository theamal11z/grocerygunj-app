import React, { ReactNode, useEffect } from 'react';
import { ThemeProvider } from 'styled-components/native';
import { WishlistProvider } from '@/hooks/WishlistContext';
import { CartProvider } from '@/lib/CartContext';
import { AuthProvider } from '@/hooks/AuthContext';
import { AppStateProvider } from '@/hooks/useAppState';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet, I18nManager } from 'react-native';
import { lightTheme, darkTheme } from '@/lib/theme';
import { useDarkMode } from '@/hooks/useDarkMode';
import { loadSavedLocale } from '@/lib/i18n';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

interface ProvidersProps {
  children: ReactNode;
}

// Authentication guard to protect routes
function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAuthStateReady } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  
  // Protected routes that require authentication
  const protectedRoutes = ['(tabs)', 'checkout', 'order-confirmation', 'order-tracking', 'settings'];
  
  useEffect(() => {
    if (!isAuthStateReady) return;
    
    const inProtectedRoute = segments.some(segment => 
      protectedRoutes.includes(segment)
    );
    
    if (!isAuthenticated && inProtectedRoute) {
      // Redirect to auth screen if user is not authenticated and tries to access protected route
      router.replace('/auth');
    } else if (isAuthenticated && segments[0] === 'auth') {
      // Redirect to home if user is authenticated and tries to access auth screen
      router.replace('/');
    }
  }, [isAuthenticated, isAuthStateReady, segments, router]);
  
  // Show nothing while we're figuring out the auth state
  if (!isAuthStateReady) return null;
  
  return <>{children}</>;
}

export default function Providers({ children }: ProvidersProps) {
  const { isDarkMode } = useDarkMode();
  const theme = isDarkMode ? darkTheme : lightTheme;

  // Initialize i18n on app startup
  useEffect(() => {
    async function initializeApp() {
      // Load saved locale
      await loadSavedLocale();
      
      // Check if we need to handle RTL layout changes
      // Note: In a real app, we would need to restart the app if RTL changes
      // as React Native requires a restart for RTL changes to take effect
      const shouldBeRTL = I18nManager.isRTL;
      
      if (shouldBeRTL) {
        // This is where we would handle RTL-specific adjustments if needed
        console.log('App is running in RTL mode');
      }
    }
    
    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ThemeProvider theme={theme}>
        <AppStateProvider>
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <AuthGuard>
                  {children}
                </AuthGuard>
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </AppStateProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});