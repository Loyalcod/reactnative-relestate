import icons from '@/constants/icons';
import images from '@/constants/images';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';


interface Props{
    onPress?: () => void;

}

export const FeaturedCard = ({onPress} : Props ) => {
  return (
    <TouchableOpacity onPress={onPress} className='flex flex-col items-start w-52 h-64 relative'>
        <Image source={images.japan} className='size-full rounded-2xl'/>
        <Image source={images.cardGradient} className='size-full rounded-2xl absolute bottom-0'/>
        <View className='flex flex-row items-center bg-white/90 px-3 py-1.5 rounded-full absolute top-5 right-5'>
            <Image source={icons.star} className='size-3.5 '/>
            <Text className='text-xs font-rubik-bold text-primary-300 ml-1 '>4.4</Text>
        </View>

        <View className='flex flex-col items-start absolute bottom-5 inset-x-5'>
            <Text className='text-xl text-white font-rubik-extrabold' numberOfLines={1}>Modern Apartment      </Text>
            <Text className='text-base font-rubik text-white'>
                22 W 15th St, New York
            </Text>

            <View className='w-full flex flex-row items-center justify-between'>
                <Text className='text-xl font-rubik-extrabold text-white'>$2,500</Text>
                <Image source={icons.heart} className='size-5'/>
            </View>
        </View>

    </TouchableOpacity>
  )
}




export const Card = ({onPress}: Props) => {
  return (
    <TouchableOpacity onPress={onPress} className='flex-1 w-full px-3 py-4 rounded-lg bg-white shadow-lg shadow-black-100/70 relative' >
      <View className='flex flex-row items-center px-2 top-5 absolute right-5 bg-white/90 p-1 rounded-full z-50'>
            <Image source={icons.star} className='size-2.5 '/>
            <Text className='text-xs font-rubik-bold text-primary-300 ml-0.5 '>4.4</Text>
        </View>
        <Image source={images.newYork} className='w-full h-32 rounded-lg'/>

        <View className='flex flex-col mt-2'>
            <Text className='text-base text-black-300 font-rubik-bold' numberOfLines={1}>Cozy Studio      </Text>
            <Text className='tex-xs font-rubik text-black-200'>
                22 W 15th St, New York
            </Text>

            <View className='mt- flex flex-row items-center justify-between'>
                <Text className='text-base font-rubik-bold text-black-300'>$2,500</Text>
                <Image source={icons.heart} className='w-5 h-5 mr-2' tintColor="#191d31"/>
            </View>
        </View>
    </TouchableOpacity>
  )
}

