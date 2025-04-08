import React, { ReactNode } from 'react';
import { ScrollView, ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled, { useTheme } from 'styled-components/native';
import { useDarkMode } from '@/hooks/useDarkMode';

interface SafeAreaScrollViewProps extends ScrollViewProps {
  children: ReactNode;
  backgroundColor?: string;
  useSafeArea?: boolean;
  showsVerticalScrollIndicator?: boolean;
}

/**
 * Safe Area aware scrollable container
 * 
 * Automatically handles insets from notches, status bars, and other
 * device-specific areas that need padding for content visibility
 */
export function SafeAreaScrollView({
  children,
  backgroundColor,
  contentContainerStyle,
  useSafeArea = true,
  showsVerticalScrollIndicator = false,
  ...rest
}: SafeAreaScrollViewProps) {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const { isDarkMode } = useDarkMode();
  
  // Use provided backgroundColor or fallback to theme background color
  const bgColor = backgroundColor || theme.colors.background;
  
  // Only apply safe area insets if useSafeArea is true
  const safeAreaInsets = useSafeArea 
    ? { 
        paddingTop: insets.top, 
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }
    : {};
  
  return (
    <StyledScrollView
      {...rest}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      contentContainerStyle={[
        { 
          ...safeAreaInsets,
          backgroundColor: bgColor
        },
        contentContainerStyle
      ]}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </StyledScrollView>
  );
}

const StyledScrollView = styled(ScrollView)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
`;
