# GroceryGunj Environment Management

This document outlines the environment configuration system for the GroceryGunj app, following the Expo best practices and .windsurfrules guidelines.

## Environment Files

The app uses environment-specific `.env` files for configuration:

- `.env.development` - Local development configuration
- `.env.staging` - Staging/QA environment configuration
- `.env.production` - Production environment configuration

Each file contains environment-specific variables such as API URLs, feature flags, and configuration values.

## Environment Variables

All environment variables are prefixed with `EXPO_PUBLIC_` to make them accessible at runtime according to Expo's guidelines.

Key variables include:

- `EXPO_PUBLIC_API_URL` - Backend API endpoint
- `EXPO_PUBLIC_SUPABASE_URL` - Supabase project URL
- `EXPO_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous API key
- `EXPO_PUBLIC_APP_ENV` - Current environment (development/staging/production)

## EAS Build Configuration

The `eas.json` file defines build profiles for different environments:

- `development` - For local testing with development client
- `preview` - For internal testing using staging environment
- `production` - For App Store and Play Store releases

## Usage

### Local Development

For local development, the app will automatically use `.env.development`:

```bash
npx expo start
```

### Building for Different Environments

To build the app for a specific environment:

```bash
# Development build
eas build --profile development --platform ios

# Staging build for internal testing
eas build --profile preview --platform ios

# Production build for App Store/Play Store
eas build --profile production --platform ios
```

Replace `ios` with `android` for Android builds.

### Accessing Environment Variables in Code

Use the config utility to access environment variables consistently:

```typescript
import config from '@/utils/config';

// Use environment-specific configuration
const apiUrl = config.apiUrl;
const isProduction = config.isProduction;

// Feature flags
if (config.enableAnalytics) {
  // Initialize analytics
}
```

### Adding New Environment Variables

1. Add the variable to all environment files (`.env.development`, `.env.staging`, `.env.production`)
2. Add the variable to the `AppConfig` interface in `utils/config.ts`
3. Add the variable to the `config` object in `utils/config.ts`

## Security Considerations

- Never commit real production keys to the repository
- Use EAS secret management for sensitive values:
  ```bash
  eas secret:create --scope project --name SUPABASE_ANON_KEY --value "your-secret-key"
  ```

- For local development, create a `.env.development.local` file (which is git-ignored) for sensitive values

## CI/CD Integration

When using CI/CD pipelines, set the `ENVIRONMENT` variable appropriately:

```yaml
# GitHub Actions example
jobs:
  build-staging:
    steps:
      - name: Build Staging App
        run: eas build --profile preview --platform all
        env:
          ENVIRONMENT: staging
```

The app will automatically load the correct `.env.[environment]` file based on the `ENVIRONMENT` variable.
