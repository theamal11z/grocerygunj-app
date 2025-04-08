import React, { ReactNode } from 'react';
import { View, ViewProps } from 'react-native';
import styled from 'styled-components/native';

interface CardProps extends ViewProps {
  children: ReactNode;
  variant?: 'elevation' | 'outlined' | 'flat';
  padding?: keyof typeof spacingMap;
}

const spacingMap = {
  none: 0,
  small: 8,
  medium: 16,
  large: 24,
};

export function Card({
  children,
  variant = 'elevation',
  padding = 'medium',
  style,
  ...rest
}: CardProps) {
  const CardContainer = getCardContainer(variant);
  
  return (
    <CardContainer
      padding={padding}
      style={style}
      {...rest}
    >
      {children}
    </CardContainer>
  );
}

// Helper function to get the appropriate card container based on variant
function getCardContainer(variant: 'elevation' | 'outlined' | 'flat') {
  switch (variant) {
    case 'elevation':
      return ElevatedCard;
    case 'outlined':
      return OutlinedCard;
    case 'flat':
      return FlatCard;
    default:
      return ElevatedCard;
  }
}

// Base Card styling
const BaseCard = styled(View)<{ padding: keyof typeof spacingMap }>`
  border-radius: ${props => props.theme.borderRadius.md}px;
  padding: ${props => spacingMap[props.padding]}px;
  background-color: ${props => props.theme.colors.white};
`;

// Card variants
const ElevatedCard = styled(BaseCard)`
  shadow-color: ${props => props.theme.colors.shadow};
  shadow-offset: 0px 2px;
  shadow-opacity: 0.1;
  shadow-radius: 4px;
  elevation: 2;
`;

const OutlinedCard = styled(BaseCard)`
  border-width: 1px;
  border-color: ${props => props.theme.colors.border};
`;

const FlatCard = styled(BaseCard)`
  /* No additional styling for flat cards */
`;
