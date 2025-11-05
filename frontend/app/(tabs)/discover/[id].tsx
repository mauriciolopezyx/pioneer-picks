import { StyleSheet, Text, ScrollView, View, ActivityIndicator, Linking, TouchableOpacity, Animated } from 'react-native'
import { FlashList } from "@shopify/flash-list";
import { useLocalSearchParams } from 'expo-router'
import React, { useLayoutEffect, useMemo, useState, useCallback } from 'react'
import CourseCard from '@/components/CourseCard'
import SearchBar from '@/components/SearchBar';

import { useQuery } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

import { useNavigation } from '@react-navigation/native'

import {
    SafeAreaView
} from 'react-native-safe-area-context';

const Courses = () => {

  const {id} = useLocalSearchParams()

  const [query, setQuery] = useState("")
  //const [filter, setFilter] = useState(filterOptions.length - 1)
  const onChangeQuery = useCallback((text: string) => {
    setQuery(text)
  }, [])

  const { isLoading:loading, isSuccess:success, error, data:subject } = useQuery({
    queryKey: ["specific-subject", id],
    queryFn: async () => {
      const sessionId = await SecureStore.getItemAsync("session");
      const response = await fetch(`http://${LOCALHOST}:8080/subjects/${id}`, {
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
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 60 * 24,
    gcTime: 1000 * 60 * 60 * 48
  })

  ////////////

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
    if (!subject?.courses) return []
    const q = query.replace(/\s+/g, '').toLowerCase()
    return [...subject.courses]
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
      <SafeAreaView className="flex-1 dark:bg-gray-800" edges={['left', 'right']}>
        <Text>Failed to load professor: {error?.message}</Text>
      </SafeAreaView>
    )
  }

  if (!subject) {
    return (
      <SafeAreaView className="flex-1 dark:bg-gray-800" edges={['left', 'right']}>
        <Text>Failed to load subject information (no data found)</Text>
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
            disabled={true}
          />

          {/* <GestureWrapper
            className={`relative flex justify-center items-center border-[1px] border-black dark:border-[#aaa] rounded-lg p-[5px] bg-light-100 dark:bg-gray-700 ${(filter != filterOptions.length - 1 && query == "") && "border-red-600 dark:border-red-600"}`}
            backgroundColor={colorScheme === "dark" ? "#d1d1d1" : "#d1d1d1"}
          >
            <Ionicons name="filter-outline" size={25} color={colorScheme === "dark" ? "#aaa" : "black"} />
              {(filter != filterOptions.length - 1 && query == "") ? <View className="absolute top-0 left-0 mt-[-10px] ml-[-10px] aspect-square bg-red-600 rounded-full flex items-center justify-center p-1">
                <Text className="text-white font-montserrat-semibold text-xs">{filter === 0 ? "A-Z" : ""}</Text>
              </View> : null}
          </GestureWrapper> */}
        </View>

        <Text className="font-montserrat-bold text-2xl mb-2 dark:text-white">Courses</Text>
        <FlashList
            data={query != "" ? filteredCourses : subject.courses}
            renderItem={(item: any) => (
                <CourseCard course={item.item} subject={{name: subject.name, abbreviation: subject.abbreviation}} />
            )}
            keyExtractor={(item: any) => item.id.toString() ?? crypto.randomUUID()}
            numColumns={1}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
            scrollEnabled={false}
        />
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