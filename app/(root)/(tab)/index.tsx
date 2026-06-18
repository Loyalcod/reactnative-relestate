import { Card, FeaturedCard } from "@/components/Cards";
import Filters from "@/components/Filters";
import Search from "@/components/Search";
import icons from "@/constants/icons";
import images from "@/constants/images";
import { useAuth } from "@/context/auth-context";
import { getGravatarUrl } from "@/lib/gravatar";
import { useLocalSearchParams } from "expo-router";
// import seed from "@/lib/seed";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {

const { user, latestProperties,  properties,  getLatestProperties,  getProperties, } = useAuth()

const [avatarSource, setAvatarSource] = useState<ImageSourcePropType>(images.avatar);

useEffect(() => {

  getLatestProperties();

  getProperties({
    filter: "All",
    query: "",
    limit: 10,
  });
  
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

const params = useLocalSearchParams<{query? : string; filter?: string}>()

  return (
    <>
      <SafeAreaView className="bg-white h-full">
        {/* <Button title="Seed" onPress={seed} /> */}
        <FlatList
          data={[1, 2, 3, 4, 5, 6]}
          renderItem={({ item }) => <Card/>}
          keyExtractor={(item)=> item.toString()}
          numColumns={2}
          contentContainerClassName="pb-32"
          columnWrapperClassName="flex gap-5 px-5"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={

            <View className="px-5">
              <View className="flex flex-row items-center justify-between mt-5">
                <View className="flex flex-row items-center">
                  <Image source={avatarSource} className="size-12 rounded-full" />
                  <View className="flex flex-col items-start ml-2 justify-center">
                    <Text className="text-xs font-rubik text-black-100 ">Good Morning</Text>
                    <Text className="text-base font-rubik-medium text-black-300 ">{user?.name}</Text>
                  </View>
                </View>

                <Image source={icons.bell} className="size-5" />
              </View>

              <Search />

              <View className="my-5">
                <View className="flex flex-row items-center justify-between ">
                  <Text className="text-xl font-rubik-bold text-black-300">Featured</Text>
                  <TouchableOpacity>
                    <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
                  </TouchableOpacity>
                </View>

                <FlatList
                  data={[1, 2, 3, 4, 5,]}
                  renderItem={(item)=> <FeaturedCard/>}
                  keyExtractor={(item)=> item.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  bounces={false}
                  contentContainerClassName="flex gap-5 mt-5"
                />
              </View>

              

              <View className="my-5">
                <View className="flex flex-row items-center justify-between ">
                  <Text className="text-xl font-rubik-bold text-black-300">Our Recommendation</Text>
                  <TouchableOpacity>
                    <Text className="text-base font-rubik-bold text-primary-300">See All</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Filters />

            </View>

          }

        />

        {/* <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName='pb-32'
      > */}


        {/* </ScrollView> */}





      </SafeAreaView>
    </>
  );
}
