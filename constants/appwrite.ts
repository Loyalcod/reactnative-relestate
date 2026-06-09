import Constants from 'expo-constants';

function resolvePlatform(): string {
  return (
    Constants.expoConfig?.android?.package ??
    Constants.expoConfig?.ios?.bundleIdentifier ??
    process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ??
    'host.exp.exponent'
  );
}

/** Appwrite Cloud endpoint must end with `/v1` (e.g. `https://cloud.appwrite.io/v1`). */
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? '',
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? '',
  /** Must match the Android package name or iOS bundle ID registered under Appwrite Auth → Platforms. */
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ?? resolvePlatform(),
};
