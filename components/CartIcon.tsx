import React, { useEffect, useState, useRef } from 'react';
import { TouchableOpacity, Text, Animated } from 'react-native';
import { ShoppingCart } from 'lucide-react-native';
import { router } from 'expo-router';
import { useCart } from '@/lib/CartContext';
import styled from 'styled-components/native';

interface CartIconProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
}

export function CartIcon({ 
  size = 24, 
  color = '#333', 
  backgroundColor = '#f5f5f5' 
}: CartIconProps) {
  const { getCartTotals } = useCart();
  const { itemCount } = getCartTotals();
  const [prevCount, setPrevCount] = useState(itemCount);
  
  // Animation for the badge when count changes
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  useEffect(() => {
    // Only animate if the count has changed and is not the initial render
    if (prevCount !== itemCount) {
      // Animate the badge
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Animate the cart icon with a pulse effect
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
      
      // Update previous count
      setPrevCount(itemCount);
    }
  }, [itemCount, scaleAnim, pulseAnim, prevCount]);

  const handlePress = () => {
    router.push('/cart');
  };

  return (
    <Container 
      backgroundColor={backgroundColor}
      onPress={handlePress}
      accessibilityLabel={`Cart with ${itemCount} items`}
      accessibilityRole="button"
    >
      <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
        <ShoppingCart size={size} color={color} />
      </Animated.View>
      
      {itemCount > 0 && (
        <Badge 
          style={{
            transform: [{ scale: scaleAnim }]
          }}
        >
          <BadgeText>
            {itemCount > 99 ? '99+' : itemCount}
          </BadgeText>
        </Badge>
      )}
    </Container>
  );
}

interface ContainerProps {
  backgroundColor: string;
}

const Container = styled(TouchableOpacity)<ContainerProps>`
  padding: ${props => props.theme.spacing.sm}px;
  borderRadius: ${props => props.theme.borderRadius.md}px;
  position: relative;
  backgroundColor: ${props => props.backgroundColor};
`;

const Badge = styled(Animated.View)`
  position: absolute;
  top: -5px;
  right: -5px;
  backgroundColor: ${props => props.theme.colors.error};
  borderRadius: 10px;
  minWidth: 20px;
  height: 20px;
  justifyContent: center;
  alignItems: center;
  paddingHorizontal: 4px;
  borderWidth: 1.5px;
  borderColor: ${props => props.theme.colors.white};
`;

const BadgeText = styled.Text`
  color: ${props => props.theme.colors.white};
  fontSize: 10px;
  fontFamily: ${props => props.theme.typography.fontFamily.semiBold};
  textAlign: center;
`;