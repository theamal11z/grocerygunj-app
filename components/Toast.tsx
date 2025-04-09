import React, { useEffect, useState } from 'react';
import { Animated, Dimensions } from 'react-native';
import styled, { useTheme } from 'styled-components/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ToastProps {
  message: string;
  duration?: number;
  type?: 'success' | 'error' | 'info';
  onHide?: () => void;
}

const { width } = Dimensions.get('window');

export function Toast({ 
  message, 
  duration = 3000, 
  type = 'success',
  onHide
}: ToastProps) {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [translateY] = useState(new Animated.Value(20));
  
  useEffect(() => {
    // Fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Fade out after duration
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (onHide) onHide();
      });
    }, duration);

    return () => clearTimeout(timer);
  }, [fadeAnim, translateY, duration, onHide]);

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return theme.colors.success;
      case 'error':
        return theme.colors.error;
      case 'info':
        return '#3498DB'; // Add to theme if needed
      default:
        return theme.colors.success;
    }
  };

  return (
    <ToastContainer
      style={{ 
        backgroundColor: getBackgroundColor(),
        opacity: fadeAnim,
        transform: [{ translateY }],
        bottom: insets.bottom + 100 // Respect safe area
      }}
    >
      <ToastMessage>{message}</ToastMessage>
    </ToastContainer>
  );
}

const ToastContainer = styled(Animated.View)`
  position: absolute;
  left: ${width / 2 - 150}px;
  width: 300px;
  min-height: 50px;
  borderRadius: 25px;
  paddingHorizontal: ${props => props.theme.spacing.xl}px;
  paddingVertical: ${props => props.theme.spacing.md}px;
  justifyContent: center;
  alignItems: center;
  z-index: 9999;
  
  /* Shadow */
  shadowColor: ${props => props.theme.colors.shadow};
  shadowOffset: 0px 2px;
  shadowOpacity: 0.1;
  shadowRadius: 4px;
  elevation: 5;
`;

const ToastMessage = styled.Text`
  fontFamily: ${props => props.theme.typography.fontFamily.medium};
  fontSize: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.white};
  textAlign: center;
`;