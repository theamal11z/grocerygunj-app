import React, { useState } from 'react';
import { TextInput, Text, View, TextInputProps } from 'react-native';
import styled from 'styled-components/native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'outlined' | 'filled';
}

export function Input({
  label,
  error,
  leftIcon,
  rightIcon,
  variant = 'outlined',
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  ...rest
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const handleFocus = () => {
    setIsFocused(true);
    if (rest.onFocus) {
      rest.onFocus(undefined as any);
    }
  };
  
  const handleBlur = () => {
    setIsFocused(false);
    if (rest.onBlur) {
      rest.onBlur(undefined as any);
    }
  };
  
  const Container = variant === 'outlined' ? OutlinedContainer : FilledContainer;
  const hasError = !!error;
  
  return (
    <InputWrapper>
      {label && <InputLabel>{label}</InputLabel>}
      <Container isFocused={isFocused} hasError={hasError}>
        {leftIcon && <IconContainer>{leftIcon}</IconContainer>}
        <StyledInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholderTextColor="#666"
          {...rest}
        />
        {rightIcon && <IconContainer>{rightIcon}</IconContainer>}
      </Container>
      {hasError && <ErrorMessage>{error}</ErrorMessage>}
    </InputWrapper>
  );
}

const InputWrapper = styled.View`
  marginBottom: ${props => props.theme.spacing.md}px;
`;

const InputLabel = styled.Text`
  fontFamily: ${props => props.theme.typography.fontFamily.medium};
  fontSize: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.textSecondary};
  marginBottom: ${props => props.theme.spacing.xs}px;
`;

interface ContainerProps {
  isFocused: boolean;
  hasError: boolean;
}

const BaseContainer = styled.View<ContainerProps>`
  flexDirection: row;
  alignItems: center;
  borderRadius: ${props => props.theme.borderRadius.md}px;
  height: 50px;
  overflow: hidden;
  
  ${props => props.hasError ? `
    borderColor: ${props.theme.colors.error};
  ` : props.isFocused ? `
    borderColor: ${props.theme.colors.primary};
  ` : `
    borderColor: ${props.theme.colors.border};
  `}
`;

const OutlinedContainer = styled(BaseContainer)`
  borderWidth: 1px;
  backgroundColor: transparent;
  paddingHorizontal: ${props => props.theme.spacing.md}px;
`;

const FilledContainer = styled(BaseContainer)`
  borderWidth: 0;
  backgroundColor: ${props => props.theme.colors.border};
  paddingHorizontal: ${props => props.theme.spacing.md}px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  fontFamily: ${props => props.theme.typography.fontFamily.regular};
  fontSize: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.textPrimary};
  height: 50px;
`;

const IconContainer = styled.View`
  marginHorizontal: ${props => props.theme.spacing.xs}px;
`;

const ErrorMessage = styled.Text`
  fontFamily: ${props => props.theme.typography.fontFamily.regular};
  fontSize: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.error};
  marginTop: ${props => props.theme.spacing.xs}px;
`;
