import { Text, useColorScheme, ActivityIndicator, View } from 'react-native'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { FavoriteCourse as ProfessorCourse } from '@/app/(tabs)/home'
import { FlashList } from '@shopify/flash-list'
import { useNavigation } from "@react-navigation/native";
import SearchBar from '../SearchBar';
import * as Device from 'expo-device';

import { useQuery, useMutation, useInfiniteQuery } from '@tanstack/react-query'
import api from '@/services/api';
import { SafeAreaView } from 'react-native-safe-area-context'
import MasterToast from "@/components/ToastWrapper"
import { GestureWrapper, FavoriteCourseCard } from '@/app/(tabs)/home';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';

type DataProps = {
    courses: ProfessorCourse[],
    favorited: boolean,
    info: {
        name: string
    }
}

const AllProfessorCourses = ({params}: {params: {professorId: string}}) => {

    const { isLoading:infoLoading, data:info } = useQuery({
        queryKey: ["specific-professor-info", params.professorId],
        queryFn: async () => {
            const response = await api.get(`/professors/${params.professorId}`)
            return response.data
        },
        refetchOnWindowFocus: true
    })

    const {
        data:rawCourses,
        isLoading:loading,
        error,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ["specific-professor-courses", params.professorId],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await api.get(`/professors/${params.professorId}/courses?page=${pageParam}`)
            return response.data
        },
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.hasMore ? allPages.length : undefined
        },
        initialPageParam: 0,
        refetchOnWindowFocus: false
    })

    const courses = rawCourses?.pages.flatMap(page => page.content) ?? []

    const colorScheme = useColorScheme()
    const navigation = useNavigation()
    const [favorited, setFavorited] = useState<boolean>(false)

    useEffect(() => {
        if (info) {
            setFavorited(info.favorited)
        }
    }, [info])

    const [query, setQuery] = useState("")
    //const [filter, setFilter] = useState(filterOptions.length - 1)
    const onChangeQuery = useCallback((text: string) => {
        setQuery(text)
    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerBackTitle: "Back",
        })
    }, [])

    const {isPending:favoriteLoading, error:favoriteError, mutate:toggleFavorite} = useMutation({
        mutationFn: async () => {
            console.log("attempting to toggle favorite professor when favorited status is:", favorited)
            if (favorited) {
                const response = await api.delete(`/favorites/professor/${params.professorId}`)
                return true
            }

            const response = await api.post(`/favorites/professor/${params.professorId}`)
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

    const filteredCourses = useMemo(() => {
        if (!courses) return []
        const q = query.replace(/\s+/g, '').toLowerCase()
        return [...courses]
            .filter(item =>
                item.name.replace(/\s+/g, '').toLowerCase().includes(q)
            )
    }, [query, courses])


    if (infoLoading || loading) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800">
                <ActivityIndicator size="large" color="#fff" className="mt-10 self-center" />
            </SafeAreaView>
        )
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800 flex flex-col justify-center items-center px-5">
                <Text className="font-montserrat dark:text-white">Failed to load professor: {error?.message}</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["top"]}>
            <Text className="font-montserrat-bold text-4xl dark:text-white mb-4">{info.info.name}'s Courses</Text>

            <View className="flex flex-row justify-start items-center gap-x-[10px] mb-4">
                <SearchBar
                    placeholder="Search"
                    onChangeText={onChangeQuery}
                    disabled={false}
                />
            </View>

            {favoriteLoading ? <ActivityIndicator size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} /> : 
            favoriteError ? <Ionicons name="alert-outline" size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} /> : (
                <GestureWrapper className="flex flex-row justify-between items-center mb-4 w-[30px]" onPress={toggleFavorite} >
                    <Ionicons name={`bookmark${favorited ? "" : "-outline"}`} size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
                </GestureWrapper>
            )}

            {courses.length > 0 ? (
                <CatalogSection data={query != "" ? filteredCourses : courses} ItemComponent={FavoriteCourseCard} hasNextPage={hasNextPage} isFetchingNextPage={isFetchingNextPage} fetchNextPage={fetchNextPage} />
            ) : <Text className="font-montserrat dark:text-white">No courses found</Text>}

        </SafeAreaView>
    )
}

export type CatalogSectionProps<T> = {
    data: T[] | null,
    ItemComponent: React.ComponentType<{ data: T }>,
    hasNextPage: boolean,
    isFetchingNextPage: boolean,
    fetchNextPage: (...args: any[]) => any
}

export const CatalogSection = <T,>({data, ItemComponent, hasNextPage, isFetchingNextPage, fetchNextPage}: CatalogSectionProps<T>) => {
    
    const colorScheme = useColorScheme()

    return (
        <FlashList
            data={data}
            renderItem={(item: any) => (
                <ItemComponent data={item.item} />
            )}
            numColumns={Device.deviceType != 2 ? 2 : 4}
            keyExtractor={(item: any) => item.id.toString() ?? crypto.randomUUID()}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={{ height: 10 }} />}

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
        />
    )
}

export default AllProfessorCourses