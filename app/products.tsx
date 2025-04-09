import React, { useEffect, useState, useCallback } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import styled from 'styled-components/native';
import { ChevronLeft, SlidersHorizontal } from 'lucide-react-native';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useTranslation } from '@/hooks/useTranslation';
import { useDarkMode } from '@/hooks/useDarkMode';
import { SafeAreaView } from '@/components/SafeAreaView';
import ProductCard from '@/components/ProductCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ErrorMessage } from '@/components/ErrorMessage';
import { getAccessibleProps } from '@/utils/accessibility';
import type { Product } from '@/lib/supabase';

/**
 * Products Screen
 * Displays a grid of products filtered by category
 */
export default function ProductsScreen() {
  const { categoryId } = useLocalSearchParams();
  const { products, loading: productsLoading, error: productsError } = useProducts();
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories();
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);

  useEffect(() => {
    if (categoryId && products) {
      const filtered = products.filter(product => product.category_id === categoryId);
      setFilteredProducts(filtered);
      
      // Find category name
      const category = categories?.find(cat => cat.id === categoryId);
      if (category) {
        setCurrentCategory(category.name);
      }
    } else if (products) {
      setFilteredProducts(products);
    }
  }, [categoryId, products, categories]);

  // Navigate to product detail
  const handleProductPress = useCallback((product: Product) => {
    router.push({
      pathname: '/product/[id]',
      params: { id: product.id },
    });
  }, []);

  // Handle filter press - we'll handle this with an alert for now
  // since the /filters route might not exist yet
  const handleFilterPress = useCallback(() => {
    // Using alert instead of routing to a non-existent page
    alert(t('product.filtersComingSoon'));
  }, [t]);

  if (productsLoading || categoriesLoading) {
    return <LoadingSpinner />;
  }

  if (productsError || categoriesError) {
    return <ErrorMessage message={t('errors.failedToLoadProducts')} />;
  }

  return (
    <Container>
      <Header>
        <BackButton 
          onPress={() => router.back()}
          {...getAccessibleProps(t('common.back'), 'button')}
        >
          <ChevronLeft size={24} color={isDarkMode ? '#fff' : '#333'} />
        </BackButton>
        <Title>{currentCategory || t('products.allProducts')}</Title>
        <FilterButton 
          onPress={handleFilterPress}
          {...getAccessibleProps(t('products.filter'), 'button')}
        >
          <SlidersHorizontal size={24} color={isDarkMode ? '#fff' : '#333'} />
        </FilterButton>
      </Header>

      {filteredProducts.length === 0 ? (
        <EmptyStateContainer>
          <EmptyStateText>{t('products.noProductsFound')}</EmptyStateText>
        </EmptyStateContainer>
      ) : (
        <Content>
          <ProductsGrid>
            {filteredProducts.map((product) => (
              <ProductCardWrapper key={product.id}>
                <ProductCard
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image_urls?.[0] || 'https://via.placeholder.com/150',
                    unit: product.unit,
                    discount: product.discount || 0,
                    rating: product.rating,
                    // Pass review count as rating count for UI display
                    ratingCount: product.review_count,
                    description: product.description,
                    category: currentCategory || '',
                  }}
                  onPress={() => handleProductPress(product)}
                />
              </ProductCardWrapper>
            ))}
          </ProductsGrid>
        </Content>
      )}
    </Container>
  );
}

// Styled components
const Container = styled(SafeAreaView)`
  flex: 1;
  backgroundColor: ${props => props.theme.colors.background};
`;

const Header = styled.View`
  flexDirection: row;
  alignItems: center;
  justifyContent: space-between;
  paddingHorizontal: ${props => props.theme.spacing.lg}px;
  paddingVertical: ${props => props.theme.spacing.md}px;
  borderBottomWidth: 1px;
  borderBottomColor: ${props => props.theme.colors.border};
`;

const BackButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  alignItems: center;
  justifyContent: center;
`;

const Title = styled.Text`
  fontFamily: ${props => props.theme.typography.fontFamily.semiBold};
  fontSize: ${props => props.theme.typography.fontSize.lg}px;
  color: ${props => props.theme.colors.textPrimary};
  flex: 1;
  textAlign: center;
`;

const FilterButton = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  alignItems: center;
  justifyContent: center;
`;

const Content = styled.ScrollView`
  flex: 1;
  padding: ${props => props.theme.spacing.lg}px;
`;

const ProductsGrid = styled.View`
  flexDirection: row;
  flexWrap: wrap;
  justifyContent: space-between;
`;

const ProductCardWrapper = styled.View`
  width: 48%;
  margin-bottom: ${props => props.theme.spacing.md}px;
`;

const EmptyStateContainer = styled.View`
  flex: 1;
  justifyContent: center;
  alignItems: center;
  padding: ${props => props.theme.spacing.xl}px;
`;

const EmptyStateText = styled.Text`
  fontFamily: ${props => props.theme.typography.fontFamily.medium};
  fontSize: ${props => props.theme.typography.fontSize.md}px;
  color: ${props => props.theme.colors.textSecondary};
  textAlign: center;
`;