import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing, interpolate, FadeIn } from 'react-native-reanimated';
import { FAQ } from '@/hooks/useHelpSupport';
import { AnimationConfig } from '@/lib/AnimationConfig';

interface FAQItemProps {
  faq: FAQ;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  highlightTerms?: string[];
}

export function FAQItem({ faq, index, isExpanded, onToggle, highlightTerms = [] }: FAQItemProps) {
  // Early return if faq data is missing
  if (!faq || !faq.question || !faq.answer) {
    return null;
  }

  const rotateAnim = useSharedValue(0);
  const heightAnim = useSharedValue(0);
  
  // Check if animations are enabled globally
  const animationsEnabled = AnimationConfig.isEnabled();
  
  // Update animation values when expanded state changes
  React.useEffect(() => {
    // Skip animations if globally disabled
    if (!animationsEnabled) {
      rotateAnim.value = isExpanded ? 1 : 0;
      heightAnim.value = isExpanded ? 1 : 0;
      return;
    }
    
    rotateAnim.value = withTiming(isExpanded ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
    
    heightAnim.value = withTiming(isExpanded ? 1 : 0, {
      duration: 300,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });
  }, [isExpanded, rotateAnim, heightAnim, animationsEnabled]);
  
  // Create animated styles
  const iconStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { 
          rotate: `${interpolate(rotateAnim.value, [0, 1], [0, 180])}deg` 
        }
      ],
    };
  });
  
  // Highlight text if search terms are provided
  const highlightText = (text: string) => {
    if (!highlightTerms.length) return text;
    
    let result = text;
    const lowercaseText = text.toLowerCase();
    
    highlightTerms.forEach(term => {
      if (!term.trim()) return;
      
      const termLower = term.toLowerCase();
      if (lowercaseText.includes(termLower)) {
        // Create a regular expression that matches the term with case insensitivity
        const regex = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        result = result.replace(regex, '**$1**');
      }
    });
    
    // Split by ** markers and render
    if (result.includes('**')) {
      const parts = result.split('**');
      return parts.map((part, i) => {
        // Every odd index will be a highlighted part
        return i % 2 === 1 ? 
          <Text key={i} style={styles.highlightedText}>{part}</Text> : 
          part;
      });
    }
    
    return result;
  };
  
  return (
    <Animated.View 
      entering={animationsEnabled ? FadeIn.delay(index * 100).duration(300) : undefined}
      style={[
        styles.faqItem,
        isExpanded ? styles.expandedItem : null
      ]}
    >
      <TouchableOpacity
        style={styles.faqHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Text style={styles.faqQuestion}>
          {highlightText(faq.question)}
        </Text>
        <Animated.View style={iconStyle}>
          <ChevronDown size={20} color="#666" />
        </Animated.View>
      </TouchableOpacity>
      
      {isExpanded && (
        <Animated.View style={styles.faqAnswerContainer}>
          <Text style={styles.faqAnswer}>
            {highlightText(faq.answer)}
          </Text>
        </Animated.View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  faqItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  expandedItem: {
    borderColor: '#e3f2fd',
    backgroundColor: '#fafeff',
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  faqQuestion: {
    flex: 1,
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#333',
    marginRight: 8,
  },
  faqAnswerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  faqAnswer: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  highlightedText: {
    backgroundColor: '#fff9c4',
    color: '#333',
    fontFamily: 'Poppins-Medium',
  },
}); 