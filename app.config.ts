import type { ExpoConfig } from 'expo/config';

/**
 * Rename the app by editing these three constants. Everything else derives
 * from them, so `KoreanGo` is a placeholder you can swap in one place.
 */
const APP_NAME = 'KoreanGo';
const SLUG = 'koreango';
const ANDROID_PACKAGE = 'com.koreango.app';
const IOS_BUNDLE_ID = 'com.koreango.app';
const SCHEME = 'koreango';
const VERSION = '1.0.0';
const EAS_ACCOUNT = 'joseph815s-team';

/**
 * Links builds to the EAS project. A public identifier, not a secret, so it
 * belongs in source — it cannot live in `.env` because that file is
 * git-ignored and therefore never reaches the EAS build servers.
 */
const EAS_PROJECT_ID =
  process.env.EAS_PROJECT_ID ?? '62c1f081-2370-4938-86a4-bdd882b1ed82';

const config: ExpoConfig = {
  name: APP_NAME,
  slug: SLUG,
  // The EAS project lives under a team account, not a personal one. Without
  // this, builds resolve the wrong owner and fail.
  owner: EAS_ACCOUNT,
  scheme: SCHEME,
  version: VERSION,
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  backgroundColor: '#F8F9FD',

  assetBundlePatterns: ['**/*'],

  ios: {
    supportsTablet: true,
    bundleIdentifier: IOS_BUNDLE_ID,
    buildNumber: '1',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      // NSMicrophoneUsageDescription goes back here when speaking practice
      // actually records audio. See the Android note below.
    },
  },

  android: {
    package: ANDROID_PACKAGE,
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
      backgroundColor: '#6C63FF',
    },
    // RECORD_AUDIO is deliberately absent: speaking practice currently measures
    // only how long you spoke and captures no audio. Declaring an unused
    // sensitive permission contradicts our privacy policy and invites Play
    // review questions. Add it back in the same commit that ships real
    // recording.
    permissions: [
      'VIBRATE',
      'POST_NOTIFICATIONS',
      // Required by Google Play Billing.
      'com.android.vending.BILLING',
    ],
    blockedPermissions: ['ACCESS_FINE_LOCATION', 'ACCESS_COARSE_LOCATION'],
  },

  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/favicon.png',
  },

  plugins: [
    'expo-router',
    'expo-secure-store',
    'expo-web-browser',
    [
      'expo-splash-screen',
      {
        image: './assets/splash-icon.png',
        imageWidth: 180,
        resizeMode: 'contain',
        backgroundColor: '#6C63FF',
      },
    ],
    [
      'expo-notifications',
      {
        icon: './assets/android-icon-monochrome.png',
        color: '#6C63FF',
      },
    ],
  ],

  experiments: {
    typedRoutes: false,
  },

  extra: {
    eas: {
      projectId: EAS_PROJECT_ID || undefined,
    },
  },
};

export default config;
