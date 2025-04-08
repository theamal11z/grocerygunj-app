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
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const InputLabel = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

interface ContainerProps {
  isFocused: boolean;
  hasError: boolean;
}

const BaseContainer = styled.View<ContainerProps>`
  flex-direction: row;
  align-items: center;
  border-radius: ${props => props.theme.borderRadius.md}px;
  height: 50px;
  overflow: hidden;
  
  border-color: ${props => {
    if (props.hasError) return props.theme.colors.error;
    if (props.isFocused) return props.theme.colors.primary;
    return props.theme.colors.border;
  }};
`;

const OutlinedContainer = styled(BaseContainer)`
  border-width: 1px;
  background-color: transparent;
  padding-horizontal: ${props => props.theme.spacing.md}px;
`;

const FilledContainer = styled(BaseContainer)`
  border-width: 0;
  background-color: ${props => props.theme.colors.border};
  padding-horizontal: ${props => props.theme.spacing.md}px;
`;

const StyledInput = styled.TextInput`
  flex: 1;
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.textPrimary};
  height: 50px;
`;

const IconContainer = styled.View`
  margin-horizontal: ${props => props.theme.spacing.xs}px;
`;

const ErrorMessage = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.error};
  margin-top: ${props => props.theme.spacing.xs}px;
`;
