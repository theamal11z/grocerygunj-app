import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { AnimationConfig } from '@/lib/AnimationConfig';

interface Category {
  name: string;
  count: number;
}

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return null;
  }
  
  // Check if animations are enabled globally
  const animationsEnabled = AnimationConfig.isEnabled();
  
  return (
    <Animated.View entering={animationsEnabled ? FadeIn.delay(100).duration(300) : undefined}>
      <Text style={styles.filterTitle}>Filter by category</Text>
      <ScrollView 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterOptions}
      >
        <TouchableOpacity
          style={[
            styles.filterOption,
            selectedCategory === null ? styles.selectedFilter : null
          ]}
          onPress={() => onSelectCategory(null)}
        >
          <Text style={[
            styles.filterOptionText,
            selectedCategory === null ? styles.selectedFilterText : null
          ]}>
            All Categories
          </Text>
        </TouchableOpacity>
        
        {categories.map(category => (
          category && category.name ? (
            <TouchableOpacity
              key={category.name}
              style={[
                styles.filterOption,
                selectedCategory === category.name ? styles.selectedFilter : null
              ]}
              onPress={() => onSelectCategory(category.name)}
            >
              <Text style={[
                styles.filterOptionText,
                selectedCategory === category.name ? styles.selectedFilterText : null
              ]}>
                {category.name} ({category.count})
              </Text>
            </TouchableOpacity>
          ) : null
        ))}
      </ScrollView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  filterTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
    paddingHorizontal: 16,
  },
  filterOptions: {
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selectedFilter: {
    backgroundColor: '#e3f2fd',
    borderColor: '#2196f3',
  },
  filterOptionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: '#666',
  },
  selectedFilterText: {
    color: '#2196f3',
  },
}); 