import { settings } from '@/constants/data';
import icons from '@/constants/icons';
import images from '@/constants/images';
import { useAuth } from '@/context/auth-context';
import { getGravatarUrl } from '@/lib/gravatar';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ImageSourcePropType,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


interface SettingItemProps {
  title: string;
  icon: ImageSourcePropType;
  onPress?: () => void;
  textStyle?: string;
  showArrow?: boolean;
}

const SettingItem = ({
  title,
  icon,
  onPress = () => { },
  textStyle = '',
  showArrow = true
}: SettingItemProps) => {
  return (
    <TouchableOpacity onPress={onPress} className='flex flex-row items-center justify-between py-3'>
      <View className='flex flex-row gap-3 items-center'>
        <Image source={icon} className='size-6' />
        <Text className={`text-lg font-rubik-medium text-black-300 ${textStyle}`}>{title}</Text>
      </View>

      {showArrow && (<Image source={icons.rightArrow} className='size-5' />)}
    </TouchableOpacity>
  );
};

export default function Profile() {
  const { user, signOut } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);
  const [avatarSource, setAvatarSource] = useState<ImageSourcePropType>(images.avatar);

  useEffect(() => {
    let cancelled = false;

    async function resolveAvatar() {
      const prefsAvatar = (user?.prefs as { avatar?: string } | undefined)?.avatar;
      if (prefsAvatar) {
        if (!cancelled) setAvatarSource({ uri: prefsAvatar });
        return;
      }

      if (user?.email) {
        try {
          const gravatarUrl = await getGravatarUrl(user.email, 176);
          if (!cancelled) setAvatarSource({ uri: gravatarUrl });
          return;
        } catch {
          // Fall back to local placeholder below.
        }
      }

      if (!cancelled) setAvatarSource(images.avatar);
    }

    void resolveAvatar();

    return () => {
      cancelled = true;
    };
  }, [user?.email, user?.prefs]);

  const performLogout = async () => {
    if (loggingOut) return;
    try {
      setLoggingOut(true);
      await signOut();
      router.replace('/sign-in');
    } finally {
      setLoggingOut(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Log out', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log out',
        style: 'destructive',
        onPress: () => {
          void performLogout();
        },
      },
    ]);
  };



  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName='pb-32 px-7'
      >

        <View className="flex flex-row items-center justify-between mt-5">
          <Text className="font-rubik-bold text-2xl text-black-300">Profile</Text>

          <Image source={icons.bell} className="size-5" />
        </View>

        <View className="flex flex-row justify-center mt-5">
          <View className="flex flex-col items-center relative mt-5">
            <Image
              source={avatarSource}
              className="size-44 relative rounded-full"
            />

            <TouchableOpacity className='sticky left-10 bottom-10'>
              <Image source={icons.edit} className='size-9' />
            </TouchableOpacity>

            <Text className='text-2xl font-rubik-medium '>{user?.name} </Text>
          </View>
        </View>

        <View className='flex flex-col mt-10'>
          <SettingItem icon={icons.calendar} title="My Bookings" />
          <SettingItem icon={icons.wallet} title="Payments" />
        </View>

        <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>

          {settings.slice(2).map((item, index) => (
            <SettingItem key={index} {...item} />
          ))}
        </View>

        <View className='flex flex-col mt-5 border-t pt-5 border-primary-200'>


          <SettingItem onPress={handleLogout} title='Logout' icon={icons.logout} textStyle='text-danger' />

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}



{/* <TouchableOpacity
            ={handleLogout}
            disabled={loggingOut}
            accessibilityRole="button"
            accessibilityLabel="Log out"
            className="mt-10 flex-row items-center justify-center rounded-full border border-red-200 bg-white py-4 px-6 disabled:opacity-50"
          >
            {loggingOut ? (
              <ActivityIndicator color="#ef4444" />
            ) : (
              <>
                <Image source={icons.logout} className="h-5 w-5" resizeMode="contain" />
                <Text className="font-rubik-semibold ml-2 text-red-500">Log out</Text>
              </>
            )}
          </TouchableOpacity> */}
