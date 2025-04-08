/**
 * Accessibility utilities for the GroceryGunj app
 * Following the .windsurfrules guidelines for accessibility
 */

// Convert prices to accessible string format
export function formatAccessiblePrice(price: number, currency = 'INR'): string {
  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
  
  // Make it more screen reader friendly
  return `${formattedPrice} ${currency === 'INR' ? 'rupees' : currency}`;
}

// Create accessible label for product items
export function getProductAccessibleLabel(product: {
  name: string;
  price: number;
  discount?: number;
  unit?: string;
  rating?: number;
}): string {
  const { name, price, discount, unit, rating } = product;
  const finalPrice = discount ? price * (1 - discount / 100) : price;
  
  let label = `${name}, `;
  
  if (unit) {
    label += `${unit}, `;
  }
  
  label += formatAccessiblePrice(finalPrice);
  
  if (discount && discount > 0) {
    const originalPrice = formatAccessiblePrice(price);
    label += `, discounted from ${originalPrice}, ${discount}% off`;
  }
  
  if (rating) {
    label += `, rated ${rating} out of 5 stars`;
  }
  
  return label;
}

// Helper for screen reader focus management
export function getAccessibleProps(
  label: string, 
  role: 'button' | 'header' | 'link' | 'image' | 'search' | 'text' | 'adjustable' | 'imagebutton' | 'checkbox' | 'radio' | 'spinbutton' | 'menu' | 'menubar' | 'menuitem' | 'summary' = 'button',
  hint?: string,
  isDisabled = false,
): {
  accessibilityLabel: string;
  accessibilityRole: typeof role;
  accessibilityHint?: string;
  accessibilityState?: { disabled: boolean };
} {
  const props = {
    accessibilityLabel: label,
    accessibilityRole: role,
  };
  
  // Add optional properties if they exist
  if (hint) {
    Object.assign(props, { accessibilityHint: hint });
  }
  
  if (isDisabled) {
    Object.assign(props, { accessibilityState: { disabled: true } });
  }
  
  return props;
}
