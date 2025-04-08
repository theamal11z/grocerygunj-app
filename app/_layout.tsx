import { useEffect, useState } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { LogBox, Platform } from 'react-native';
import * as Linking from 'expo-linking';
import { useFonts, Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold } from '@expo-google-fonts/poppins';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';
import suppressWarnings from '@/utils/errorSuppression';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { createQueryClient } from '@/lib/query-client';
import { loadLocaleAsync } from '@/lib/i18n';
import Providers from './Providers';

// Initialize query client
const queryClient = createQueryClient();

// Configure deep linking
const linking = {
  prefixes: [
    // Add your app's deep link prefixes here
    Linking.createURL('/'),
    'grocerygunj://',
  ],
  config: {
    screens: {
      index: '',
      auth: 'auth',
      '(tabs)': 'tabs',
      'product/[id]': 'product/:id',
      cart: 'cart',
      checkout: 'checkout',
      'order-confirmation': 'order-confirmation',
      'order-tracking': 'order-tracking/:id?',
      settings: 'settings',
      // Add more screens as needed
    },
  },
};

// Apply warning suppression
suppressWarnings();

// Suppress text rendering warnings globally
LogBox.ignoreLogs([
  'Text strings must be rendered within a <Text> component',
]);

SplashScreen.preventAutoHideAsync();

/**
 * Root Layout Component
 * Sets up app theming, navigation, and global providers
 */
export default function RootLayout() {
  // Load fonts
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });
  
  // Load locale data
  const [localeLoaded, setLocaleLoaded] = useState(false);
  const [localeError, setLocaleError] = useState<Error | null>(null);
  
  useEffect(() => {
    // Load locale asynchronously
    loadLocaleAsync()
      .then(([success, error]) => {
        setLocaleLoaded(success);
        setLocaleError(error);
      })
      .catch(error => {
        setLocaleLoaded(false);
        setLocaleError(error);
      });
  }, []);
  
  useEffect(() => {
    if ((fontsLoaded || fontError) && (localeLoaded || localeError)) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, localeLoaded, localeError]);

  if ((!fontsLoaded && !fontError) || (!localeLoaded && !localeError)) {
    return null;
  }

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <SafeAreaProvider>
          <Providers>
            <Stack 
              screenOptions={{ 
                headerShown: false,
                animation: 'slide_from_right'
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen 
                name="auth" 
                options={{ 
                  animation: 'fade',
                  presentation: 'transparentModal'
                }} 
              />
              <Stack.Screen 
                name="(tabs)" 
                options={{ headerShown: false }} 
              />
              <Stack.Screen 
                name="product/[id]" 
                options={{ 
                  presentation: 'card',
                  animation: 'slide_from_bottom' 
                }} 
              />
              <Stack.Screen 
                name="cart" 
                options={{ 
                  presentation: 'modal',
                  animation: 'slide_from_bottom' 
                }} 
              />
              <Stack.Screen 
                name="checkout" 
                options={{ 
                  animation: 'slide_from_right'
                }} 
              />
              <Stack.Screen 
                name="order-confirmation" 
                options={{ 
                  animation: 'fade',
                  gestureEnabled: false 
                }} 
              />
              <Stack.Screen 
                name="order-tracking" 
                options={{ 
                  animation: 'slide_from_right' 
                }} 
              />
              <Stack.Screen 
                name="notifications" 
                options={{ 
                  animation: 'slide_from_bottom',
                  presentation: 'transparentModal' 
                }} 
              />
              <Stack.Screen name="offers" />
              <Stack.Screen name="help" />
              <Stack.Screen name="address" />
              <Stack.Screen name="payment-methods" />
              <Stack.Screen name="categories" />
              <Stack.Screen 
                name="settings" 
                options={{ 
                  animation: 'slide_from_right' 
                }} 
              />
            </Stack>
            <StatusBar />
          </Providers>
        </SafeAreaProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}