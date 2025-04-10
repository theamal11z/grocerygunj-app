import { useCallback } from 'react';
import { ViewStyle } from 'react-native';
import Animated, { EntryExitAnimationFunction, LayoutAnimationFunction } from 'react-native-reanimated';
import { AnimationConfig } from '@/lib/AnimationConfig';

/**
 * Hook for safely using Reanimated animations with proper guards
 * Helps prevent crashes in production by disabling animations when needed
 */
export function useAnimatedSafe() {
  const animationsEnabled = AnimationConfig.isEnabled();
  
  /**
   * Creates a safe animation component that only applies animation
   * when enabled and data is ready
   */
  const SafeAnimatedView = useCallback(({
    children,
    entering,
    exiting,
    layout,
    style,
    isDataReady = true,
    ...props
  }: {
    children: React.ReactNode;
    entering?: EntryExitAnimationFunction | undefined;
    exiting?: EntryExitAnimationFunction | undefined;
    layout?: LayoutAnimationFunction | undefined;
    style?: ViewStyle | ViewStyle[];
    isDataReady?: boolean;
    [key: string]: any;
  }) => {
    // Only apply animations if globally enabled and data is ready
    const shouldAnimate = animationsEnabled && isDataReady;
    
    return (
      <Animated.View
        entering={shouldAnimate ? entering : undefined}
        exiting={shouldAnimate ? exiting : undefined}
        layout={shouldAnimate ? layout : undefined}
        style={style}
        {...props}
      >
        {children}
      </Animated.View>
    );
  }, [animationsEnabled]);
  
  /**
   * Conditionally enables animation props based on global settings and data readiness
   * Returns undefined for the prop if animations should be disabled
   */
  const safeAnimationProps = useCallback((isDataReady = true) => {
    const shouldAnimate = animationsEnabled && isDataReady;
    
    return {
      getEntering: (animation?: EntryExitAnimationFunction) => 
        shouldAnimate ? animation : undefined,
      getExiting: (animation?: EntryExitAnimationFunction) => 
        shouldAnimate ? animation : undefined,
      getLayout: (animation?: LayoutAnimationFunction) => 
        shouldAnimate ? animation : undefined,
    };
  }, [animationsEnabled]);
  
  return {
    SafeAnimatedView,
    safeAnimationProps,
    animationsEnabled
  };
} 