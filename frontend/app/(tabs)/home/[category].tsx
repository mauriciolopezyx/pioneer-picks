import { View, Text, ActivityIndicator, ScrollView, useColorScheme } from 'react-native'
import { useLocalSearchParams } from "expo-router"
import React from 'react'
import { FlashList } from '@shopify/flash-list';

import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import api from '@/services/api';
import axios from 'axios';

import { FavoriteCourseCard, FavoriteProfessorCard } from '.';

import {
    SafeAreaView
} from 'react-native-safe-area-context';
import { en } from 'zod/v4/locales';

const Category = () => {

  const { category }: { category: string } = useLocalSearchParams()

  const endpoint = category === "course" ? "/favorites/courses" : "/favorites/professors"

  // const { isLoading:loading, error, data:favorites } = useQuery({
  //     queryKey: ["specific-favorite-course-professors", category],
  //     queryFn: async () => {
  //       try {
  //         const response = await api.get(endpoint)
  //         return response.data
  //       } catch (error) {
  //         if (axios.isAxiosError(error) && error.response) {
  //           const customMessage = error.response.data.message
  //           throw new Error(customMessage || 'An error occurred')
  //         }
  //         throw error
  //       }
  //     },
  //     gcTime: 1000 * 60 * 5
  //   }
  // )

  const {
    data,
    isLoading:loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["specific-favorite-course-professors", category],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const response = await api.get(`${endpoint}?page=${pageParam}`)
        return response.data
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          throw new Error(error.response.data.message || 'An error occurred')
        }
        throw error
      }
    },
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length : undefined
    },
    initialPageParam: 0,
    gcTime: 1000 * 60 * 5
  })

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

  const favorites = data?.pages.flatMap(page => page.content) ?? []

  if (!favorites || (favorites && favorites.length == 0)) {
    return (
      <View className="flex-1 flex-row justify-center items-center dark:bg-gray-800">
        <Text className="font-montserrat dark:text-white">No favorites found</Text>
      </View>
    )
  }

  return (
    <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["left", "right"]}>
      <Text className="font-montserrat-bold text-2xl dark:text-white my-5">Favorite {category === "course" ? "Courses" : "Professors"}</Text>
      {category === "course" ? <FavoriteSection data={favorites} ItemComponent={FavoriteCourseCard} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} /> : null}
      {category === "professor" ? <FavoriteSection data={favorites} ItemComponent={FavoriteProfessorCard} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} /> : null}
    </SafeAreaView>
  )
}

export type SectionProps<T> = {
  data: T[] | null,
  ItemComponent: React.ComponentType<{ data: T }>,
  hasNextPage: boolean,
  isFetchingNextPage: boolean,
  fetchNextPage: (...args: any[]) => any
}

export const FavoriteSection = <T,>({data, ItemComponent, hasNextPage, isFetchingNextPage, fetchNextPage}: SectionProps<T>) => {
  const colorScheme = useColorScheme()
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
      style={{ flex: 1 }}
      scrollEnabled={true}

      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }}
      onEndReachedThreshold={0.5} // triggered when XX% from end

      ListFooterComponent={() => {
        if (isFetchingNextPage) {
          return (
            <View style={{ padding: 20 }}>
              <ActivityIndicator size="small" color={colorScheme === "dark" ? "#fff" : "#000"} />
            </View>
          )
        }
        return null
      }}

    />
  )
}



export default Category