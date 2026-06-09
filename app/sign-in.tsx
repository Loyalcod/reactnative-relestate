import { useAuth } from '@/context/auth-context';
import icons from '@/constants/icons';
import images from '@/constants/images';
import {
  completeSessionFromOAuthRedirect,
  loginWithGoogle,
  parseOAuthCallbackUrl,
} from '@/lib/google-auth';
import * as Linking from 'expo-linking';
import { Redirect, router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SignIn() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Redirect href="/" />;
  }

  return <SignInContent />;
}

function SignInContent() {
  const { refetch } = useAuth();
  const [loading, setLoading] = useState(false);
  /** While `openAuthSessionAsync` runs, ignore duplicate deep-link events for the same redirect. */
  const browserOAuthFlowActiveRef = useRef(false);

  const maybeFinishOAuthFromUrl = useCallback(
    async (url: string | null) => {
      if (!url || browserOAuthFlowActiveRef.current) return;
      const parsed = parseOAuthCallbackUrl(url);
      if (!parsed.userId || !parsed.secret) return;

      try {
        await completeSessionFromOAuthRedirect(url);
        await refetch();
        router.replace('/');
      } catch (e) {
        const message = e instanceof Error ? e.message : 'Could not complete sign-in';
        Alert.alert('Sign-in error', message);
      }
    },
    [refetch],
  );

  useEffect(() => {
    void Linking.getInitialURL().then((url) => maybeFinishOAuthFromUrl(url));

    const sub = Linking.addEventListener('url', ({ url }) => {
      void maybeFinishOAuthFromUrl(url);
    });

    return () => sub.remove();
  }, [maybeFinishOAuthFromUrl]);

  const handleLogin = async () => {
    if (loading) return;
    browserOAuthFlowActiveRef.current = true;
    try {
      setLoading(true);
      await loginWithGoogle();
      await refetch();
      router.replace('/');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to login with Google';
      if (message !== 'Login cancelled') {
        Alert.alert('Error', message);
      }
    } finally {
      browserOAuthFlowActiveRef.current = false;
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerClassName='h-full'>
        <Image
          source={images.onboarding}
          className='w-full h-4/6'
          resizeMode='contain'
        />

        <View className="px-10">
          <Text className='text-base text-center uppercase font-rubik text-black-200'>Welcome to RelEstate</Text>

          <Text className='text-3xl font-rubik-bold text-black-300 text-center mt-2'>Let&apos;s Get You Closer to {"\n"}
            <Text className='text-primary-300'>Your Ideal Home</Text>
          </Text>

            <Text className='text-lg font-rubik text-black-200 text-center mt-12'>Login to RelEstate with Google</Text>
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className='bg-white shadow-md shadow-zinc-300 rounded-full py-4 mt-5 opacity-100 disabled:opacity-60'
            >
              <View className='flex bg-white rounded-full flex-row items-center justify-center'>
              {loading ? (
                <ActivityIndicator />
              ) : (
                <>
                  <Image
                    source={icons.google}
                    className='w-5 h-5'
                    resizeMode='contain'
                  />
                  <Text className='text-lg font-rubik-medium text-black-300 ml-2'>Continue with Google</Text>
                </>
              )}
              </View>
            </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
