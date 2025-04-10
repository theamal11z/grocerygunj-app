import { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { router } from 'expo-router';
import Animated, { FadeIn } from 'react-native-reanimated';
import { useAuth } from '@/hooks/useAuth';

export default function SplashScreen() {
  const { session, loading } = useAuth();

  useEffect(() => {
    const checkSessionAndNavigate = async () => {
      // Wait for auth to initialize and loading to complete
      if (loading) return;

      // Add a slight delay for better UX
      const timer = setTimeout(() => {
        // If user is authenticated, go to tabs, otherwise go to auth
        if (session) {
          router.replace('/(tabs)');
        } else {
          router.replace('/auth');
        }
      }, 2000);

      return () => clearTimeout(timer);
    };

    checkSessionAndNavigate();
  }, [session, loading]);

  return (
    <View style={styles.container}>
      <Animated.Image
        entering={FadeIn.duration(1000)}
        source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop' }}
        style={styles.logo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
});