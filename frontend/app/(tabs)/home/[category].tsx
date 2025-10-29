import { View, Text, ActivityIndicator } from 'react-native'
import { useLocalSearchParams } from "expo-router"
import React from 'react'
import { FlashList } from '@shopify/flash-list';

import { useQuery } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

import { FavoriteCourseCard, FavoriteProfessorCard } from '.';

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
  
    if (!favorites || (favorites && favorites.length == 0)) {
      return (
        <View className="flex flex-row justify-center items-center">
          <Text>No favorites found</Text>
        </View>
      )
    }

    return (
      <SafeAreaView className="flex-1 dark:bg-gray-800" edges={["left", "right"]}>
        {category === "course" ? <FavoriteSection data={favorites} ItemComponent={FavoriteCourseCard} /> : null}
        {category === "professor" ? <FavoriteSection data={favorites} ItemComponent={FavoriteProfessorCard} /> : null}
      </SafeAreaView>
    )
}

export type SectionProps<T> = {
  data: T[] | null,
  ItemComponent: React.ComponentType<{ data: T }>
}

export const FavoriteSection = <T,>({data, ItemComponent}: SectionProps<T>) => {
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



export default Category