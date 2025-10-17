import { StyleSheet, Text, View, FlatList, ScrollView, useColorScheme } from 'react-native'
import data from "@/assets/data.json"
import DiscoverCard from '@/components/DiscoverCard'
import SearchBar from '@/components/SearchBar';
import { Ionicons } from "@expo/vector-icons";
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useState, useCallback, useMemo } from "react"

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

const filterOptions = ["Alphabetical", "Reset"]

const discover = () => {

  const colorScheme = useColorScheme()
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState(filterOptions.length - 1)
  const onChangeQuery = useCallback((text: string) => {
    setQuery(text)
  }, [])

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
    return [...data.subjects]
      .sort((a, b) => {
        if (a.name === "All") return -1
        if (b.name === "All") return 1
        return a.name.localeCompare(b.name)
      })
  }, [])
  const filteredSubjects = useMemo(() => {
    const q = query.replace(/\s+/g, '').toLowerCase()
    return [...data.subjects]
      .filter(item =>
        item.name.replace(/\s+/g, '').toLowerCase().includes(q)
      )
  }, [query])

  return (
    <SafeAreaView className="flex-1 px-5 bg-white dark:bg-gray-800" edges={['left', 'right', 'bottom']}>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
      >
        <View className="h-5"></View>
        <View className="flex flex-row justify-start items-center gap-x-[10px] mb-4">
          <SearchBar
            placeholder="Search"
            onChangeText={onChangeQuery}
          />
          <GestureDetector gesture={tap}>
            <Animated.View
              className={`relative flex justify-center items-center border-[1px] border-black dark:border-[#aaa] rounded-lg p-[5px] bg-light-100 dark:bg-gray-900 ${(filter != filterOptions.length - 1 && query == "") && "border-red-600 dark:border-red-600"}`}
              style={animatedStyle}
            >   
              <Ionicons name="filter-outline" size={25} color={colorScheme === "dark" ? "#aaa" : "black"} />
              {(filter != filterOptions.length - 1 && query == "") ? <View className="absolute top-0 left-0 mt-[-10px] ml-[-10px] aspect-square bg-red-600 rounded-full flex items-center justify-center p-1">
                <Text className="text-white font-montserrat-semibold text-xs">{filter === 0 ? "A-Z" : ""}</Text>
              </View> : null}
            </Animated.View>
          </GestureDetector>
        </View>
        <FlatList
          data={query != "" ? filteredSubjects : filter === 0 ? sortedSubjects : data.subjects}
          renderItem={(item) => (
            <DiscoverCard {...item} />
          )}
          keyExtractor={(item) => item.id.toString() ?? crypto.randomUUID()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            gap: 10
          }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          scrollEnabled={false}
        />
      </ScrollView>
    </SafeAreaView>
  )
}

export default discover