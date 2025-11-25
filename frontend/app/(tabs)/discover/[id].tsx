import { StyleSheet, Text, ScrollView, View, ActivityIndicator, Linking, TouchableOpacity, Animated, useColorScheme } from 'react-native'
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from 'expo-router'
import React, { useLayoutEffect, useMemo, useState, useCallback } from 'react'
import CourseCard from '@/components/CourseCard'
import SearchBar from '@/components/SearchBar';
import { GestureWrapper } from '../home';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import api from '@/services/api';
import axios from 'axios';

import { useNavigation } from '@react-navigation/native'

import {
    SafeAreaView
} from 'react-native-safe-area-context';

const Courses = () => {

  const router = useRouter()
  const {id} = useLocalSearchParams()

  const [query, setQuery] = useState("")
  //const [filter, setFilter] = useState(filterOptions.length - 1)
  const onChangeQuery = useCallback((text: string) => {
    setQuery(text)
  }, [])

  const { isLoading:loading, isSuccess:success, error, data:subject } = useQuery({
    queryKey: ["specific-subject", id],
    queryFn: async () => {
      try {
        const response = await api.get(`/subjects/${id}`)
        return response.data
      } catch (error) {
        if (axios.isAxiosError(error) && error.response) {
          const customMessage = error.response.data.message
          throw new Error(customMessage || 'An error occurred')
        }
        throw error
      }
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 48
  })

  const {
    data:rawCourses,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ["specific-subject-courses", id],
    queryFn: async ({ pageParam = 0 }) => {
      try {
        const response = await api.get(`/subjects/${id}/courses?page=${pageParam}`)
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
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 48
  })

  const courses = rawCourses?.pages.flatMap(page => page.content) ?? []

  ////////////

  const colorScheme = useColorScheme()
  const navigation = useNavigation()
  const scrollY = useMemo(() => new Animated.Value(0), []);

  useLayoutEffect(() => {
    const listenerId = scrollY.addListener(({ value }) => {
      const opacity = Math.min(value / 30, 1)
      navigation.setOptions({
        headerTintColor: `rgba(213, 0, 50, ${1 - opacity})`
      })
    })

    return () => {
      scrollY.removeListener(listenerId)
    }
  }, [])

  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }
  )

  const filteredCourses = useMemo(() => {
    if (!courses) return []
    const q = query.replace(/\s+/g, '').toLowerCase()
    return [...courses]
      .filter(item =>
        item.name.replace(/\s+/g, '').toLowerCase().includes(q)
      )
  }, [query, subject])

  if (loading) {
    return (
      <SafeAreaView className="flex-1 dark:bg-gray-800" edges={['left', 'right']}>
        <ActivityIndicator size="large" color="#fff" className="mt-10 self-center" />
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 dark:bg-gray-800 items-center justify-center px-5" edges={['left', 'right']}>
        <Text className="font-montserrat dark:text-white">Failed to load subject information: {error?.message}</Text>
      </SafeAreaView>
    )
  }

  if (!subject) {
    return (
      <SafeAreaView className="flex-1 dark:bg-gray-800 items-center justify-center px-5" edges={['left', 'right']}>
        <Text className="font-montserrat dark:text-white">Failed to load subject information (no data found)</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 dark:bg-gray-800" edges={['left', 'right']} >
        <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          minHeight: "100%", paddingBottom: 10
        }}
        onScroll={handleScroll}
      >
        <View className="h-[50px]"></View>
        <Text className="font-montserrat-extrabold text-3xl mb-4 dark:text-white">{subject.name}</Text>
        <TouchableOpacity className="mb-8" onPress={() => {openExternalLink(subject.description)}}>
              <Text className="font-montserrat dark:text-white underline">{subject.description}</Text>
        </TouchableOpacity>

        <View className="flex flex-row justify-start items-center gap-x-[10px] mb-4">
          <SearchBar
            placeholder="Search"
            onChangeText={onChangeQuery}
            disabled={false}
          />
          <GestureWrapper className="rounded-full" onPress={() => { router.navigate({pathname: "/(modals)/courses/create"}) }} backgroundColor="#d50032">
            <Ionicons name="add" size={30} color="white" />
          </GestureWrapper>
        </View>

        <Text className="font-montserrat-bold text-2xl mb-2 dark:text-white">Courses</Text>
        {courses.length > 0 ?<FlashList
            data={query != "" ? filteredCourses : courses}
            renderItem={(item: any) => (
                <CourseCard course={item.item} subject={{name: subject.name, abbreviation: subject.abbreviation}} />
            )}
            keyExtractor={(item: any) => item.id.toString() ?? crypto.randomUUID()}
            numColumns={1}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            scrollEnabled={true}

            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage()
              }
            }}
            onEndReachedThreshold={0.8} // triggered when XX% from end
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

        /> : <Text className="font-montserrat dark:text-white">No courses found</Text> }
        <View className="h-[50px]"></View>
      </ScrollView>
    </SafeAreaView>
  )
}

const openExternalLink = async (url: string) => {
  try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
          await Linking.openURL(url);
      } else {
          console.warn(`Don't know how to open this URL: ${url}`);
          // You might want to display an alert to the user here
      }
  } catch (error) {
      console.error('An error occurred while opening the link:', error);
  }
};

export default Courses

const styles = StyleSheet.create({})