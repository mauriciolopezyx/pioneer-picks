import { StyleSheet, Text, View, FlatList, ScrollView, useColorScheme } from 'react-native'
import data from "@/assets/data.json"
import DiscoverCard from '@/components/DiscoverCard'
import SearchBar from '@/components/SearchBar';
import { Ionicons } from "@expo/vector-icons";
import { useState, useCallback } from "react"

import {
    SafeAreaView
} from 'react-native-safe-area-context';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const discover = () => {

  const colorScheme = useColorScheme()
  const [query, setQuery] = useState("")
  const onChangeQuery = useCallback((text: string) => {
    setQuery(text)
  }, [])

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const handleSubmit = () => {
      
  };

  const tap = Gesture.Tap()
    .onBegin(() => {
        scale.value = withTiming(0.97, { duration: 80 });
        opacity.value = withTiming(0.7, { duration: 80 });
    })
    .onFinalize(() => {
        scale.value = withTiming(1, { duration: 150 });
        opacity.value = withTiming(1, { duration: 150 });
    })
    .onEnd(() => {
        scheduleOnRN(toggleFilters);
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  /////////////////////////////////////////////

  const [showFilters, setShowFilters] = useState(false);

  const popupVisible = useSharedValue(0); // 0 = hidden, 1 = visible

  const toggleFilters = useCallback(() => {
    const next = !showFilters;
    setShowFilters(next);
    popupVisible.value = withTiming(next ? 1 : 0, { duration: 200 });
  }, [showFilters]);

  const popupStyle = useAnimatedStyle(() => ({
    opacity: popupVisible.value,
    transform: [
      { translateY: withTiming(popupVisible.value ? 0 : -10, { duration: 200 }) },
      { scale: withTiming(popupVisible.value ? 1 : 0.95, { duration: 200 }) },
    ],
  }));

  return (
    <SafeAreaView className="flex-1 px-5 bg-white dark:bg-gray-800" edges={['left', 'right', 'bottom']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="h-5"></View>
        <View className="flex flex-row justify-start items-center gap-x-[10px] mb-4">
          <SearchBar
            placeholder="Search"
            onChangeText={onChangeQuery}
          />
          <View>
            <GestureDetector gesture={tap}>
              <Animated.View
              className="flex justify-center items-center border-[1px] border-black dark:border-[#aaa] rounded-lg p-[5px] bg-light-100 dark:bg-gray-900"
                  style={animatedStyle}
              >   
                <Ionicons name="filter-outline" size={25} color={colorScheme === "dark" ? "#aaa" : "black"} />
              </Animated.View>
            </GestureDetector>

            {showFilters && (
              <Animated.View
                style={[popupStyle]}
                className="absolute top-[110%] right-0 w-[150px] rounded-xl bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 shadow-lg p-2"
              >
                <Text className="text-black dark:text-white font-semibold mb-1">Sort By:</Text>
                <Text className="text-black dark:text-white text-sm">Popularity</Text>
                <Text className="text-black dark:text-white text-sm">Newest</Text>
                <Text className="text-black dark:text-white text-sm">Alphabetical</Text>
              </Animated.View>
            )}
          </View>
        </View>
        <FlatList
          data={data.subjects}
          renderItem={(item) => (
            <DiscoverCard {...item} />
          )}
          keyExtractor={(item) => item.id.toString() ?? crypto.randomUUID()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            gap: 10
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default discover