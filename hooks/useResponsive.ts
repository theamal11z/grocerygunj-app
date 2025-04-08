import { useWindowDimensions } from 'react-native';

interface ResponsiveValues<T> {
  base: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
}

type Breakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';

// Breakpoint sizes (can be adjusted as needed)
const breakpoints = {
  sm: 480,
  md: 768,
  lg: 992,
  xl: 1280,
};

/**
 * A hook to handle responsive values based on screen size
 * 
 * @example
 * const fontSize = useResponsive({
 *   base: 16,
 *   sm: 18,
 *   md: 20,
 *   lg: 24,
 * });
 */
export function useResponsive<T>(values: ResponsiveValues<T>): T {
  const { width } = useWindowDimensions();
  
  // Determine the current breakpoint
  const getCurrentBreakpoint = (): Breakpoint => {
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'base';
  };
  
  // Get the value for the current breakpoint (or the closest smaller one)
  const getValueForBreakpoint = (): T => {
    const currentBreakpoint = getCurrentBreakpoint();
    
    // Check each breakpoint from current down to base
    switch (currentBreakpoint) {
      case 'xl':
        if (values.xl !== undefined) return values.xl;
        // Fall through if xl is not defined
      case 'lg':
        if (values.lg !== undefined) return values.lg;
        // Fall through if lg is not defined
      case 'md':
        if (values.md !== undefined) return values.md;
        // Fall through if md is not defined
      case 'sm':
        if (values.sm !== undefined) return values.sm;
        // Fall through if sm is not defined
      default:
        return values.base;
    }
  };
  
  return getValueForBreakpoint();
}

/**
 * A hook that returns an object with boolean values for each breakpoint
 * 
 * @example
 * const { isMobile, isTablet, isDesktop } = useBreakpoints();
 * if (isMobile) {
 *   // Do something for mobile
 * }
 */
export function useBreakpoints() {
  const { width } = useWindowDimensions();
  
  return {
    isMobile: width < breakpoints.md,
    isTablet: width >= breakpoints.md && width < breakpoints.lg,
    isDesktop: width >= breakpoints.lg,
    width,
  };
}
