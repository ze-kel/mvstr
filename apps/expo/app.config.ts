import type { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "mvstr",
  slug: "mvstr",
  scheme: "mvstr",
  version: "0.1.1",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/splash.jpg",
    resizeMode: "contain",
    backgroundColor: "#1F104A",
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/1ce2ef06-26b6-4954-b889-a9d9a1f6c962",
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    bundleIdentifier: "com.mvstr.mvapp",
    supportsTablet: false,
  },
  android: {
    package: "your.bundle.identifier",
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#1F104A",
    },
  },
  extra: {
    eas: {
      projectId: "1ce2ef06-26b6-4954-b889-a9d9a1f6c962",
    },
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  plugins: [
    "expo-router",
    "expo-secure-store",
    "expo-font",
    [
      "expo-contacts",
      {
        contactsPermission: "Allow $(PRODUCT_NAME) to access your contacts.",
      },
    ],
  ],
});
