import React, { useState, useCallback } from 'react';
import { Image as ExpoImage } from 'expo-image';
import { View, StyleSheet, StyleProp, ImageStyle, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import { useDarkMode } from '@/hooks/useDarkMode';

interface OptimizedImageProps {
  /**
   * Source URI for the image
   */
  source: string;
  
  /**
   * Width of the image
   */
  width: number | string;
  
  /**
   * Height of the image
   */
  height: number | string;
  
  /**
   * Border radius for the image
   * @default 0
   */
  borderRadius?: number;
  
  /**
   * Content fit mode for the image
   * @default 'contain'
   */
  contentFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  
  /**
   * Placeholder color while loading
   * @default theme-based
   */
  placeholderColor?: string;
  
  /**
   * Accessibility label for the image
   */
  accessibilityLabel?: string;
  
  /**
   * Image style overrides
   */
  style?: StyleProp<ImageStyle>;
  
  /**
   * Container style overrides
   */
  containerStyle?: StyleProp<ViewStyle>;
  
  /**
   * Callback when image loading completes
   */
  onLoad?: () => void;
}

/**
 * OptimizedImage Component
 * 
 * Uses Expo's optimized image component with proper caching,
 * loading placeholders, and accessibility features
 */
export default function OptimizedImage({
  source,
  width,
  height,
  borderRadius = 0,
  contentFit = 'contain',
  placeholderColor,
  accessibilityLabel,
  style,
  containerStyle,
  onLoad,
}: OptimizedImageProps) {
  const { isDarkMode } = useDarkMode();
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  // Get appropriate placeholder color based on theme
  const defaultPlaceholderColor = isDarkMode ? '#2C2C2C' : '#E0E0E0';
  const placeholderBgColor = placeholderColor || defaultPlaceholderColor;
  
  const handleLoad = useCallback(() => {
    setIsLoading(false);
    if (onLoad) {
      onLoad();
    }
  }, [onLoad]);
  
  const handleError = useCallback(() => {
    setHasError(true);
    setIsLoading(false);
  }, []);
  
  return (
    <Container 
      style={[
        containerStyle,
        {
          backgroundColor: isLoading || hasError ? placeholderBgColor : 'transparent'
        }
      ]}
      $width={width}
      $height={height}
      $borderRadius={borderRadius}
    >
      {!hasError && (
        <StyledImage
          source={source}
          style={[
            style,
            {
              opacity: isLoading ? 0 : 1
            }
          ]}
          $width={width}
          $height={height}
          $borderRadius={borderRadius}
          contentFit={contentFit}
          cachePolicy="memory-disk"
          transition={200}
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="image"
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {hasError && (
        <ErrorContainer 
          $width={width} 
          $height={height} 
          $borderRadius={borderRadius}
        >
          <ErrorIndicator>!</ErrorIndicator>
        </ErrorContainer>
      )}
    </Container>
  );
}

// Using transient props ($) to avoid warnings in styled-components
// This way we can pass width/height without React Native complaining
interface StyledProps {
  $width: number | string;
  $height: number | string;
  $borderRadius: number;
}

const Container = styled.View<StyledProps>`
  overflow: hidden;
  width: ${props => typeof props.$width === 'number' ? `${props.$width}px` : props.$width};
  height: ${props => typeof props.$height === 'number' ? `${props.$height}px` : props.$height};
  border-radius: ${props => props.$borderRadius}px;
`;

const StyledImage = styled(ExpoImage)<StyledProps>`
  width: ${props => typeof props.$width === 'number' ? `${props.$width}px` : props.$width};
  height: ${props => typeof props.$height === 'number' ? `${props.$height}px` : props.$height};
  border-radius: ${props => props.$borderRadius}px;
`;

const ErrorContainer = styled.View<StyledProps>`
  width: ${props => typeof props.$width === 'number' ? `${props.$width}px` : props.$width};
  height: ${props => typeof props.$height === 'number' ? `${props.$height}px` : props.$height};
  border-radius: ${props => props.$borderRadius}px;
  background-color: #f5f5f5;
  align-items: center;
  justify-content: center;
`;

const ErrorIndicator = styled.Text`
  font-size: 20px;
  color: #999;
  font-weight: bold;
`;
