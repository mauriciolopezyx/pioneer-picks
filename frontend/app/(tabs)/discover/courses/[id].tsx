import { Text, ScrollView, View, ActivityIndicator, Animated as RNAnimated, useColorScheme, Pressable } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { FlashList } from "@shopify/flash-list";
import { useState, useEffect, useLayoutEffect, useMemo, useCallback } from "react";
import { useNavigation } from "@react-navigation/native";
import ProfessorCard from '@/components/ProfessorCard';
import { Ionicons } from '@expo/vector-icons';
import { areas, revolvingColorPalette, areaAbbreviations, findAreaParentKey, areaColorMappings } from "@/services/utils";
import { GestureWrapper } from '../../home';
import SearchBar from '@/components/SearchBar';

import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query'
import api from '@/services/api';
import axios from 'axios';

import MasterToast from "@/components/ToastWrapper"

import {
    SafeAreaView
} from 'react-native-safe-area-context';

const Course = () => {

    const router = useRouter()
    const colorScheme = useColorScheme()
    const { id:courseId, subjectName, subjectAbbreviation }: {id: string, subjectName: string, subjectAbbreviation: string} = useLocalSearchParams();
    const navigation = useNavigation();

    const [favorited, setFavorited] = useState<boolean | null>(null)

    const [query, setQuery] = useState("")
    //const [filter, setFilter] = useState(filterOptions.length - 1)
    const onChangeQuery = useCallback((text: string) => {
        setQuery(text)
    }, [])

    useEffect(() => {
        if (subjectName) {
            navigation.setOptions({
                headerBackTitle: subjectName,
            });
        }
    }, [subjectName]);

    const { isLoading:loading, isSuccess:success, error, data:course } = useQuery({
        queryKey: ["specific-course", courseId],
        queryFn: async () => {
            const response = await api.get(`/courses/${courseId}`)
            setFavorited(response.data.favorited)
            return response.data
        },
        refetchOnWindowFocus: true
    })

    const {
        data:rawProfessors,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ["specific-course-professors", courseId],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await api.get(`/courses/${courseId}/professors?page=${pageParam}`)
            return response.data
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasMore ? allPages.length : undefined
        },
        initialPageParam: 0,
        refetchOnWindowFocus: false,
        // staleTime: 1000 * 60 * 24,
        // gcTime: 1000 * 60 * 48
    })

    const professors = rawProfessors?.pages.flatMap(page => page.content) ?? []

    ////////////////////////

    const onAreaPress = () => {
        router.navigate({
            pathname: "/(modals)/areas"
        })
    }

    const seen = new Set()
    const areaDisplays = (course && course.areas) ? course.areas.split(",").map((area: string) => {
        if (seen.has(area)) return null
        if (areaAbbreviations[area] && seen.has(areaAbbreviations[area])) return null

        seen.add(area)
        const parentArea = findAreaParentKey(areas, area)
        const bgAreaColor = (parentArea && areaColorMappings[parentArea.toLowerCase()]) ? revolvingColorPalette[areaColorMappings[parentArea.toLowerCase()]].primary : "transparent"
        const textAreaColor = (parentArea && areaColorMappings[parentArea.toLowerCase()]) ? revolvingColorPalette[areaColorMappings[parentArea.toLowerCase()]].secondary : "text-white"

        if (areaAbbreviations[area]) {
            seen.add(areaAbbreviations[area])
            return (
                <GestureWrapper key={areaAbbreviations[area]} className="rounded-full px-4 py-1" backgroundColor={bgAreaColor} onPress={() => { router.navigate({pathname: "/(tabs)/discover/courses/areas/[area]", params: {area: area}}) }}>
                    <Text className={`font-montserrat-medium text-sm ${textAreaColor}`}>{areaAbbreviations[area]}</Text>
                </GestureWrapper>
            )
        }
        return (
            <GestureWrapper key={area} className="rounded-full px-4 py-1" backgroundColor={bgAreaColor} onPress={() => { router.navigate({pathname: "/(tabs)/discover/courses/areas/[area]", params: {area: area}}) }}>
                <Text className={`font-montserrat-medium text-sm ${textAreaColor}`}>{area}</Text>
            </GestureWrapper>
        )
    }) : []

    ///////////////////////

    const {isPending:favoriteLoading, isError, error:favoriteError, mutate:toggleFavorite} = useMutation({
        mutationFn: async () => {
            console.log("attempting to toggle favorite course when favorited status is:", favorited)
            if (favorited) {
                const response = await api.delete(`/favorites/course/${courseId}`)
                return true
            }

            const response = await api.post(`/favorites/course/${courseId}`)
            return true
        },
        onMutate: () => {
            setFavorited(prev => !prev)
        },
        onSuccess: () => {
            console.log("successfully toggled favorite")
            MasterToast.show({
                text1: "Successfully toggled favorite!"
            })
        },
        onError: (e: any) => {
            //console.error(e?.message ?? "Failed to toggle favorite")
            setFavorited(prev => !prev) // reverts immediate change if failed
            MasterToast.show({
                text1: "Error favoriting",
                text2: e?.message ?? "Failed to favorite"
            })
        }
    })

    const filteredProfessors = useMemo(() => {
        if (!professors) return []
        const q = query.replace(/\s+/g, '').toLowerCase()
        return [...professors]
            .filter(item =>
                item.name.replace(/\s+/g, '').toLowerCase().includes(q)
            )
    }, [query, course])

    if (loading) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800">
                <ActivityIndicator size="large" color="#fff" className="mt-10 self-center" />
            </SafeAreaView>
        )
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800 flex flex-col justify-center items-center px-5">
                <Text className="font-montserrat dark:text-white">Failed to load course information: {error?.message}</Text>
            </SafeAreaView>
        )
    }

    if (!course) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800 items-center justify-center px-5">
                <Text className="font-montserrat dark:text-white">Failed to load course information (no data found)</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={['left', 'right']}>
            <View className="h-[50px]"></View>
            <Text className="font-montserrat-extrabold text-3xl mb-2 dark:text-white">{course.name}</Text>

            {course.abbreviation ? <Text className="font-montserrat mb-2 dark:text-white">Also known as <Text className="font-montserrat-semibold text-xl">{`${subjectAbbreviation} ${course.abbreviation}`}</Text></Text> : null}
            <Text className="font-montserrat mb-4 dark:text-white"><Text className="font-montserrat-semibold text-xl">{course.units ?? "Unknown"}</Text> units</Text>

            <View className="flex flex-row justify-between items-center gap-x-2 mb-2">
                <Text className="font-montserrat-bold text-2xl dark:text-white">Areas</Text>
                <View className="flex flex-row justify-center items-center gap-x-4">
                    <GestureWrapper className="flex items-center justify-center rounded-full" backgroundColor={colorScheme === "dark" ? "#767576" : "#000"} onPress={onAreaPress}>
                        <Ionicons name="information-outline" size={25} color="white" />
                    </GestureWrapper>
                    {(favorited === null || favoriteLoading) ? <ActivityIndicator size="small" color="#fff" className="self-center" />
                    : favoriteError ? <Ionicons name="alert-outline" size={25} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} /> :
                    (
                        <GestureWrapper className="flex flex-row justify-between items-center" onPress={toggleFavorite} >
                            <Ionicons name={`bookmark${favorited ? "" : "-outline"}`} size={25} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
                        </GestureWrapper>
                    )}
                </View> 
            </View>

            <View className="flex flex-row flex-wrap gap-2 w-full mb-4">
                {areaDisplays}
            </View>

            <View className="flex flex-row justify-start items-center gap-x-[10px] mb-4">
                <SearchBar
                    placeholder="Search"
                    onChangeText={onChangeQuery}
                    disabled={false}
                />
                {course.abbreviation ? <GestureWrapper className="rounded-full" onPress={() => { router.navigate({pathname: "/(modals)/professors/create", params: {courseId: courseId, subjectAbbreviation: subjectAbbreviation, courseAbbreviation: course.abbreviation}}) }} backgroundColor="#d50032">
                    <Ionicons name="add" size={30} color="white" />
                </GestureWrapper> : null}
            </View>

            <Text className="font-montserrat-bold text-2xl mb-2 dark:text-white">Professors</Text>
            { professors.length > 0 ? <FlashList
                data={query != "" ? filteredProfessors : professors}
                renderItem={(item: any) => (
                    <ProfessorCard professor={item.item} course={{id: courseId, abbreviation: course.abbreviation}} subject={{name: subjectName, abbreviation: subjectAbbreviation}} />
                )}
                keyExtractor={(item: any) => item.id.toString() ?? crypto.randomUUID()}
                numColumns={1}
                ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                scrollEnabled={true}
                style={{ flex: 1 }}
                showsVerticalScrollIndicator={false}

                onEndReached={() => {
                    if (hasNextPage && !isFetchingNextPage) {
                        fetchNextPage()
                    }
                }}
                onEndReachedThreshold={0.5} // triggered when XX% from end
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

            /> : <Text className="font-montserrat dark:text-white">No professors found</Text> }
        </SafeAreaView>
    )
}

export default Course