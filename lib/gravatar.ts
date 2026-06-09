import * as Crypto from 'expo-crypto';

type GravatarDefault =
  | 'mp'
  | 'identicon'
  | 'monsterid'
  | 'wavatar'
  | 'retro'
  | 'robohash'
  | 'blank';

/**
 * Builds a Gravatar URL from an email address.
 * Email is trimmed and lowercased before hashing (per Gravatar spec).
 */
export async function getGravatarUrl(
  email: string,
  size = 176,
  defaultImage: GravatarDefault = 'identicon',
): Promise<string> {
  const normalizedEmail = email.trim().toLowerCase();
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.MD5,
    normalizedEmail,
  );

  return `https://www.gravatar.com/avatar/${hash}?s=${size}&d=${defaultImage}`;
}
