import React, { useCallback } from 'react';
import { TouchableOpacity, Image } from 'react-native';
import styled from 'styled-components/native';
import { Heart, MinusCircle, PlusCircle, Star } from 'lucide-react-native';
import { useTranslation } from '@/hooks/useTranslation';
import { useDarkMode } from '@/hooks/useDarkMode';
import { useWishlistContext } from '@/hooks/WishlistContext';
import { useCart } from '@/lib/CartContext';
import { getProductAccessibleLabel } from '@/utils/accessibility';

export interface ProductCardProps {
  product: {
    id: string | number;
    name: string;
    price: number;
    image: string;
    unit?: string;
    discount?: number;
    rating?: number;
    ratingCount?: number;
    description?: string;
    category?: string;
  };
  onPress?: () => void;
}

/**
 * ProductCard Component
 * 
 * Displays a product with image, name, price, rating and add-to-cart functionality
 * Follows styled-components pattern and accessibility guidelines
 */
export default function ProductCard({ product, onPress }: ProductCardProps) {
  const { isDarkMode } = useDarkMode();
  const { t } = useTranslation();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlistContext();
  const { cartItems, addToCart, removeFromCart } = useCart();
  
  const isWishlisted = isInWishlist(product.id.toString());
  
  // Find if product is in cart and get quantity
  const getItemQuantity = useCallback(() => {
    const cartItem = cartItems.find(item => 
      item.product_id === product.id || 
      item.product_id === product.id.toString()
    );
    return cartItem ? cartItem.quantity : 0;
  }, [cartItems, product.id]);
  
  const quantity = getItemQuantity();
  const discountedPrice = product.discount ? 
    product.price * (1 - product.discount / 100) : product.price;
  
  // Accessible label for screen readers
  const accessibleLabel = getProductAccessibleLabel({
    name: product.name,
    price: product.price,
    discount: product.discount,
    unit: product.unit,
    rating: product.rating
  });
  
  const handleWishlistToggle = useCallback((e: any) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(product.id.toString());
    } else {
      addToWishlist(product.id.toString());
    }
  }, [product.id, isWishlisted, addToWishlist, removeFromWishlist]);
  
  const handleAddToCart = useCallback((e: any) => {
    e.stopPropagation();
    addToCart(product.id.toString());
  }, [product.id, addToCart]);
  
  const handleRemoveFromCart = useCallback((e: any) => {
    e.stopPropagation();
    // Find the cart item ID to remove
    const cartItem = cartItems.find(item => 
      item.product_id === product.id || 
      item.product_id === product.id.toString()
    );
    
    if (cartItem) {
      removeFromCart(cartItem.id);
    }
  }, [product.id, cartItems, removeFromCart]);
  
  return (
    <Container 
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityLabel={accessibleLabel}
      accessibilityRole="button"
      accessibilityHint={t('product.tapToViewDetails')}
    >
      <WishlistButton 
        onPress={handleWishlistToggle}
        accessibilityLabel={
          isWishlisted ? 
          t('product.removeFromWishlist', { name: product.name }) : 
          t('product.addToWishlist', { name: product.name })
        }
        accessibilityRole="button"
      >
        <Heart 
          size={22} 
          color={isWishlisted ? '#FF3B30' : (isDarkMode ? '#fff' : '#333')} 
          fill={isWishlisted ? '#FF3B30' : 'transparent'} 
        />
      </WishlistButton>
      
      <ImageContainer>
        <ProductImage 
          source={{ uri: product.image }} 
          resizeMode="contain"
          accessibilityRole="image"
          accessible={false}
        />
      </ImageContainer>
      
      {product.discount && product.discount > 0 && (
        <DiscountTag>
          <DiscountText>{t('product.percentOff', { percent: product.discount })}</DiscountText>
        </DiscountTag>
      )}
      
      <ProductDetails>
        <Name numberOfLines={2}>{product.name}</Name>
        
        {product.unit && (
          <Unit>{product.unit}</Unit>
        )}
        
        {product.rating && (
          <RatingContainer>
            <Star size={14} color="#FFC107" fill="#FFC107" />
            <RatingText>{product.rating}</RatingText>
            {product.ratingCount && (
              <RatingCount>({product.ratingCount})</RatingCount>
            )}
          </RatingContainer>
        )}
        
        <PriceContainer>
          <Price>{t('product.currency', { price: discountedPrice.toFixed(0) })}</Price>
          {product.discount && product.discount > 0 && (
            <OriginalPrice>{t('product.currency', { price: product.price.toFixed(0) })}</OriginalPrice>
          )}
        </PriceContainer>
      </ProductDetails>
      
      <QuantityContainer>
        {quantity > 0 ? (
          <QuantityControls>
            <QuantityButton 
              onPress={handleRemoveFromCart}
              accessibilityLabel={t('product.decreaseQuantity', { name: product.name })}
              accessibilityRole="button"
            >
              <MinusCircle size={24} color={isDarkMode ? '#fff' : '#333'} />
            </QuantityButton>
            
            <QuantityText>{quantity}</QuantityText>
            
            <QuantityButton 
              onPress={handleAddToCart}
              accessibilityLabel={t('product.increaseQuantity', { name: product.name })}
              accessibilityRole="button"
            >
              <PlusCircle size={24} color="#2ECC71" />
            </QuantityButton>
          </QuantityControls>
        ) : (
          <AddToCartButton 
            onPress={handleAddToCart}
            accessibilityLabel={t('product.addToCart', { name: product.name })}
            accessibilityRole="button"
          >
            <AddToCartText>{t('product.addToCart')}</AddToCartText>
            <PlusCircle size={20} color="#fff" />
          </AddToCartButton>
        )}
      </QuantityContainer>
    </Container>
  );
}

// Styled components
const Container = styled(TouchableOpacity)`
  width: 48%;
  background-color: ${props => props.theme.colors.card};
  border-radius: ${props => props.theme.borderRadius.md}px;
  margin-bottom: ${props => props.theme.spacing.lg}px;
  overflow: hidden;
  ${props => props.theme.shadows.small}
`;

const WishlistButton = styled.TouchableOpacity`
  position: absolute;
  top: ${props => props.theme.spacing.sm}px;
  right: ${props => props.theme.spacing.sm}px;
  z-index: 1;
  width: 36px;
  height: 36px;
  border-radius: 18px;
  background-color: ${props => props.theme.colors.card};
  justify-content: center;
  align-items: center;
  opacity: 0.9;
`;

const ImageContainer = styled.View`
  height: 140px;
  width: 100%;
  justify-content: center;
  align-items: center;
  padding: ${props => props.theme.spacing.sm}px;
`;

const ProductImage = styled(Image)`
  height: 120px;
  width: 120px;
`;

const DiscountTag = styled.View`
  position: absolute;
  top: ${props => props.theme.spacing.sm}px;
  left: ${props => props.theme.spacing.sm}px;
  background-color: ${props => props.theme.colors.error};
  border-radius: ${props => props.theme.borderRadius.sm}px;
  padding: ${props => props.theme.spacing.xs}px ${props => props.theme.spacing.sm}px;
`;

const DiscountText = styled.Text`
  color: ${props => props.theme.colors.white};
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
`;

const ProductDetails = styled.View`
  padding: ${props => props.theme.spacing.md}px;
`;

const Name = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.textPrimary};
  margin-bottom: ${props => props.theme.spacing.xs}px;
  height: 40px;
`;

const Unit = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.textSecondary};
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const RatingContainer = styled.View`
  flex-direction: row;
  align-items: center;
  margin-bottom: ${props => props.theme.spacing.xs}px;
`;

const RatingText = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.textPrimary};
  margin-left: ${props => props.theme.spacing.xs}px;
`;

const RatingCount = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.xs}px;
  color: ${props => props.theme.colors.textSecondary};
  margin-left: ${props => props.theme.spacing.xs}px;
`;

const PriceContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Price = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => props.theme.typography.fontSize.lg}px;
  color: ${props => props.theme.colors.primary};
`;

const OriginalPrice = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.regular};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.textSecondary};
  text-decoration-line: line-through;
  margin-left: ${props => props.theme.spacing.sm}px;
`;

const QuantityContainer = styled.View`
  padding: ${props => props.theme.spacing.sm}px ${props => props.theme.spacing.md}px;
  padding-top: 0;
`;

const QuantityControls = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const QuantityButton = styled.TouchableOpacity`
  padding: ${props => props.theme.spacing.xs}px;
`;

const QuantityText = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.bold};
  font-size: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.textPrimary};
  min-width: 24px;
  text-align: center;
`;

const AddToCartButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.sm}px;
  padding: ${props => props.theme.spacing.sm}px;
`;

const AddToCartText = styled.Text`
  font-family: ${props => props.theme.typography.fontFamily.medium};
  font-size: ${props => props.theme.typography.fontSize.sm}px;
  color: ${props => props.theme.colors.white};
  margin-right: ${props => props.theme.spacing.xs}px;
`;
