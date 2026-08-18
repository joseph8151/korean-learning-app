import type { ExpoConfig } from 'expo/config';

/**
 * Rename the app by editing these three constants. Everything else derives
 * from them, so `KoreanGo` is a placeholder you can swap in one place.
 */
const APP_NAME = 'KoreanGo';
// Must match the slug of the EAS project that EAS_PROJECT_ID points at, not
// the app's display name. EAS rejects the build if these disagree.
const SLUG = 'korean-language-labs';
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

  // EAS needs these declared up front. It cannot write them itself because
  // this is a dynamic config (.ts rather than app.json), which is what made
  // the build fail with "Cannot automatically write to dynamic config".
  runtimeVersion: { policy: 'appVersion' },

  // Over-the-air updates. `eas.json` gives each build profile a channel, and
  // expo-updates needs somewhere to look for a matching bundle. With this,
  // a JavaScript-only fix can ship with `eas update` in minutes instead of
  // waiting on a store review — native changes still need a new build.
  //
  // The runtimeVersion policy above is the safety catch: a build only accepts
  // updates that declare the same app version, so a JS bundle can never land
  // on a binary whose native modules do not match it.
  updates: {
    url: `https://u.expo.dev/${EAS_PROJECT_ID}`,
    fallbackToCacheTimeout: 0,
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: IOS_BUNDLE_ID,
    buildNumber: '1',
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSMicrophoneUsageDescription:
        'KoreanGo records your voice so you can play it back next to the native audio and hear the difference. Recordings stay on this device and are deleted when you move on.',
    },
  },

  android: {
    package: ANDROID_PACKAGE,
    // No versionCode here on purpose: eas.json sets appVersionSource to
    // "remote", so EAS owns the build number and increments it per build. A
    // value here would be ignored and would drift out of sync.
    adaptiveIcon: {
      foregroundImage: './assets/android-icon-foreground.png',
      backgroundImage: './assets/android-icon-background.png',
      monochromeImage: './assets/android-icon-monochrome.png',
      backgroundColor: '#6C63FF',
    },
    permissions: [
      'VIBRATE',
      'POST_NOTIFICATIONS',
      // Speaking practice records the learner so they can play their own
      // attempt back against the native audio. Nothing is uploaded and each
      // clip is deleted as soon as they move to the next phrase — see
      // services/recording.ts and the privacy policy.
      'RECORD_AUDIO',
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
