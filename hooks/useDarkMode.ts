import { useColorScheme } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ColorScheme = 'light' | 'dark' | 'system';
const THEME_STORAGE_KEY = 'user-theme-preference';

export function useDarkMode() {
  const systemScheme = useColorScheme() as 'light' | 'dark';
  const [userTheme, setUserTheme] = useState<ColorScheme>('system');
  const [isLoading, setIsLoading] = useState(true);

  // Load the user's preferred theme from storage
  useEffect(() => {
    async function loadThemePreference() {
      try {
        const storedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
          setUserTheme(storedTheme as ColorScheme);
        }
      } catch (error) {
        console.error('Failed to load theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadThemePreference();
  }, []);

  // Set the theme based on user preference or system setting
  const isDarkMode = userTheme === 'system' 
    ? systemScheme === 'dark'
    : userTheme === 'dark';

  // Save the user's theme preference to storage
  const setColorScheme = async (scheme: ColorScheme) => {
    try {
      setUserTheme(scheme);
      await AsyncStorage.setItem(THEME_STORAGE_KEY, scheme);
    } catch (error) {
      console.error('Failed to save theme preference:', error);
    }
  };

  return {
    isDarkMode,
    colorScheme: userTheme,
    setColorScheme,
    isLoading,
    systemColorScheme: systemScheme,
  };
}
