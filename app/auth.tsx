import React, { useState, useCallback } from 'react';
import { KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Mail, Lock, User } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { ErrorMessage } from '@/components/ErrorMessage';
import { SafeAreaScrollView } from '@/components/SafeAreaScrollView';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import styled from 'styled-components/native';
import { useTranslation } from '@/hooks/useTranslation';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useResponsive, useBreakpoints } from '@/hooks/useResponsive';
import { loginSchema, signupSchema, validateWithZod } from '@/utils/validation';
import { logError } from '@/utils/errorLogger';
import { getAccessibleProps } from '@/utils/accessibility';

export default function AuthScreen() {
  const { signIn, signUp, error } = useAuth();
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { isMobile } = useBreakpoints();
  
  // Form state
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Field-level validation errors
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Responsive styling
  const formPadding = useResponsive({ base: 20, md: 40, lg: 60 });
  const logoSize = useResponsive({ base: 80, md: 100, lg: 120 });
  
  // Clear errors when changing form fields
  const handleChangeEmail = useCallback((value: string) => {
    setEmail(value);
    setValidationErrors(prev => ({ ...prev, email: '' }));
  }, []);
  
  const handleChangePassword = useCallback((value: string) => {
    setPassword(value);
    setValidationErrors(prev => ({ ...prev, password: '' }));
  }, []);
  
  const handleChangeFullName = useCallback((value: string) => {
    setFullName(value);
    setValidationErrors(prev => ({ ...prev, fullName: '' }));
  }, []);
  
  const validateForm = useCallback(() => {
    // Use the appropriate schema based on form mode
    const schema = isLogin ? loginSchema : signupSchema;
    const formData = isLogin 
      ? { email, password }
      : { email, password, fullName };
    
    // Validate with Zod
    const result = validateWithZod(schema, formData);
    
    if (!result.success) {
      // Convert validation errors to a more usable format
      const errors: Record<string, string> = {};
      result.errors.forEach(err => {
        errors[err.field] = err.message;
      });
      
      setValidationErrors(errors);
      return false;
    }
    
    // Clear any existing validation errors
    setValidationErrors({});
    return true;
  }, [isLogin, email, password, fullName]);
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setIsSubmitting(true);
      
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password, {
          data: {
            full_name: fullName,
          },
        });
      }
    } catch (err) {
      logError({
        message: `Authentication ${isLogin ? 'login' : 'signup'} failed`,
        error: err as Error,
        context: { email },
      });
      
      Alert.alert(
        t('auth.error'),
        t(isLogin ? 'auth.loginFailed' : 'auth.signupFailed'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const switchMode = useCallback(() => {
    setIsLogin(!isLogin);
    setEmail('');
    setPassword('');
    setFullName('');
    setValidationErrors({});
  }, [isLogin]);
  
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <SafeAreaScrollView 
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: 'center', 
          padding: formPadding 
        }}
      >
        <LogoContainer>
          <Title 
            {...getAccessibleProps(t('app.name'), 'header')}
          >
            {t('app.name')}
          </Title>
          <Subtitle 
            {...getAccessibleProps(
              isLogin ? t('auth.welcomeBack') : t('auth.createAccount'), 
              'text'
            )}
          >
            {isLogin ? t('auth.welcomeBack') : t('auth.createAccount')}
          </Subtitle>
        </LogoContainer>

        <FormContainer>
          {!isLogin && (
            <Input
              label={t('auth.fullName')}
              placeholder={t('auth.fullNamePlaceholder')}
              value={fullName}
              onChangeText={handleChangeFullName}
              autoCapitalize="words"
              leftIcon={<User size={20} color={isDarkMode ? '#fff' : '#666'} />}
              error={validationErrors.fullName}
              autoComplete="name"
              textContentType="name"
              returnKeyType="next"
            />
          )}

          <Input
            label={t('auth.email')}
            placeholder={t('auth.emailPlaceholder')}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={handleChangeEmail}
            leftIcon={<Mail size={20} color={isDarkMode ? '#fff' : '#666'} />}
            error={validationErrors.email}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
          />

          <Input
            label={t('auth.password')}
            placeholder={t('auth.passwordPlaceholder')}
            secureTextEntry
            value={password}
            onChangeText={handleChangePassword}
            leftIcon={<Lock size={20} color={isDarkMode ? '#fff' : '#666'} />}
            error={validationErrors.password}
            autoComplete={isLogin ? "password" : "new-password"}
            textContentType={isLogin ? "password" : "newPassword"}
            returnKeyType="done"
          />

          {error && <ErrorMessage message={error.message} />}

          <Button 
            label={isLogin ? t('auth.login') : t('auth.signup')}
            onPress={handleSubmit}
            isDisabled={isSubmitting}
            isLoading={isSubmitting}
            isFullWidth
            variant="primary"
            size="large"
          />

          <SwitchButton
            onPress={switchMode}
            accessibilityRole="button"
          >
            <SwitchText>
              {isLogin
                ? t('auth.noAccount')
                : t('auth.alreadyHaveAccount')}
            </SwitchText>
          </SwitchButton>
        </FormContainer>
      </SafeAreaScrollView>
    </KeyboardAvoidingView>
  );
}

const LogoContainer = styled.View`
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xxl}px;
`;

const Title = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => props.theme.typography.fontSize.xxxl}px;
  color: ${props => props.theme.colors.primary};
  text-align: center;
  margin-bottom: ${props => props.theme.spacing.sm}px;
`;

const Subtitle = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  color: ${props => props.theme.colors.textSecondary};
  text-align: center;
`;

const FormContainer = styled.View`
  width: 100%;
  gap: ${props => props.theme.spacing.lg}px;
`;

const SwitchButton = styled.TouchableOpacity`
  margin-top: ${props => props.theme.spacing.md}px;
  align-items: center;
`;

const SwitchText = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.primary};
`;