import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { logError, ErrorSource, ErrorSeverity } from '@/utils/errorLogger';
import { ArrowLeft, AlertTriangle, RefreshCw } from 'lucide-react-native';
import { useTheme, ThemeProvider } from 'styled-components/native';
import styled from 'styled-components/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getAccessibleProps } from '@/utils/accessibility';
import * as Updates from 'expo-updates';
import { router } from 'expo-router';
import { lightTheme } from '@/lib/theme';

// Fallback theme for when the ThemeProvider isn't available
const fallbackTheme = {
  ...lightTheme,
  typography: {
    ...lightTheme.typography,
    fontFamily: {
      ...lightTheme.typography.fontFamily,
      monospace: 'monospace', // Add missing monospace font
    }
  },
  colors: {
    ...lightTheme.colors,
    errorLight: '#FFEBEE', // Add missing errorLight color
  },
  mode: 'light' as const, // Explicitly type as 'light' literal
};

// Wrap functional components to provide translations to the class component
function ErrorFallbackWithTranslation(props: { 
  error: Error; 
  resetError: () => void;
  navigateBack: () => void;
  reloadApp: () => void;
}) {
  const { t } = useTranslation();
  let theme;
  
  try {
    // Try to use the theme from context, if available
    theme = useTheme();
  } catch (error) {
    // If ThemeProvider isn't available, use fallback theme
    console.warn('ThemeProvider not available in ErrorBoundary, using fallback theme');
    theme = fallbackTheme;
  }
  
  const ErrorFallback = (
    <FallbackContainer>
      <ErrorContent>
        <IconContainer>
          <AlertTriangle size={50} color={theme.colors.error} />
        </IconContainer>
        
        <ErrorTitle {...getAccessibleProps(t('errors.errorOccurred'), 'header')}>
          {t('errors.errorOccurred')}
        </ErrorTitle>
        
        <ErrorDescription {...getAccessibleProps(t('errors.tryAgainMessage'), 'text')}>
          {t('errors.tryAgainMessage')}
        </ErrorDescription>
        
        {__DEV__ && (
          <ErrorDetails {...getAccessibleProps(t('errors.details'), 'text')}>
            {props.error.toString()}
          </ErrorDetails>
        )}
        
        <ButtonsContainer>
          <ActionButton 
            onPress={props.resetError}
            {...getAccessibleProps(t('errors.tryAgain'), 'button')}
          >
            <ButtonIcon>
              <RefreshCw size={20} color={theme.colors.white} />
            </ButtonIcon>
            <ButtonText>{t('errors.tryAgain')}</ButtonText>
          </ActionButton>
          
          <ActionButton 
            onPress={props.navigateBack}
            {...getAccessibleProps(t('errors.goBack'), 'button')}
          >
            <ButtonIcon>
              <ArrowLeft size={20} color={theme.colors.white} />
            </ButtonIcon>
            <ButtonText>{t('errors.goBack')}</ButtonText>
          </ActionButton>
          
          {!__DEV__ && (
            <ActionButton 
              onPress={props.reloadApp}
              {...getAccessibleProps(t('errors.restartApp'), 'button')}
            >
              <ButtonText>{t('errors.restartApp')}</ButtonText>
            </ActionButton>
          )}
        </ButtonsContainer>
      </ErrorContent>
    </FallbackContainer>
  );
  
  // If we're using the fallback theme, wrap in ThemeProvider
  if (theme === fallbackTheme) {
    return (
      <ThemeProvider theme={fallbackTheme}>
        {ErrorFallback}
      </ThemeProvider>
    );
  }
  
  // Otherwise, just return the ErrorFallback directly
  return ErrorFallback;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component
 * 
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI instead of crashing.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { 
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to our error tracking service
    logError({
      message: 'Error caught by ErrorBoundary',
      error,
      source: ErrorSource.UNKNOWN,
      severity: ErrorSeverity.ERROR,
      context: {
        componentStack: errorInfo.componentStack
      }
    });
    
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }
  
  resetError = (): void => {
    this.setState({ hasError: false, error: null });
  };
  
  navigateBack = (): void => {
    // Go back to previous screen or home if not possible
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/');
    }
    
    this.resetError();
  };
  
  reloadApp = async (): Promise<void> => {
    if (Platform.OS !== 'web') {
      try {
        // Check for new updates
        const update = await Updates.checkForUpdateAsync();
        
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        } else {
          // If no update, just reload the current experience
          await Updates.reloadAsync();
        }
      } catch (err) {
        // If OTA update fails, just reset the error state
        this.resetError();
      }
    } else {
      // For web, just reload the page
      window.location.reload();
    }
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      // Make sure the error component is wrapped with a ThemeProvider in case
      // the error occurred before the ThemeProvider was mounted
      return (
        <ThemeProvider theme={fallbackTheme}>
          <ErrorFallbackWithTranslation 
            error={this.state.error as Error}
            resetError={this.resetError}
            navigateBack={this.navigateBack}
            reloadApp={this.reloadApp}
          />
        </ThemeProvider>
      );
    }

    return this.props.children;
  }
}

// Styled components
const FallbackContainer = styled(SafeAreaView)`
  flex: 1;
  background-color: ${props => props.theme.colors.background};
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.lg}px;
`;

const ErrorContent = styled.View`
  align-items: center;
  width: 100%;
  max-width: 500px;
`;

const IconContainer = styled.View`
  margin-bottom: ${props => props.theme.spacing.lg}px;
`;

const ErrorTitle = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => props.theme.typography.fontSize.xl}px;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: ${props => props.theme.spacing.md}px;
  text-align: center;
`;

const ErrorDescription = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xl}px;
  text-align: center;
`;

const ErrorDetails = styled.Text`
  font-family: ${props => 
    // Use conditional to handle potential missing monospace font
    props.theme.typography.fontFamily.monospace || 'monospace'
  };
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.error};
  padding: ${props => props.theme.spacing.md}px;
  background-color: ${props => 
    // Use conditional to handle potential missing errorLight color
    props.theme.colors.errorLight || '#FFEBEE'
  };
  border-radius: ${props => props.theme.borderRadius.md}px;
  margin-bottom: ${props => props.theme.spacing.xl}px;
  width: 100%;
  overflow: scroll;
`;

const ButtonsContainer = styled.View`
  flex-direction: column;
  width: 100%;
  gap: ${props => props.theme.spacing.md}px;
`;

const ActionButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.primary};
  padding: ${props => props.theme.spacing.md}px;
  border-radius: ${props => props.theme.borderRadius.md}px;
`;

const ButtonIcon = styled.View`
  margin-right: ${props => props.theme.spacing.sm}px;
`;

const ButtonText = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.white};
  text-align: center;
`;
