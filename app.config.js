const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Determine which environment to use based on EAS_BUILD_PROFILE or NODE_ENV
const envName = process.env.EAS_BUILD_PROFILE || process.env.NODE_ENV || 'development';
const envPath = path.resolve(__dirname, `.env.${envName}`);

// Check if the environment file exists, otherwise use development as fallback
const finalEnvPath = fs.existsSync(envPath) 
  ? envPath 
  : path.resolve(__dirname, '.env.development');

// Load environment variables from the appropriate .env file
const env = dotenv.config({ path: finalEnvPath }).parsed || {};

// Export the Expo configuration
module.exports = ({ config }) => {
  // Define the app version and build number
  const version = process.env.APP_VERSION || '1.0.0';
  const buildNumber = process.env.BUILD_NUMBER || '1';
  
  return {
    ...config,
    name: "GroceryGunj",
    slug: "grocerygunj",
    version,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#2ECC71"
    },
    assetBundlePatterns: [
      "**/*"
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.grocerygunj.app",
      buildNumber,
      infoPlist: {
        UIBackgroundModes: ["remote-notification"],
        NSCameraUsageDescription: "This app uses the camera to scan barcodes for product information.",
        NSPhotoLibraryUsageDescription: "This app uses the photo library to let you choose profile pictures."
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#2ECC71"
      },
      package: "com.grocerygunj.app",
      versionCode: parseInt(buildNumber),
      permissions: [
        "CAMERA",
        "READ_EXTERNAL_STORAGE",
        "WRITE_EXTERNAL_STORAGE"
      ]
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      ...env,
      eas: {
        projectId: "your-eas-project-id"
      }
    },
    updates: {
      fallbackToCacheTimeout: 0,
      url: "https://u.expo.dev/your-eas-project-id"
    },
    runtimeVersion: {
      policy: "sdkVersion"
    },
    plugins: [
      "expo-router",
      "expo-localization",
      [
        "expo-updates",
        {
          username: "your-expo-username"
        }
      ]
    ]
  };
};
