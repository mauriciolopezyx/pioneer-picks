import { View, Text, ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from "expo-router"
import React from 'react'
import { FlashList } from '@shopify/flash-list';

import { useQuery } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

import { FavoriteCourse, FavoriteProfessor, GestureWrapper } from '.';
import { revolvingColorPalette, subjectColorMappings } from "@/services/utils";

import {
    SafeAreaView
} from 'react-native-safe-area-context';

const Category = () => {

    const { category }: { category: string } = useLocalSearchParams()

    const endpoint = category === "course" ? "/favorites/courses" : "/favorites/professors"

    const { isLoading:loading, isSuccess:success, error, data:favorites } = useQuery({
        queryKey: ["specific-favorite-course-professors", category],
        queryFn: async () => {
            const sessionId = await SecureStore.getItemAsync("session");
            const response = await fetch(`http://${LOCALHOST}:8080${endpoint}`, {
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
        gcTime: 1000 * 60 * 5
      }
    )

    if (loading) {
      return (
        <View className="flex flex-row justify-center items-center">
          <ActivityIndicator size="large" color="#fff" className="mt-10 self-center" />
        </View>
      )
    }
  
    if (error) {
      return (
        <View className="flex flex-row justify-center items-center">
          <Text>Failed to load favorites: {error?.message}</Text>
        </View>
      )
    }
  
    if (!favorites) {
      return (
        <View className="flex flex-row justify-center items-center">
          <Text>Failed to load favorites (no data found)</Text>
        </View>
      )
    }

    return (
      <SafeAreaView className="flex-1 dark:bg-gray-800" edges={["left", "right"]}>
        <FavoriteSection data={favorites} ItemComponent={FavoriteCourseCard} />
      </SafeAreaView>
    )
}

type SectionProps<T> = {
  data: T[] | null,
  ItemComponent: React.ComponentType<{ data: T }>
}

const FavoriteSection = <T,>({data, ItemComponent}: SectionProps<T>) => {
  return (
    <FlashList
      data={data}
      renderItem={(item: any) => (
          <ItemComponent data={item.item} />
      )}
      numColumns={3}
      keyExtractor={(item: any) => item.id.toString() ?? crypto.randomUUID()}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  )
}

const FavoriteCourseCard = ({data}: {data: FavoriteCourse}) => {

  const paletteKey = subjectColorMappings[data.subject.toLowerCase()] ?? 0
  const bgColor = revolvingColorPalette[paletteKey]?.primary ?? "#000";
  const textColor = revolvingColorPalette[paletteKey]?.secondary ?? "text-white"

  const onPress = () => {
    console.log("navigate to actual course link here (2)")
  };

  return (
    <GestureWrapper className="flex flex-row justify-between items-center flex-1 rounded-lg p-3 overflow-hidden bg-light-100" backgroundColor={bgColor} onPress={onPress}>
      <View className="flex flex-col items-start justify-center gap-y-[2px]">
        <Text numberOfLines={1} className={`text-xl font-bold ${textColor}`}>
          {`${data.subjectAbbreivation} ${data.abbreviation}`}
        </Text>
        <Text className={`font-montserrat-semibold ${textColor} mb-[4px]`}>
          {data.name}
        </Text>
      </View>
    </GestureWrapper>
  )
}

export default Category