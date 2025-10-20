import { View, Text, ScrollView, FlatList } from 'react-native'
import React, { useState, useEffect,useCallback } from 'react'
import SearchBar from '@/components/SearchBar';
import { useMutation } from "@tanstack/react-query"
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

type SearchResultProps = {
    id: string,
    name: string,
    abbreviation?: string,
    subject?: string,
    category: number
}

const search = () => {

    const [query, setQuery] = useState("")
    const onChangeQuery = useCallback((text: string) => {
        setQuery(text)
    }, [])

    useEffect( () => {
        const timeoutId = setTimeout(async () => {
            if (query.trim()) {
                getSearchResults()
            }
        }, 500)
        return () => {
            clearTimeout(timeoutId)
        }
    }, [query])

    const {mutate:getSearchResults, data:searchResults} = useMutation({
        mutationFn: async () => {
            const response = await fetch(`http://${LOCALHOST}:8080/search?q=${query}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            if (!response.ok) {
                const payload = await response.text()
                throw new Error(payload)
            }
            const json = await response.json()
            return json?.results
        },
        onError: (e: any) => {
            console.error(e?.message ?? "Failed to verify")
        }
    })

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800 gap-y-4 px-5" edges={["top"]}>
            <View className="flex flex-row items-center justify-start">
                <SearchBar placeholder="Search" onChangeText={onChangeQuery} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
                <Text className="font-montserrat-bold dark:text-white mb-4">Recent searches</Text>
                <FlatList
                data={searchResults}
                renderItem={(item) => (
                    <SearchResult result={item.item} />
                )}
                numColumns={1}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                scrollEnabled={false}
                />
            </ScrollView>
        </SafeAreaView>
    )
}

const SearchResult = ({result}: {result: SearchResultProps}) => {

    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

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
            //scheduleOnRN(onFilterPress);
        });
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));
    return (
        <GestureDetector gesture={tap}>
            <Animated.View className="flex flex-row justify-start items-center gap-x-3" style={animatedStyle}>
                <View className="w-[50px] h-[50px] aspect-square bg-primary"></View>
                <View>
                    <Text className="font-montserrat-semibold dark:text-white">{result.name}{result.abbreviation ? ` (${result.abbreviation})` : null}</Text>
                    <Text className="font-montserrat dark:text-light-100 text-sm">{result.category === 1 ? "Subject" : result.category === 2 ? "Course" : "Professor"}</Text>
                </View>
            </Animated.View>
        </GestureDetector>
    )
}

export default search