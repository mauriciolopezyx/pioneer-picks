import { View, Text, ScrollView, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native'
import { FlashList } from "@shopify/flash-list";
import { useRouter } from 'expo-router';
import React, { useState, useEffect,useCallback } from 'react'
import SearchBar from '@/components/SearchBar';
import { useMutation } from "@tanstack/react-query"
import { LOCALHOST } from "@/services/api";
import { revolvingColorPalette, subjectColorMappings } from "@/services/utils";
import { Ionicons } from "@expo/vector-icons";
import { addRecentSearch, getRecentSearches, RecentSearch } from '@/services/recentSearches';
import MasterToast from "@/components/ToastWrapper"

import {
    SafeAreaView
} from 'react-native-safe-area-context';

import { GestureWrapper } from './(tabs)/home';

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
            return json
        },
        onError: (e: any) => {
            //console.error(e?.message ?? "Failed to verify")
            MasterToast.show({
                text1: "Error fetching search results",
                text2: e?.message ?? "Failed to fetch"
            })
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
                        <FlashList
                            data={searchResults}
                            renderItem={(item: any) => (
                                <SearchResult result={item.item} colorScheme={colorScheme}/>
                            )}
                            numColumns={1}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            scrollEnabled={false}
                        /> :
                        <FlashList
                            data={recentSearches}
                            renderItem={({item}: any) => (
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
                pathname: "/(tabs)/discover/professors/[id]",
                params: { id: result.id, getAll: "true" },
            })
        }
    }

    const paletteKey = subjectColorMappings[result.name.toLowerCase()] != null ? subjectColorMappings[result.name.toLowerCase()] : result.subject ? subjectColorMappings[result.subject.toLowerCase()] : -1
    const bgColor = paletteKey != -1 ? revolvingColorPalette[paletteKey].primary : "transparent"

    return (
        <GestureWrapper className="flex flex-row justify-start items-center gap-x-3" onPress={handleSubmit}>
            {bgColor != "transparent" ? <View className={`w-[50px] h-[50px] aspect-square`} style={{ backgroundColor: bgColor }}></View> : <Ionicons name="person" size={50} color={colorScheme === "dark" ? "#aaa" : "black"} />}
            <View>
                <Text className="font-montserrat-semibold dark:text-white">{result.name}{result.abbreviation ? ` (${result.abbreviation})` : null}</Text>
                <Text className="font-montserrat dark:text-light-100 text-sm">{result.category === 1 ? "Subject" : result.category === 2 ? "Course" : "Professor"}</Text>
            </View>
        </GestureWrapper>
    )
}

export default search