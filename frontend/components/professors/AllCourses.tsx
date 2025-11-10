import { Text, useColorScheme, ActivityIndicator, View } from 'react-native'
import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { FavoriteCourse as ProfessorCourse } from '@/app/(tabs)/home'
import { FlashList } from '@shopify/flash-list'
import { useNavigation } from "@react-navigation/native";
import SearchBar from '../SearchBar';

import { useMutation } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

import { SafeAreaView } from 'react-native-safe-area-context'
import MasterToast from "@/components/ToastWrapper"
import { GestureWrapper, FavoriteCourseCard } from '@/app/(tabs)/home';
import { Ionicons } from '@expo/vector-icons';

type DataProps = {
    courses: ProfessorCourse[],
    favorited: boolean,
    info: {
        name: string
    }
}

const AllProfessorCourses = ({data, params}: {data: DataProps, params: {professorId: string}}) => {

    const colorScheme = useColorScheme()
    const navigation = useNavigation()
    const [favorited, setFavorited] = useState(data.favorited) // data.favorited is initial favorited status

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

    const {isPending:favoriteLoading, isError, error:favoriteError, mutate:toggleFavorite} = useMutation({
        mutationFn: async () => {
            console.log("attempting to toggle favorite professor when favorited status is:", favorited)
            const sessionId = await SecureStore.getItemAsync("session");
            const response = await fetch(`http://${LOCALHOST}:8080/favorites/professor/${params.professorId}`, {
                method: favorited ? "DELETE" : "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                ...(sessionId ? { Cookie: `SESSION=${sessionId}` } : {})
            })
            if (!response.ok) {
                const payload = await response.text()
                throw new Error(payload)
            }
        },
        onMutate: () => {
            setFavorited(prev => !prev)
        },
        onSuccess: () => {
            console.log("successfully toggled favorite")
            MasterToast.show({
                text1: "Successfully toggled favorite! (change text later)"
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
        if (!data?.courses) return []
        const q = query.replace(/\s+/g, '').toLowerCase()
        return [...data.courses]
            .filter(item =>
                item.name.replace(/\s+/g, '').toLowerCase().includes(q)
            )
    }, [query, data])

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["top"]}>
            <Text className="font-montserrat-bold text-4xl dark:text-white mb-4">{data.info.name}'s Courses</Text>

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

            {favoriteLoading ? <ActivityIndicator size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} /> : 
            favoriteError ? <Ionicons name="alert-outline" size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} /> : (
                <GestureWrapper className="flex flex-row justify-between items-center py-4" onPress={toggleFavorite} >
                    <Ionicons name={`bookmark${favorited ? "" : "-outline"}`} size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
                </GestureWrapper>
            )}

            <CatalogSection data={query != "" ? filteredCourses : data.courses} ItemComponent={FavoriteCourseCard} />

        </SafeAreaView>
    )
}

export type CatalogSectionProps<T> = {
  data: T[] | null,
  ItemComponent: React.ComponentType<{ data: T }>
}

export const CatalogSection = <T,>({data, ItemComponent}: CatalogSectionProps<T>) => {
  return (
    <FlashList
      data={data}
      renderItem={(item: any) => (
          <ItemComponent data={item.item} />
      )}
      numColumns={2}
      keyExtractor={(item: any) => item.id.toString() ?? crypto.randomUUID()}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  )
}

export default AllProfessorCourses