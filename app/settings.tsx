import React, { useCallback } from 'react';
import { View, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import styled from 'styled-components/native';
import { SafeAreaView } from '@/components/SafeAreaView';
import { useTranslation } from '@/hooks/useTranslation';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useAppState } from '@/hooks/useAppState';
import { LogOut, Moon, Sun, Globe, Bell, Shield, ChevronRight } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import { getAccessibleProps } from '@/utils/accessibility';

/**
 * Settings Screen Component
 * Allows users to configure app preferences including language, theme, and notifications
 */
export default function SettingsScreen() {
  const { t, locale, availableLocales, changeLocale } = useTranslation();
  const { isDarkMode, colorScheme, setColorScheme } = useDarkMode();
  const { state, dispatch } = useAppState();
  const { signOut } = useAuth();
  
  // Get the display name for the current locale
  const getLanguageDisplayName = useCallback((localeCode: string) => {
    const languageNames: Record<string, string> = {
      en: 'English',
      hi: 'हिन्दी (Hindi)',
    };
    
    return languageNames[localeCode] || localeCode;
  }, []);
  
  // Toggle notifications
  const toggleNotifications = useCallback(() => {
    dispatch({
      type: 'SET_PREFERENCES',
      payload: {
        notificationsEnabled: !state.preferences.notificationsEnabled,
      },
    });
  }, [state.preferences.notificationsEnabled, dispatch]);
  
  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    setColorScheme(isDarkMode ? 'light' : 'dark');
  }, [isDarkMode, setColorScheme]);
  
  // Show language selection dialog
  const showLanguageOptions = useCallback(() => {
    Alert.alert(
      t('settings.selectLanguage'),
      t('settings.chooseLanguage'),
      availableLocales.map(code => ({
        text: getLanguageDisplayName(code),
        onPress: () => changeLocale(code),
        style: code === locale ? 'cancel' : 'default',
      })),
      { cancelable: true }
    );
  }, [t, availableLocales, locale, changeLocale, getLanguageDisplayName]);
  
  // Handle logout
  const handleLogout = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  }, [signOut]);
  
  return (
    <Container>
      <Header>
        <HeaderTitle>{t('profile.settings')}</HeaderTitle>
      </Header>
      
      <Content>
        <Section>
          <SectionTitle>{t('settings.appearance')}</SectionTitle>
          
          <SettingRow>
            <SettingIconContainer>
              {isDarkMode ? (
                <Moon size={22} color={isDarkMode ? '#fff' : '#333'} />
              ) : (
                <Sun size={22} color={isDarkMode ? '#fff' : '#333'} />
              )}
            </SettingIconContainer>
            <SettingContent>
              <SettingLabel>{t('settings.darkMode')}</SettingLabel>
              <SettingValue>{isDarkMode ? t('common.on') : t('common.off')}</SettingValue>
            </SettingContent>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#ccc', true: '#2ECC71' }}
              thumbColor="#fff"
              {...getAccessibleProps(t('settings.toggleDarkMode'), 'button')}
            />
          </SettingRow>
          
          <SettingRow onPress={showLanguageOptions}>
            <SettingIconContainer>
              <Globe size={22} color={isDarkMode ? '#fff' : '#333'} />
            </SettingIconContainer>
            <SettingContent>
              <SettingLabel>{t('settings.language')}</SettingLabel>
              <SettingValue>{getLanguageDisplayName(locale)}</SettingValue>
            </SettingContent>
            <ChevronRight size={20} color={isDarkMode ? '#fff' : '#333'} />
          </SettingRow>
        </Section>
        
        <Section>
          <SectionTitle>{t('settings.notifications')}</SectionTitle>
          
          <SettingRow>
            <SettingIconContainer>
              <Bell size={22} color={isDarkMode ? '#fff' : '#333'} />
            </SettingIconContainer>
            <SettingContent>
              <SettingLabel>{t('settings.enableNotifications')}</SettingLabel>
              <SettingValue>
                {state.preferences.notificationsEnabled ? t('common.on') : t('common.off')}
              </SettingValue>
            </SettingContent>
            <Switch
              value={state.preferences.notificationsEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: '#ccc', true: '#2ECC71' }}
              thumbColor="#fff"
              {...getAccessibleProps(t('settings.toggleNotifications'), 'button')}
            />
          </SettingRow>
        </Section>
        
        <Section>
          <SectionTitle>{t('settings.security')}</SectionTitle>
          
          <SettingRow onPress={() => router.push('/privacy-security')}>
            <SettingIconContainer>
              <Shield size={22} color={isDarkMode ? '#fff' : '#333'} />
            </SettingIconContainer>
            <SettingContent>
              <SettingLabel>{t('settings.privacySecurity')}</SettingLabel>
            </SettingContent>
            <ChevronRight size={20} color={isDarkMode ? '#fff' : '#333'} />
          </SettingRow>
        </Section>
        
        <LogoutButton 
          onPress={handleLogout}
          {...getAccessibleProps(t('profile.logout'), 'button')}
        >
          <LogOut size={22} color="#fff" />
          <LogoutText>{t('profile.logout')}</LogoutText>
        </LogoutButton>
      </Content>
    </Container>
  );
}

// Styled components
const Container = styled(SafeAreaView)`
  flex: 1;
  backgroundColor: ${props => props.theme.colors.background};
`;

const Header = styled.View`
  padding: ${props => props.theme.spacing.lg}px;
  borderBottomWidth: 1px;
  borderBottomColor: ${props => props.theme.colors.border};
`;

const HeaderTitle = styled.Text`
  fontFamily: ${props => props.theme.typography.fontFamily.bold};
  fontSize: ${props => props.theme.typography.fontSize.xl}px;
  color: ${props => props.theme.colors.textPrimary};
`;

const Content = styled.ScrollView`
  flex: 1;
`;

const Section = styled.View`
  margin-bottom: ${props => props.theme.spacing.xl}px;
`;

const SectionTitle = styled.Text`
  fontFamily: ${props => props.theme.typography.fontFamily.semiBold};
  fontSize: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.textSecondary};
  margin: ${props => props.theme.spacing.md}px ${props => props.theme.spacing.lg}px;
  textTransform: uppercase;
`;

const SettingRow = styled.TouchableOpacity`
  flexDirection: row;
  alignItems: center;
  padding: ${props => props.theme.spacing.lg}px;
  backgroundColor: ${props => props.theme.colors.card};
  borderBottomWidth: 1px;
  borderBottomColor: ${props => props.theme.colors.border};
`;

const SettingIconContainer = styled.View`
  width: 40px;
  height: 40px;
  borderRadius: 20px;
  backgroundColor: ${props => props.theme.colors.primaryLight};
  alignItems: center;
  justifyContent: center;
  marginRight: ${props => props.theme.spacing.md}px;
`;

const SettingContent = styled.View`
  flex: 1;
`;

const SettingLabel = styled.Text`
  fontFamily: ${props => props.theme.typography.fontFamily.medium};
  fontSize: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.textPrimary};
`;

const SettingValue = styled.Text`
  fontFamily: ${props => props.theme.typography.fontFamily.regular};
  fontSize: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.textSecondary};
  marginTop: 2px;
`;

const LogoutButton = styled.TouchableOpacity`
  flexDirection: row;
  alignItems: center;
  justifyContent: center;
  margin: ${props => props.theme.spacing.xl}px;
  padding: ${props => props.theme.spacing.md}px;
  backgroundColor: ${props => props.theme.colors.error};
  borderRadius: ${props => props.theme.borderRadius.md}px;
`;

const LogoutText = styled.Text`
  fontFamily: ${props => props.theme.typography.fontFamily.semiBold};
  fontSize: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.white};
  marginLeft: ${props => props.theme.spacing.sm}px;
`;