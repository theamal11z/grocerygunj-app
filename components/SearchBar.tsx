import React, { useState, useCallback } from 'react';
import { TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import styled from 'styled-components/native';
import { Search, X } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useDarkMode } from '@/hooks/useDarkMode';

interface SearchBarProps {
  /**
   * Placeholder text for the search input
   * @default t('common.search')
   */
  placeholder?: string;
  
  /**
   * Initial value for the search input
   */
  initialValue?: string;
  
  /**
   * Called when the search query changes
   */
  onChangeText?: (text: string) => void;
  
  /**
   * Called when the search button is pressed on the keyboard
   */
  onSubmit?: (text: string) => void;
  
  /**
   * Show loading indicator
   * @default false
   */
  isLoading?: boolean;
  
  /**
   * Autofocus the search input when component mounts
   * @default false
   */
  autoFocus?: boolean;
}

/**
 * SearchBar Component
 * 
 * A reusable search bar component with dark mode support,
 * loading state, and accessibility features
 */
export default function SearchBar({
  placeholder,
  initialValue = '',
  onChangeText,
  onSubmit,
  isLoading = false,
  autoFocus = false,
}: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  
  const handleChangeText = useCallback((text: string) => {
    setQuery(text);
    if (onChangeText) {
      onChangeText(text);
    }
  }, [onChangeText]);
  
  const handleSubmit = useCallback(() => {
    if (onSubmit) {
      onSubmit(query);
    }
  }, [query, onSubmit]);
  
  const handleClear = useCallback(() => {
    setQuery('');
    if (onChangeText) {
      onChangeText('');
    }
  }, [onChangeText]);
  
  return (
    <Container>
      <SearchIcon>
        <Search 
          size={20} 
          color={isDarkMode ? '#aaa' : '#666'} 
        />
      </SearchIcon>
      
      <Input
        value={query}
        onChangeText={handleChangeText}
        onSubmitEditing={handleSubmit}
        placeholder={placeholder || t('common.search')}
        placeholderTextColor={isDarkMode ? '#aaa' : '#999'}
        returnKeyType="search"
        autoCapitalize="none"
        autoCorrect={false}
        autoFocus={autoFocus}
        clearButtonMode="never"
        accessibilityRole="search"
        accessibilityLabel={placeholder || t('common.search')}
        accessibilityHint={t('common.searchAccessibilityHint')}
      />
      
      {isLoading ? (
        <LoadingIndicator size="small" color="#2ECC71" />
      ) : (
        query.length > 0 && (
          <ClearButton 
            onPress={handleClear}
            accessibilityRole="button"
            accessibilityLabel={t('common.clear')}
          >
            <X size={20} color={isDarkMode ? '#aaa' : '#666'} />
          </ClearButton>
        )
      )}
    </Container>
  );
}

// Styled components
const Container = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding-horizontal: ${props => props.theme.spacing.md}px;
  height: 48px;
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const Input = styled(TextInput)`
  flex: 1;
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.textPrimary};
  padding-vertical: ${props => props.theme.spacing.xs}px;
  height: 100%;
`;

const SearchIcon = styled.View`
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const ClearButton = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing.xs}px;
  margin-left: ${props => props.theme.spacing.xs}px;
`;

const LoadingIndicator = styled(ActivityIndicator)`
  margin-left: ${props => props.theme.spacing.xs}px;
`;
