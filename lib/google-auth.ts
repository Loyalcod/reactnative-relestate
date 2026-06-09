import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';
import { OAuthProvider } from 'react-native-appwrite';

import { appwriteConfig } from '@/constants/appwrite';

import { account } from './appwrite';

function getQueryParam(
  params: Record<string, string | string[] | undefined> | undefined,
  key: string,
): string | undefined {
  const v = params?.[key];
  if (typeof v === 'string') return v;
  if (Array.isArray(v) && v.length > 0 && typeof v[0] === 'string') return v[0];
  return undefined;
}

export function parseOAuthCallbackUrl(url: string): {
  userId?: string;
  secret?: string;
  error?: string;
  error_description?: string;
} {
  const { queryParams } = Linking.parse(url);
  const qp = queryParams ?? {};
  return {
    userId: getQueryParam(qp, 'userId'),
    secret: getQueryParam(qp, 'secret'),
    error: getQueryParam(qp, 'error'),
    error_description: getQueryParam(qp, 'error_description'),
  };
}

/**
 * Mobile OAuth uses the OAuth2 **token** endpoint so Appwrite returns `userId` + `secret`
 * on your redirect URL; then `createSession` attaches the session to this client.
 */
export async function completeSessionFromOAuthRedirect(url: string): Promise<void> {
  const { userId, secret, error, error_description } = parseOAuthCallbackUrl(url);
  if (error) {
    throw new Error(error_description ?? error);
  }
  if (!userId || !secret) {
    throw new Error('Missing OAuth credentials in redirect URL');
  }
  await account.createSession({ userId, secret });
}

export async function loginWithGoogle(): Promise<void> {
  if (!appwriteConfig.endpoint || !appwriteConfig.projectId) {
    throw new Error(
      'Configure EXPO_PUBLIC_APPWRITE_ENDPOINT and EXPO_PUBLIC_APPWRITE_PROJECT_ID (see constants/appwrite.ts).',
    );
  }

  const redirectUri = Linking.createURL('/sign-in');
  const authUrl = account.createOAuth2Token({
    provider: OAuthProvider.Google,
    success: redirectUri,
    failure: redirectUri,
  }) as URL;

  const result = await WebBrowser.openAuthSessionAsync(authUrl.href, redirectUri);

  if (result.type !== 'success' || !result.url) {
    throw new Error(result.type === 'cancel' ? 'Login cancelled' : 'Google sign-in was not completed');
  }

  await completeSessionFromOAuthRedirect(result.url);
}
