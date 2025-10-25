import { StyleSheet, Text, View, ScrollView, useColorScheme, ActivityIndicator, Pressable } from 'react-native'
import { FlashList } from "@shopify/flash-list";
import DiscoverCard from '@/components/DiscoverCard'
import SearchBar from '@/components/SearchBar';
import { Ionicons } from "@expo/vector-icons";
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useState, useCallback, useMemo } from "react"
import { useQuery } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

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
import { useRouter } from 'expo-router';

const filterOptions = ["Alphabetical", "Reset"]

const discover = () => {

  const router = useRouter()
  const colorScheme = useColorScheme()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState(filterOptions.length - 1)
  const onChangeQuery = useCallback((text: string) => {
    setQuery(text)
  }, [])

  const { isLoading:loading, isSuccess:success, error, data } = useQuery({
    queryKey: ["all-subjects"],
    queryFn: async () => {
      const sessionId = await SecureStore.getItemAsync("session");
      const response = await fetch(`http://${LOCALHOST}:8080/subjects`, {
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

  const { showActionSheetWithOptions } = useActionSheet()

  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const onFilterPress = () => {
    const destructiveButtonIndex = -1
    const cancelButtonIndex = filterOptions.length - 1

    showActionSheetWithOptions({ options:filterOptions, cancelButtonIndex, destructiveButtonIndex }, (i: any) => {
      switch (i) {
        case destructiveButtonIndex:
          break
        case cancelButtonIndex:
          setFilter(filterOptions.length - 1)
          break
        default:
          //onFormUpdate(field, !useIndex ? filterOptions[i] : i)
          setFilter(i)
          break
      }}
    )
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
        scheduleOnRN(onFilterPress);
    });
  
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const sortedSubjects = useMemo(() => {
    if (!data?.subjects) return []
    return [...data.subjects]
      .sort((a, b) => {
        if (a.name === "All") return -1
        if (b.name === "All") return 1
        return a.name.localeCompare(b.name)
      })
  }, [data])

  const filteredSubjects = useMemo(() => {
    if (!data?.subjects) return []
    const q = query.replace(/\s+/g, '').toLowerCase()
    return [...data.subjects]
      .filter(item =>
        item.name.replace(/\s+/g, '').toLowerCase().includes(q)
      )
  }, [query, data])

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

  if (!data) {
    return (
      <SafeAreaView className="flex-1 dark:bg-gray-800" edges={['left', 'right']}>
        <Text>Failed to load all subjects information (no data found)</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 px-5 bg-white dark:bg-gray-800" edges={['left', 'right']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="h-5"></View>
        <View className="flex flex-row justify-start items-center gap-x-[10px] mb-4">
          <Pressable className="flex-1" onPress={() => { router.navigate({ pathname: "/search" })}}>
            <View className="pointer-events-none">
              <SearchBar
                placeholder="Search"
                onChangeText={onChangeQuery}
                disabled={true}
              />
            </View>
          </Pressable>

          <GestureDetector gesture={tap}>
            <Animated.View
              className={`relative flex justify-center items-center border-[1px] border-black dark:border-[#aaa] rounded-lg p-[5px] bg-light-100 dark:bg-gray-700 ${(filter != filterOptions.length - 1 && query == "") && "border-red-600 dark:border-red-600"}`}
              style={animatedStyle}
            >   
              <Ionicons name="filter-outline" size={25} color={colorScheme === "dark" ? "#aaa" : "black"} />
              {(filter != filterOptions.length - 1 && query == "") ? <View className="absolute top-0 left-0 mt-[-10px] ml-[-10px] aspect-square bg-red-600 rounded-full flex items-center justify-center p-1">
                <Text className="text-white font-montserrat-semibold text-xs">{filter === 0 ? "A-Z" : ""}</Text>
              </View> : null}
            </Animated.View>
          </GestureDetector>
        </View>

        <FlashList
          data={query != "" ? filteredSubjects : filter === 0 ? sortedSubjects : data.subjects}
          renderItem={(item: any) => (
            <DiscoverCard {...item} />
          )}
          keyExtractor={(item: any) => item.id.toString() ?? crypto.randomUUID()}
          numColumns={2}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          scrollEnabled={false}
        />
        <View className="h-5"></View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default discover