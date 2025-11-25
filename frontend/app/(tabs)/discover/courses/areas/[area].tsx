import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import { useLocalSearchParams } from "expo-router"
import React from 'react'

import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import api from '@/services/api'
import axios from 'axios'

import { FavoriteCourseCard as CourseCard } from '@/app/(tabs)/home';
import { FavoriteSection as CourseSection } from '@/app/(tabs)/home/[category]';
import { findAreaValueFromKey } from '@/services/utils'
import { areas } from '@/services/utils'

import {
    SafeAreaView
} from 'react-native-safe-area-context';
import { areaAbbreviations } from '@/services/utils';

const CoursesByArea = () => {

  const { area }: { area: string } = useLocalSearchParams()

  // const { isLoading:loading, error, data:courses } = useQuery({
  //     queryKey: ["specific-courses-by-area", area],
  //     queryFn: async () => {
  //       try {
  //         const response = await api.get(`/courses?q=${area}`)
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

  /////////////////////////////////

  const {
    data,
    isLoading:loading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["specific-courses-by-area", area],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const response = await api.get(`/courses?q=${area}&page=${pageParam}`)
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

  //////////////////////////////

  const areaDisplay = areaAbbreviations[area] ? areaAbbreviations[area] : area
  const fullDisplay = findAreaValueFromKey(areas, area) ? findAreaValueFromKey(areas, area) : null

  if (loading) {
    return (
      <View className="flex-1 flex-row justify-center items-center dark:bg-gray-800">
        <ActivityIndicator size="large" color="#fff" className="mt-10 self-center" />
      </View>
    )
  }

  if (error) {
    return (
      <View className="flex-1 flex-row justify-center items-center dark:bg-gray-800">
        <Text className="font-montserrat-medium my-5 text-xl dark:text-white">Courses with Area <Text className="font-montserrat-bold text-2xl">{areaDisplay}{fullDisplay ? ` (${fullDisplay})` : null}</Text></Text>
        <Text className="font-montserrat dark:text-white">Failed to load courses: {error?.message}</Text>
      </View>
    )
  }

  const courses = data?.pages.flatMap(page => page.content) ?? []

  if (!courses || (courses && courses.length == 0)) {
    return (
      <View className="flex-1 flex-row justify-center items-center dark:bg-gray-800">
        <Text className="font-montserrat-medium my-5 text-xl dark:text-white">Courses with Area <Text className="font-montserrat-bold text-2xl">{areaDisplay}{fullDisplay ? ` (${fullDisplay})` : null}</Text></Text>
        <Text className="font-montserrat dark:text-white">No courses found</Text>
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
        <Text className="font-montserrat-medium my-5 text-xl dark:text-white">Courses with Area <Text className="font-montserrat-bold text-2xl">{areaDisplay}{fullDisplay ? ` (${fullDisplay})` : null}</Text></Text>
        <CourseSection data={courses} ItemComponent={CourseCard} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default CoursesByArea