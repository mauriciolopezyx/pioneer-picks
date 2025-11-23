import { View, Text, ActivityIndicator, ScrollView } from 'react-native'
import { useLocalSearchParams } from "expo-router"
import React from 'react'

import { useQuery } from '@tanstack/react-query'
import api from '@/services/api'
import axios from 'axios'

import { FavoriteCourseCard as CourseCard } from '@/app/(tabs)/home';
import { FavoriteSection as CourseSection } from '@/app/(tabs)/home/[category]';

import {
    SafeAreaView
} from 'react-native-safe-area-context';
import { areaAbbreviations } from '@/services/utils';

const CoursesByArea = () => {

  const { area }: { area: string } = useLocalSearchParams()

  const { isLoading:loading, error, data:courses } = useQuery({
      queryKey: ["specific-courses-by-area", area],
      queryFn: async () => {
        try {
          const response = await api.get(`/courses?q=${area}`)
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

  const areaDisplay = areaAbbreviations[area] ? areaAbbreviations[area] : area

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
        <Text className="font-montserrat-medium my-5 text-xl dark:text-white">Courses with Area <Text className="font-montserrat-bold text-2xl">{areaDisplay}</Text></Text>
        <Text className="font-montserrat dark:text-white">Failed to load courses: {error?.message}</Text>
      </View>
    )
  }

  if (!courses || (courses && courses.length == 0)) {
    return (
      <View className="flex-1 flex-row justify-center items-center dark:bg-gray-800">
        <Text className="font-montserrat-medium my-5 text-xl dark:text-white">Courses with Area <Text className="font-montserrat-bold text-2xl">{areaDisplay}</Text></Text>
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
        <Text className="font-montserrat-medium my-5 text-xl dark:text-white">Courses with Area <Text className="font-montserrat-bold text-2xl">{areaDisplay}</Text></Text>
        <CourseSection data={courses} ItemComponent={CourseCard} />
      </ScrollView>
    </SafeAreaView>
  )
}

export default CoursesByArea