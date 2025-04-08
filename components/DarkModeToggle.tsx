import React from 'react';
import { Switch } from 'react-native';
import styled from 'styled-components/native';
import { Sun, Moon } from 'lucide-react-native';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useTranslation } from '@/hooks/useTranslation';
import { getAccessibleProps } from '@/utils/accessibility';

interface DarkModeToggleProps {
  /**
   * Show label text alongside the toggle
   * @default false
   */
  showLabel?: boolean;
  
  /**
   * Size of the toggle (affects icon size and container height)
   * @default "medium"
   */
  size?: 'small' | 'medium' | 'large';
  
  /**
   * Optional callback when mode changes
   */
  onChange?: (isDarkMode: boolean) => void;
}

/**
 * DarkModeToggle Component
 * 
 * Allows users to toggle between light and dark mode
 * with accessible controls and visual indicators
 */
export default function DarkModeToggle({
  showLabel = false,
  size = 'medium',
  onChange,
}: DarkModeToggleProps) {
  const { isDarkMode, setColorScheme } = useDarkMode();
  const { t } = useTranslation();
  
  // Determine icon size based on toggle size
  const getIconSize = () => {
    switch (size) {
      case 'small': return 16;
      case 'large': return 24;
      default: return 20;
    }
  };
  
  const handleToggle = () => {
    const newMode = isDarkMode ? 'light' : 'dark';
    setColorScheme(newMode);
    if (onChange) {
      onChange(!isDarkMode);
    }
  };
  
  const iconSize = getIconSize();
  
  return (
    <Container size={size}>
      {isDarkMode ? (
        <Moon size={iconSize} color="#fff" />
      ) : (
        <Sun size={iconSize} color="#333" />
      )}
      
      {showLabel && (
        <LabelText isDarkMode={isDarkMode}>
          {isDarkMode ? t('settings.darkModeOn') : t('settings.darkModeOff')}
        </LabelText>
      )}
      
      <StyledSwitch
        value={isDarkMode}
        onValueChange={handleToggle}
        trackColor={{ false: '#ccc', true: '#2ECC71' }}
        thumbColor="#fff"
        {...getAccessibleProps(t('settings.toggleDarkMode'), 'switch')}
      />
    </Container>
  );
}

// Get container height based on size
const getContainerHeight = (size: string) => {
  switch (size) {
    case 'small': return 36;
    case 'large': return 56;
    default: return 44;
  }
};

// Styled components
const Container = styled.View<{ size: string }>`
  flex-direction: row;
  align-items: center;
  height: ${props => getContainerHeight(props.size)}px;
  background-color: ${props => props.theme.colors.card};
  padding-horizontal: ${props => props.theme.spacing.md}px;
  border-radius: ${props => props.theme.borderRadius.md}px;
`;

const LabelText = styled.Text<{ isDarkMode: boolean }>`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.textPrimary};
  margin-horizontal: ${props => props.theme.spacing.md}px;
  flex: 1;
`;

const StyledSwitch = styled(Switch)`
  margin-left: ${props => props.theme.spacing.sm}px;
`;
