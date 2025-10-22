import { View, Text, ScrollView, FlatList, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native'
import { useRouter } from 'expo-router';
import React, { useState, useEffect,useCallback } from 'react'
import SearchBar from '@/components/SearchBar';
import { useMutation } from "@tanstack/react-query"
import { LOCALHOST } from "@/services/api";
import { revolvingColorPalette, subjectColorMappings } from "@/services/utils";
import { Ionicons } from "@expo/vector-icons";
import { addRecentSearch, getRecentSearches, RecentSearch } from '@/services/recentSearches';

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

    const colorScheme = useColorScheme()

    const [query, setQuery] = useState("")
    const [recentSearches, setRecentSearches] = useState<RecentSearch[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const onChangeQuery = useCallback((text: string) => {
        setQuery(text)
    }, [])

    useEffect( () => {
        const q = query.trim();
        if (q === "") {
            setIsSearching(false);  // only show recents when EMPTY
            getRecentSearches().then(setRecentSearches);
            return;
        }

        // once a query is non-empty, we're in searching mode
        setIsSearching(true);

        const timeoutId = setTimeout(() => {
            getSearchResults();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [query])

    const {mutate:getSearchResults, data:searchResults} = useMutation({
        mutationFn: async () => {
            const response = await fetch(`http://${LOCALHOST}:8080/search?q=${query}`, {
                method: "GET",
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
        <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["top"]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 gap-y-4"
            >
                <View className="flex flex-row items-center justify-start">
                    <SearchBar placeholder="Search" onChangeText={onChangeQuery} />
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="font-montserrat-bold text-xl dark:text-white mb-4">{query.trim() ? "Search results" : "Recent searches"}</Text>
                    {isSearching ? 
                        <FlatList
                            data={searchResults}
                            renderItem={(item) => (
                                <SearchResult result={item.item} colorScheme={colorScheme}/>
                            )}
                            numColumns={1}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            scrollEnabled={false}
                        /> :
                        <FlatList
                            data={recentSearches}
                            renderItem={({item}) => (
                                <SearchResult result={item} colorScheme={colorScheme} />
                            )}
                            numColumns={1}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            scrollEnabled={false}
                        />
                    }
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const SearchResult = ({result, colorScheme}: {result: SearchResultProps, colorScheme: string | null | undefined}) => {

    const router = useRouter()
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const handleSubmit = async () => {
        await addRecentSearch({
            id: result.id,
            name: result.name,
            category: result.category,
            subject: result.subject,
            abbreviation: result.abbreviation,
        });

        if (result.category === 1) {
            router.navigate({
                pathname: "/(tabs)/discover/[id]",
                params: { id: result.id },
            })
        } else if (result.category === 2) {
            router.navigate({
                pathname: "/(tabs)/discover/courses/[id]",
                params: { id: result.id, subject: result.subject },
            })
        } else {
            router.navigate({
                pathname: "/(tabs)/discover/courses/professors/[id]",
                params: { id: result.id, subject: result.subject },
            })
        }
    }

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
            scheduleOnRN(handleSubmit)
        });
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    const paletteKey = subjectColorMappings[result.name.toLowerCase()] != null ? subjectColorMappings[result.name.toLowerCase()] : result.subject ? subjectColorMappings[result.subject.toLowerCase()] : -1
    const bgColor = paletteKey != -1 ? revolvingColorPalette[paletteKey].primary : "transparent"

    return (
        <GestureDetector gesture={tap}>
            <Animated.View className="flex flex-row justify-start items-center gap-x-3" style={animatedStyle}>
                {bgColor != "transparent" ? <View className={`w-[50px] h-[50px] aspect-square`} style={{ backgroundColor: bgColor }}></View> : <Ionicons name="person" size={50} color={colorScheme === "dark" ? "#aaa" : "black"} />}
                <View>
                    <Text className="font-montserrat-semibold dark:text-white">{result.name}{result.abbreviation ? ` (${result.abbreviation})` : null}</Text>
                    <Text className="font-montserrat dark:text-light-100 text-sm">{result.category === 1 ? "Subject" : result.category === 2 ? "Course" : "Professor"}</Text>
                </View>
            </Animated.View>
        </GestureDetector>
    )
}

export default search