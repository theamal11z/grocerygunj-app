# Grocery Guj

A modern grocery shopping app built with React Native and Expo.

## Features

- User authentication and profile management
- Product browsing by categories
- Shopping cart functionality
- Order placement and tracking
- Address and payment method management
- **Coupon and discount system**

## Environment Setup

This project uses Expo's built-in environment variables system for configuration:

1. Create a `.env` file in the root directory based on `.env.example`
2. Add your Supabase credentials and other environment variables
3. Environment variables are accessed through the app.config.js configuration

Example:
```bash
# .env file
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

All environment variables are centrally managed through the `utils/env.ts` helper, which provides type-safe access to configuration values.

## Coupon System

The app now includes a complete coupon system that allows users to:

- View available offers on the Offers screen
- Apply coupon codes during checkout
- See real-time discount calculations
- Track discounts in order history

### Implementation Details

The coupon system is integrated across multiple parts of the app:

1. **Database**: Offers table stores coupon codes, discount amounts, and validity periods
2. **API**: Coupon validation and application logic in useOffers hook
3. **UI Components**: Coupon input field in checkout, applied coupon display in cart
4. **Order Processing**: Discount amounts are saved with orders and displayed in summaries

### How to Use Coupons

1. Browse available offers in the Offers screen
2. Copy a coupon code
3. During checkout, paste the code in the coupon field and tap "Apply"
4. The discount will be applied to your order total
5. Complete checkout to use the coupon

## Technology Stack

- React Native / Expo
- TypeScript
- Supabase for backend and authentication
- React Navigation
- Lucide icons

## Running the App

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your actual configuration values

# Start the development server
npm run dev
```

## License

MIT 