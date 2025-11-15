import { View, Text, ScrollView, useColorScheme, KeyboardAvoidingView, Platform } from 'react-native'
import { FlashList } from "@shopify/flash-list";
import { useRouter } from 'expo-router';
import React, { useState, useEffect,useCallback } from 'react'
import SearchBar from '@/components/SearchBar';
import { useMutation } from "@tanstack/react-query"
import { LOCALHOST } from "@/services/api";
import { revolvingColorPalette, subjectColorMappings } from "@/services/utils";
import { Ionicons } from "@expo/vector-icons";
import { addRecentSearch, clearRecentSearches, getRecentSearches, RecentSearch } from '@/services/recentSearches';
import MasterToast from "@/components/ToastWrapper"

import {
    SafeAreaView
} from 'react-native-safe-area-context';

import { GestureWrapper } from './(tabs)/home';

type SubjectResult = {
    category: 1,
    data: {
        id: string,
        name: string,
        abbreviation: string
    }
}

type CourseResult = {
    category: 2,
    data: {
        id: string,
        name: string,
        abbreviation: string,
        subject: string,
        subjectAbbreviation: string
    }
}

type ProfessorResult = {
    category: 3,
    data: {
        id: string,
        name: string
    }
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
            if (query.trim() === "") {
                throw new Error("Query cannot be empty")
            }
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
            return (
                [
                    ...json.subjects.map((s: any) => ({ category: 1, data: s })),
                    ...json.courses.map((c: any) => ({ category: 2, data: c })),
                    ...json.professors.map((p: any) => ({ category: 3, data: p }))
                ]
            )
        },
        onError: (e: any) => {
            //console.error(e?.message ?? "Failed to verify")
            MasterToast.show({
                text1: "Error fetching search results",
                text2: JSON.parse(e.message)?.message ?? "Failed to fetch"
            })
        }
    })

    const onClearSearches = () => {
        clearRecentSearches()
        getRecentSearches().then(setRecentSearches)
    }

    console.log(searchResults)

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
                    <View className={`flex flex-row justify-${recentSearches.length > 0 ? "between" : "start"} items-center mb-4`}>
                        <Text className="font-montserrat-bold text-xl dark:text-white">{query.trim() ? "Search results" : "Recent searches"}</Text>
                        {recentSearches.length > 0 ? <GestureWrapper className="flex items-center justify-center" onPress={onClearSearches}>
                            <Ionicons name="trash" size={22} color={colorScheme === "dark" ? "white" : "black"} />
                        </GestureWrapper> : null}
                    </View>
                    { (recentSearches.length === 0 && !isSearching) ? <Text className="font-montserrat dark:text-white">No search history found</Text> : null}
                    {isSearching ? 
                        <FlashList
                            data={searchResults}
                            renderItem={(item: any) => (
                                <SearchResult data={item.item} colorScheme={colorScheme}/>
                            )}
                            numColumns={1}
                            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                            scrollEnabled={false}
                        /> :
                        <FlashList
                            data={recentSearches}
                            renderItem={({item}: any) => (
                                <RecentSearchResult data={item} colorScheme={colorScheme} />
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

const SearchResult = ({data, colorScheme}: {data: SubjectResult | CourseResult | ProfessorResult, colorScheme: string | null | undefined}) => {

    const router = useRouter()
    const {category, data:result} = data

    const handleSubmit = async () => {
        if (category === 1) {
            await addRecentSearch({
                id: result.id,
                name: result.name,
                category: category,
                abbreviation: result.abbreviation
            })
            router.navigate({
                pathname: "/(tabs)/discover/[id]",
                params: { id: result.id },
            })
        } else if (category === 2) {
            await addRecentSearch({
                id: result.id,
                name: result.name,
                category: category,
                subject: result.subject,
                abbreviation: result.abbreviation,
                subjectAbbreviation: result.subjectAbbreviation
            })
            router.navigate({
                pathname: "/(tabs)/discover/courses/[id]",
                params: { id: result.id, subjectName: result.subject, subjectAbbreviation: result.subjectAbbreviation },
            })
        } else {
            await addRecentSearch({
                id: result.id,
                name: result.name,
                category: category
            })
            router.navigate({
                pathname: "/(tabs)/discover/professors/[id]",
                params: { id: result.id, getAll: "true" },
            })
        }
    }

    let subjectKey: string | undefined = undefined;

    if (category === 1) {
        subjectKey = result.name.toLowerCase();
    } else if (category === 2) {
        subjectKey = result.subject.toLowerCase();
    }

    const paletteKey = subjectKey != null ? subjectColorMappings[subjectKey] : -1
    const bgColor = paletteKey != -1 ? revolvingColorPalette[paletteKey].primary : "transparent"

    return (
        <GestureWrapper className="flex flex-row justify-start items-center gap-x-3" onPress={handleSubmit}>
            {bgColor != "transparent" ? <View className={`w-[50px] h-[50px] aspect-square`} style={{ backgroundColor: bgColor }}></View> : <Ionicons name="person" size={50} color={colorScheme === "dark" ? "#aaa" : "black"} />}
            <View>
                <Text className="font-montserrat-semibold dark:text-white">{result.name}{category != 3 ? ` (${result.abbreviation})` : null}</Text>
                <Text className="font-montserrat dark:text-light-100 text-sm">{category === 1 ? "Subject" : category === 2 ? "Course" : "Professor"}</Text>
            </View>
        </GestureWrapper>
    )
}

const RecentSearchResult = ({data, colorScheme}: {data: RecentSearch, colorScheme: string | null | undefined}) => {

    const router = useRouter()

    const handleSubmit = async () => {
        if (data.category === 1) {
            router.navigate({
                pathname: "/(tabs)/discover/[id]",
                params: { id: data.id },
            })
        } else if (data.category === 2) {
            router.navigate({
                pathname: "/(tabs)/discover/courses/[id]",
                params: { id: data.id, subjectName: data.subject, subjectAbbreviation: data.subjectAbbreviation },
            })
        } else {
            router.navigate({
                pathname: "/(tabs)/discover/professors/[id]",
                params: { id: data.id, getAll: "true" },
            })
        }
    }

    let subjectKey: string | undefined = undefined;

    if (data.category === 1) {
        subjectKey = data.name.toLowerCase();
    } else if (data.category === 2) {
        subjectKey = data.subject!.toLowerCase();
    }

    const paletteKey = subjectKey != null ? subjectColorMappings[subjectKey] : -1
    const bgColor = paletteKey != -1 ? revolvingColorPalette[paletteKey].primary : "transparent"

    return (
        <GestureWrapper className="flex flex-row justify-start items-center gap-x-3" onPress={handleSubmit}>
            {bgColor != "transparent" ? <View className={`w-[50px] h-[50px] aspect-square`} style={{ backgroundColor: bgColor }}></View> : <Ionicons name="person" size={50} color={colorScheme === "dark" ? "#aaa" : "black"} />}
            <View>
                <Text className="font-montserrat-semibold dark:text-white">{data.name}{data.category != 3 ? ` (${data.abbreviation})` : null}</Text>
                <Text className="font-montserrat dark:text-light-100 text-sm">{data.category === 1 ? "Subject" : data.category === 2 ? "Course" : "Professor"}</Text>
            </View>
        </GestureWrapper>
    )
}

export default search