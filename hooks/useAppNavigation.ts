import { useRouter, usePathname } from 'expo-router';
import { Platform } from 'react-native';
import { useCallback } from 'react';

/**
 * Type definitions for route parameters
 */
interface ProductParams {
  id: string;
}

interface OrderTrackingParams {
  id?: string;
}

interface CategoryParams {
  id: string;
}

/**
 * Custom navigation hook that simplifies navigation throughout the app
 * Follows the .windsurfrules guidelines by using expo-router efficiently
 */
export function useAppNavigation() {
  const router = useRouter();
  const currentPath = usePathname();

  /**
   * Navigate to home screen
   */
  const goToHome = useCallback(() => {
    router.replace('/');
  }, [router]);

  /**
   * Navigate to authentication screen
   */
  const goToAuth = useCallback(() => {
    router.push('/auth');
  }, [router]);

  /**
   * Navigate to product details screen
   */
  const goToProduct = useCallback((params: ProductParams) => {
    router.push(`/product/${params.id}`);
  }, [router]);

  /**
   * Navigate to cart screen
   */
  const goToCart = useCallback(() => {
    router.push('/cart');
  }, [router]);

  /**
   * Navigate to checkout screen
   */
  const goToCheckout = useCallback(() => {
    router.push('/checkout');
  }, [router]);

  /**
   * Navigate to order tracking screen
   */
  const goToOrderTracking = useCallback((params?: OrderTrackingParams) => {
    const path = params?.id ? `/order-tracking/${params.id}` : '/order-tracking';
    router.push(path);
  }, [router]);

  /**
   * Navigate to search screen
   */
  const goToSearch = useCallback(() => {
    router.push('/(tabs)/search');
  }, [router]);

  /**
   * Navigate to category screen
   */
  const goToCategory = useCallback((params: CategoryParams) => {
    router.push(`/categories/${params.id}`);
  }, [router]);

  /**
   * Navigate to profile screen
   */
  const goToProfile = useCallback(() => {
    router.push('/(tabs)/profile');
  }, [router]);

  /**
   * Navigate to wishlist screen
   */
  const goToWishlist = useCallback(() => {
    router.push('/(tabs)/wishlist');
  }, [router]);

  /**
   * Navigate to settings screen
   */
  const goToSettings = useCallback(() => {
    router.push('/settings');
  }, [router]);

  /**
   * Navigate back (handles hardware back button on Android)
   */
  const goBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      goToHome();
    }
  }, [router, goToHome]);

  /**
   * Check if current route matches the given path
   */
  const isActive = useCallback((path: string) => {
    return currentPath === path;
  }, [currentPath]);

  return {
    goToHome,
    goToAuth,
    goToProduct,
    goToCart,
    goToCheckout,
    goToOrderTracking,
    goToSearch,
    goToCategory,
    goToProfile,
    goToWishlist,
    goToSettings,
    goBack,
    isActive,
    currentPath,
  };
}
