import React from 'react';
import { Tabs } from 'expo-router';
import { Chrome as Home, Search, Heart, ShoppingBag, User } from 'lucide-react-native';
import { StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import { useAppStore } from '@/store/app-store';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';
import { t } from '@/lib/i18n';
import { TabBadge } from '@/components/TabBadge';

// Define the icon props type to avoid TypeScript errors
interface TabIconProps {
  color: string;
  size: number;
}

/**
 * Tab Layout Component
 * Creates the main tab navigation structure for the app
 * Following the .windsurfrules guidelines
 */
export default function TabLayout() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const { theme: themePreference } = useAppStore();
  const cartItemCount = useCartStore(state => state.totalItems());
  const wishlistItemCount = useWishlistStore(state => state.items.length);
  
  const isDarkMode = themePreference === 'dark' || 
    (themePreference === 'system' && Platform.OS === 'ios' ? 
      false : // Need a better way to detect system theme
      false);
  
  // Calculate bottom tab padding with safe area insets
  const bottomTabHeight = 60;
  const bottomTabPadding = Math.max(8, insets.bottom ? insets.bottom - 10 : 8);
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: theme.colors.border,
          backgroundColor: theme.colors.card,
          height: bottomTabHeight + bottomTabPadding,
          paddingBottom: bottomTabPadding,
          paddingTop: 8,
          ...styles.shadow,
        },
        tabBarLabelStyle: {
          fontFamily: theme.typography.fontFamily.medium,
          fontSize: 12,
          marginBottom: 4,
        },
        headerShown: false,
        tabBarAllowFontScaling: true, // Support dynamic type for accessibility
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('navigation.home'),
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Home 
              size={size} 
              color={color} 
              accessibilityLabel={t('navigation.home')}
            />
          ),
          tabBarAccessibilityLabel: t('navigation.home'),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: t('navigation.search'),
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <Search 
              size={size} 
              color={color} 
              accessibilityLabel={t('navigation.search')}
            />
          ),
          tabBarAccessibilityLabel: t('navigation.search'),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          title: t('navigation.wishlist'),
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <TabBadge count={wishlistItemCount}>
              <Heart 
                size={size} 
                color={color} 
                accessibilityLabel={t('navigation.wishlist')}
              />
            </TabBadge>
          ),
          tabBarAccessibilityLabel: t('navigation.wishlist'),
        }}
      />
      <Tabs.Screen
        name="orders"
        options={{
          title: t('navigation.orders'),
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <TabBadge count={cartItemCount}>
              <ShoppingBag 
                size={size} 
                color={color} 
                accessibilityLabel={t('navigation.orders')}
              />
            </TabBadge>
          ),
          tabBarAccessibilityLabel: t('navigation.orders'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('navigation.profile'),
          tabBarIcon: ({ color, size }: TabIconProps) => (
            <User 
              size={size} 
              color={color} 
              accessibilityLabel={t('navigation.profile')}
            />
          ),
          tabBarAccessibilityLabel: t('navigation.profile'),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },
});