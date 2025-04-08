import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'styled-components/native';

interface TabBadgeProps {
  count: number;
  children: React.ReactNode;
  maxCount?: number;
}

/**
 * TabBadge Component
 * Displays a notification badge with count on tab icons
 * 
 * @param count - Number to display in the badge
 * @param children - The tab icon to which the badge will be attached
 * @param maxCount - Maximum number to display before showing "+"
 */
export function TabBadge({ count, children, maxCount = 99 }: TabBadgeProps) {
  const theme = useTheme();
  
  // Don't render badge if count is 0
  if (count === 0) {
    return <>{children}</>;
  }
  
  // Format count with "+" if it exceeds maxCount
  const displayCount = count > maxCount ? `${maxCount}+` : count.toString();
  
  return (
    <View style={styles.container}>
      {children}
      <View 
        style={[
          styles.badge, 
          { backgroundColor: theme.colors.primary }
        ]}
        accessibilityLabel={`${count} items`}
        accessible={true}
      >
        <Text 
          style={[
            styles.text, 
            { color: theme.colors.white }
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {displayCount}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
