import Constants from "expo-constants";

function resolvePlatform(): string {
  return (
    Constants.expoConfig?.android?.package ??
    Constants.expoConfig?.ios?.bundleIdentifier ??
    process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ??
    "host.exp.exponent"
  );
}

/** Appwrite Cloud endpoint must end with `/v1` (e.g. `https://cloud.appwrite.io/v1`). */
export const appwriteConfig = {
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT ?? "",
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID ?? "",
  databaseId: process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID ?? "",
  agentCollectionId: process.env.EXPO_PUBLIC_APPWRITE_AGENT_COLLECTION_ID ?? "",
  gallaryCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_GALLARY_COLLECTION_ID ?? "",
  reviewsCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_REVIEWS_COLLECTION_ID ?? "",
  propertiesCollectionId:
    process.env.EXPO_PUBLIC_APPWRITE_PROPERTIES_COLLECTION_ID ?? "",
  /** Must match the Android package name or iOS bundle ID registered under Appwrite Auth → Platforms. */
  platform: process.env.EXPO_PUBLIC_APPWRITE_PLATFORM ?? resolvePlatform(),
};
