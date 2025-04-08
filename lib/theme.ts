// Theme configuration for the GroceryGunj app
// Following the .windsurfrules guidelines

const lightColors = {
  primary: '#2ECC71',
  primaryLight: '#E8F5E9',
  secondary: '#333333',
  textPrimary: '#333333',
  textSecondary: '#666666',
  background: '#f9f9f9',
  card: '#ffffff',
  white: '#ffffff',
  error: '#FF3B30',
  success: '#34C759',
  warning: '#FFC107',
  border: '#f5f5f5',
  shadow: '#000000',
};

const darkColors = {
  primary: '#2ECC71',
  primaryLight: '#1a4d33',
  secondary: '#333333',
  textPrimary: '#FFFFFF',
  textSecondary: '#AAAAAA',
  background: '#121212',
  card: '#1E1E1E',
  white: '#FFFFFF',
  error: '#FF453A',
  success: '#30D158',
  warning: '#FFD60A',
  border: '#2C2C2C',
  shadow: '#000000',
};

export const typography = {
  fontFamily: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  circle: 9999,
};

const lightShadows = {
  small: {
    shadowColor: lightColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: lightColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: lightColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};

const darkShadows = {
  small: {
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  large: {
    shadowColor: darkColors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
};

// Create light and dark themes
export const lightTheme = {
  colors: lightColors,
  typography,
  spacing,
  borderRadius,
  shadows: lightShadows,
  mode: 'light',
};

export const darkTheme = {
  colors: darkColors,
  typography,
  spacing,
  borderRadius,
  shadows: darkShadows,
  mode: 'dark',
};

// Export defaults
export const colors = lightColors;
export const shadows = lightShadows;

// Default theme is light theme
export default lightTheme;
