import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import styled from 'styled-components/native';

interface SafeAreaViewProps {
  children: ReactNode;
  backgroundColor?: string;
  edges?: Array<'top' | 'right' | 'bottom' | 'left'>;
}

export function SafeAreaView({ 
  children, 
  backgroundColor = '#FFFFFF',
  edges = ['top', 'right', 'bottom', 'left']
}: SafeAreaViewProps) {
  const insets = useSafeAreaInsets();
  
  const paddingTop = edges.includes('top') ? insets.top : 0;
  const paddingRight = edges.includes('right') ? insets.right : 0;
  const paddingBottom = edges.includes('bottom') ? insets.bottom : 0;
  const paddingLeft = edges.includes('left') ? insets.left : 0;
  
  return (
    <Container 
      style={{ 
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        backgroundColor
      }}
    >
      {children}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
`;
