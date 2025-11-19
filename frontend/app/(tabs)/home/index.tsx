import { View, Text, ActivityIndicator, ScrollView, RefreshControl } from 'react-native'
import React, { useState } from 'react'
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useQuery } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

import { revolvingColorPalette, subjectColorMappings, subjectIconMappings } from "@/services/utils";

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


export type FavoriteCourse = {
  id: string,
  name: string,
  subject: string,
  abbreviation: string,
  subjectAbbreviation: string
}

export type FavoriteProfessor = {
  id: string,
  name: string
}

const Home = () => {

  const router = useRouter()
  const [refreshing, setRefreshing] = useState<boolean>(false)

  const { isLoading:loading, isSuccess:success, error, data:favorites, refetch } = useQuery({
    queryKey: ["favorite-course-professors"],
    queryFn: async () => {
        const sessionId = await SecureStore.getItemAsync("session");
        const response = await fetch(`${LOCALHOST}/favorites`, {
          method: "GET",
          ...(sessionId ? { Cookie: `SESSION=${sessionId}` } : {}),
        })
        if (!response.ok) {
          const payload = await response.text()
          throw new Error(payload)
        }
        const json = await response.json()
        return json
    },
    gcTime: 1000 * 60 * 5,
    refetchOnWindowFocus: true
  })
  
  return (
    <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["left", "right"]}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refetch}
            tintColor="#fff" // makes the spinner white
            colors={['#fff']} // for Android
          />
        }
      >
        <View className="flex flex-row justify-between items-center mt-5">
          <Text className="font-montserrat-bold text-2xl dark:text-white">Favorite Courses</Text>
          { (favorites && favorites.courses.length > 3) ? <GestureWrapper className="flex flex-row justify-center items-center p-3 rounded-lg" onPress={() => { router.navigate({pathname: "/(tabs)/home/[category]", params: {category: "course"}}) }} backgroundColor="#767576">
            <Ionicons name="expand-outline" size={25} color="white" />
          </GestureWrapper> : null }
        </View>
        <View className="my-4">
          <FavoriteSection loading={loading} error={error} data={favorites ? favorites.courses.slice(0, 3) : null} ItemComponent={FavoriteCourseCard} />
        </View>

        <View className="flex flex-row justify-between items-center">
          <Text className="font-montserrat-bold text-2xl dark:text-white">Favorite Professors</Text>
          { (favorites && favorites.professors.length > 3) ?<GestureWrapper className="flex flex-row justify-center items-center p-3 rounded-lg" onPress={() => { router.navigate({pathname: "/(tabs)/home/[category]", params: {category: "professor"}}) }} backgroundColor="#767576">
            <Ionicons name="expand-outline" size={25} color="white" />
          </GestureWrapper> : null }
        </View>
        <View className="my-4">
          <FavoriteSection loading={loading} error={error} data={favorites ? favorites.professors.slice(0, 3) : null} ItemComponent={FavoriteProfessorCard} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

type SectionProps<T> = {
  loading: boolean,
  error: Error | null | undefined,
  data: T[] | null,
  ItemComponent: React.ComponentType<{ data: T }>
}

const FavoriteSection = <T,>({loading, error, data, ItemComponent}: SectionProps<T>) => {

  if (loading) {
    return (
      <View className="flex flex-row justify-center items-center">
        <ActivityIndicator size="large" color="#fff" className="self-center" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex flex-row justify-center items-center mb-10 px-5">
        <Text className="font-montserrat dark:text-white">Failed to load favorites: {error?.message}</Text>
      </View>
    )
  }

  if (!data || (data && data.length == 0)) {
    return (
      <View className="flex flex-row justify-center items-center mb-10">
        <Text className="font-montserrat dark:text-white">No favorites found</Text>
      </View>
    )
  }

  return (
    <FlashList
      data={data}
      renderItem={(item: any) => (
          <ItemComponent data={item.item} />
      )}
      horizontal
      keyExtractor={(item: any) => item.id.toString() ?? crypto.randomUUID()}
      showsHorizontalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ width: 15 }} />}
    />
  )
}

export const FavoriteCourseCard = ({data}: {data: FavoriteCourse}) => {

  const router = useRouter()
  const paletteKey = subjectColorMappings[data.subject.toLowerCase()] ?? 0
  const bgColor = revolvingColorPalette[paletteKey]?.primary ?? "#000";
  const textColor = revolvingColorPalette[paletteKey]?.secondary ?? "text-white"
  const iconName = subjectIconMappings[data.subject] ?? "ellipse-outline";

  const onPress = () => {
    router.navigate({
      pathname: "/(tabs)/discover/courses/[id]",
      params: { id: data.id, subjectName: data.subject, subjectAbbreviation: data.subjectAbbreviation },
    })
  }

  return (
    <GestureWrapper className="flex flex-row justify-between items-center flex-1 rounded-lg p-3 overflow-hidden bg-light-100 max-w-[175px] min-h-[90px] max-h-[90px]" backgroundColor={bgColor} onPress={onPress}>
      <View className="flex flex-col items-start justify-center gap-y-[2px]">
        <Text numberOfLines={1} className={`text-xl font-bold ${textColor}`}>
          {`${data.subjectAbbreviation} ${data.abbreviation}`}
        </Text>
        <Text className={`font-montserrat-semibold ${textColor} mb-[4px]`}>
          {data.name}
        </Text>

        <Ionicons
          name={iconName}
          size={35}
          color="rgba(255,255,255,0.7)"
          style={{
            position: "absolute",
            bottom: -15,
            right: -15,
          }}
        />
      </View>
    </GestureWrapper>
  )
}

export const FavoriteProfessorCard = ({data}: {data: FavoriteProfessor}) => {

  const router = useRouter()

  const onPress = () => {
    router.navigate({
      pathname: "/(tabs)/discover/professors/[id]",
      params: { id: data.id, getAll: "true" },
    })
  }

  return (
    <GestureWrapper className="flex flex-row justify-between items-center flex-1 rounded-lg p-3 overflow-hidden max-w-[175px]" backgroundColor="#d50032" onPress={onPress}>
      <View className="flex flex-col items-start justify-center gap-y-[2px]">
        <Text numberOfLines={1} className="text-xl font-montserrat-bold text-white">{data.name}</Text>
      </View>
    </GestureWrapper>
  )
}


export const GestureWrapper = ({onPress, backgroundColor, className, children}: { onPress?: (...args: any[]) => void, backgroundColor?: string, className?: string, children: React.ReactNode }) => {

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

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
      if (onPress) {
        scheduleOnRN(onPress);
      }
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
    backgroundColor: backgroundColor != null ? backgroundColor : undefined
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
          className={className != null ? className : ""}
          style={animatedStyle}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  )
}

export default Home