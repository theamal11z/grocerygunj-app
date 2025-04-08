import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import styled, { useTheme } from 'styled-components/native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  isFullWidth?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  isFullWidth = false,
  isDisabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
}: ButtonProps) {
  const theme = useTheme();
  
  const getContainerStyle = () => {
    if (isDisabled) return ButtonContainerDisabled;
    
    switch(variant) {
      case 'primary':
        return ButtonContainerPrimary;
      case 'secondary':
        return ButtonContainerSecondary;
      case 'outline':
        return ButtonContainerOutline;
      default:
        return ButtonContainerPrimary;
    }
  };
  
  const getTextStyle = () => {
    if (isDisabled) return ButtonTextDisabled;
    
    switch(variant) {
      case 'primary':
        return ButtonTextPrimary;
      case 'secondary':
        return ButtonTextSecondary;
      case 'outline':
        return ButtonTextOutline;
      default:
        return ButtonTextPrimary;
    }
  };
  
  const getSizeStyle = () => {
    switch(size) {
      case 'small':
        return ButtonSizeSmall;
      case 'medium':
        return ButtonSizeMedium;
      case 'large':
        return ButtonSizeLarge;
      default:
        return ButtonSizeMedium;
    }
  };
  
  const ButtonContainer = getContainerStyle();
  const TextStyle = getTextStyle();
  const SizeStyle = getSizeStyle();
  
  const Container = styled(ButtonContainer)`
    ${SizeStyle}
    ${isFullWidth ? 'width: 100%;' : ''}
  `;

  return (
    <Container
      onPress={onPress}
      disabled={isDisabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator 
          color={variant === 'outline' ? theme.colors.primary : theme.colors.white} 
          size="small" 
        />
      ) : (
        <ButtonContent>
          {leftIcon && <IconContainer>{leftIcon}</IconContainer>}
          <TextStyle>{label}</TextStyle>
          {rightIcon && <IconContainer>{rightIcon}</IconContainer>}
        </ButtonContent>
      )}
    </Container>
  );
}

// Button content layout
const ButtonContent = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const IconContainer = styled.View`
  margin-horizontal: ${props => props.theme.spacing.sm}px;
`;

// Button sizes
const ButtonSizeSmall = `
  padding-vertical: ${props => props.theme.spacing.sm}px;
  padding-horizontal: ${props => props.theme.spacing.lg}px;
  border-radius: ${props => props.theme.borderRadius.sm}px;
`;

const ButtonSizeMedium = `
  padding-vertical: ${props => props.theme.spacing.md}px;
  padding-horizontal: ${props => props.theme.spacing.xl}px;
  border-radius: ${props => props.theme.borderRadius.md}px;
`;

const ButtonSizeLarge = `
  padding-vertical: ${props => props.theme.spacing.lg}px;
  padding-horizontal: ${props => props.theme.spacing.xxl}px;
  border-radius: ${props => props.theme.borderRadius.md}px;
`;

// Button variants - Containers
const ButtonContainerPrimary = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

const ButtonContainerSecondary = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.secondary};
  align-items: center;
  justify-content: center;
`;

const ButtonContainerOutline = styled(TouchableOpacity)`
  background-color: transparent;
  border-width: 1px;
  border-color: ${props => props.theme.colors.primary};
  align-items: center;
  justify-content: center;
`;

const ButtonContainerDisabled = styled(TouchableOpacity)`
  background-color: ${props => props.theme.colors.border};
  align-items: center;
  justify-content: center;
`;

// Button variants - Text
const ButtonTextPrimary = styled(Text)`
  color: ${props => props.theme.colors.white};
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
`;

const ButtonTextSecondary = styled(Text)`
  color: ${props => props.theme.colors.white};
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
`;

const ButtonTextOutline = styled(Text)`
  color: ${props => props.theme.colors.primary};
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
`;

const ButtonTextDisabled = styled(Text)`
  color: ${props => props.theme.colors.textSecondary};
  font-family: ${props => props.theme.typography.fontFamily.semiBold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
`;
