import type { ConfigContext, ExpoConfig } from '@expo/config';

type ExpoPlugins = NonNullable<ExpoConfig['plugins']>;

export default ({ config }: ConfigContext): ExpoConfig => {
  const nativePlugins: ExpoPlugins =
    process.env.EXPO_PLATFORM === 'native'
      ? [
          ['expo-dev-client', { launchMode: 'most-recent' }],
          'react-native-maps',
          [
            'expo-notifications',
            {
              color: '#00bdbd',
              defaultChannel: 'maintenance',
            },
          ],
        ]
      : [];

  return {
    ...config,
    name: 'MATCH Flow',
    slug: 'matchflow',
    version: process.env.BILT_APP_VERSION ?? '1.0.0',
    orientation: 'portrait',
    icon: './assets/app-icon/app-icon.png',
    userInterfaceStyle: 'automatic',
    scheme: 'matchflow',
    runtimeVersion: {
      policy: 'appVersion',
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      infoPlist: {
        ITSAppUsesNonExemptEncryption: false,
      },
      supportsTablet: true,
      bundleIdentifier: process.env.BILT_IOS_BUNDLE_ID ?? 'com.yourcompany.yourapp',
    },
    android: {
      allowBackup: false,
      package: process.env.BILT_ANDROID_PACKAGE ?? 'com.yourcompany.yourapp',
      adaptiveIcon: {
        foregroundImage: './assets/app-icon/adaptive-foreground.png',
        backgroundColor: '#0d1a2e',
      },
    },
    web: {
      bundler: 'metro',
      // 'single' = SPA export: one index.html + client routing, so edge serving
      // needs only a single 404→index.html fallback rule.
      output: 'single',
      favicon: './public/icons/favicon.png',
      // Browser tab / search title (substituted into public/index.html).
      name: 'MATCH Flow: The Biomedical Command Center | The HARNESS Project',
      shortName: 'MATCH Flow',
      description:
        'Free panic-to-plan app: 72-hour PEP window timer, clinic finder, boundary scripts and a SafER Score. No sign-ups. Your entries stay on your phone.',
      themeColor: '#0d1a2e',
      backgroundColor: '#0d1a2e',
    },
    extra: {
      appStoreAppId: process.env.BILT_APP_STORE_APP_ID,
    },
    plugins: [
      'expo-router',
      'expo-font',
      'expo-splash-screen',
      'expo-status-bar',
      [
        'expo-location',
        {
          locationWhenInUsePermission:
            'MATCH Flow uses your location only when you tap Use current location, to find your ZIP code on this device. It is never saved or sent.',
        },
      ],
      ...nativePlugins,
    ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true,
    },
  };
};
