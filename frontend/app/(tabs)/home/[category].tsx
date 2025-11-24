import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import { useLocalSearchParams } from "expo-router"
import React from 'react'
import { FlashList } from '@shopify/flash-list';

import { useQuery } from '@tanstack/react-query'
import api from '@/services/api';
import axios from 'axios';

import { FavoriteCourseCard, FavoriteProfessorCard } from '.';

import {
    SafeAreaView
} from 'react-native-safe-area-context';

const Category = () => {

  const { category }: { category: string } = useLocalSearchParams()

  const endpoint = category === "course" ? "/favorites/courses" : "/favorites/professors"

  const { isLoading:loading, error, data:favorites } = useQuery({
      queryKey: ["specific-favorite-course-professors", category],
      queryFn: async () => {
        try {
          const response = await api.get(endpoint)
          return response.data
        } catch (error) {
          if (axios.isAxiosError(error) && error.response) {
            const customMessage = error.response.data.message
            throw new Error(customMessage || 'An error occurred')
          }
          throw error
        }
      },
      gcTime: 1000 * 60 * 5
    }
  )

  if (loading) {
    return (
      <View className="flex-1 flex-row justify-center items-center dark:bg-gray-800">
        <ActivityIndicator size="large" color="#fff" className="mt-10 self-center" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 flex-row justify-center items-center dark:bg-gray-800 px-5">
        <Text className="font-montserrat dark:text-white">Failed to load favorites: {error?.message}</Text>
      </View>
    )
  }

  if (!favorites || (favorites && favorites.length == 0)) {
    return (
      <View className="flex-1 flex-row justify-center items-center dark:bg-gray-800">
        <Text className="font-montserrat dark:text-white">No favorites found</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 dark:bg-gray-800" edges={["left", "right"]}>
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
            minHeight: "100%", paddingBottom: 10
        }}
      >
        <Text className="font-montserrat-bold text-2xl dark:text-white my-5">Favorite {category === "course" ? "Courses" : "Professors"}</Text>
        {category === "course" ? <FavoriteSection data={favorites} ItemComponent={FavoriteCourseCard} /> : null}
        {category === "professor" ? <FavoriteSection data={favorites} ItemComponent={FavoriteProfessorCard} /> : null}
      </ScrollView>
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
      numColumns={2}
      keyExtractor={(item: any) => item.id.toString() ?? crypto.randomUUID()}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      scrollEnabled={true}
    />
  )
}



export default Category