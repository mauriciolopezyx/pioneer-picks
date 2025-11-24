import { Text, View, ScrollView, ActivityIndicator, Pressable } from 'react-native'
import { FlashList } from "@shopify/flash-list";
import DiscoverCard from '@/components/DiscoverCard'
import SearchBar from '@/components/SearchBar';
import { useState, useCallback, useMemo } from "react"
import { useQuery } from '@tanstack/react-query'
import api from '@/services/api';
import axios from 'axios';

import {
    SafeAreaView
} from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';

const filterOptions = ["Alphabetical", "Reset"]

const discover = () => {

  const router = useRouter()
  const [query, setQuery] = useState("")
  //const [filter, setFilter] = useState(filterOptions.length - 1)
  const onChangeQuery = useCallback((text: string) => {
    setQuery(text)
  }, [])

  const { isLoading:loading, error, data } = useQuery({
    queryKey: ["all-subjects"],
    queryFn: async () => {
      try {
        const response = await api.get(`/subjects`)
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

  // const onFilterPress = () => {
  //   const destructiveButtonIndex = -1
  //   const cancelButtonIndex = filterOptions.length - 1

  //   showActionSheetWithOptions({ options:filterOptions, cancelButtonIndex, destructiveButtonIndex }, (i: any) => {
  //     switch (i) {
  //       case destructiveButtonIndex:
  //         break
  //       case cancelButtonIndex:
  //         setFilter(filterOptions.length - 1)
  //         break
  //       default:
  //         //onFormUpdate(field, !useIndex ? filterOptions[i] : i)
  //         setFilter(i)
  //         break
  //     }}
  //   )
  // };

  // const sortedSubjects = useMemo(() => {
  //   if (!data?.subjects) return []
  //   return [...data.subjects]
  //     .sort((a, b) => {
  //       if (a.name === "All") return -1
  //       if (b.name === "All") return 1
  //       return a.name.localeCompare(b.name)
  //     })
  // }, [data])

  const filteredSubjects = useMemo(() => {
    if (!data) return []
    const q = query.replace(/\s+/g, '').toLowerCase()
    return [...data]
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
      <SafeAreaView className="flex-1 dark:bg-gray-800 flex flex-col items-center justify-center" edges={['left', 'right']}>
        <Text className="font-montserrat dark:text-white">Failed to load professor: {error?.message}</Text>
      </SafeAreaView>
    )
  }

  if (!data) {
    return (
      <SafeAreaView className="flex-1 dark:bg-gray-800 flex flex-col items-center justify-center" edges={['left', 'right']}>
        <Text className="font-montserrat dark:text-white">Failed to load all subjects information (no data found)</Text>
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
            <View className="pointer-events-none flex-1">
              <SearchBar
                placeholder="Search"
                onChangeText={onChangeQuery}
                disabled={true}
              />
            </View>
          </Pressable>

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

        <FlashList
          //data={query != "" ? filteredSubjects : filter === 0 ? sortedSubjects : data.subjects}
          data={query != "" ? filteredSubjects : data}
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