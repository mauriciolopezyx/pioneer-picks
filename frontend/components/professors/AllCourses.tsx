import { Text, useColorScheme, ActivityIndicator, View } from 'react-native'
import React, { useState } from 'react'
import { FavoriteCourse as ProfessorCourse } from '@/app/(tabs)/home'
import { FlashList } from '@shopify/flash-list'

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
    const [favorited, setFavorited] = useState(data.favorited) // data.favorited is initial favorited status

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
            console.error(e?.message ?? "Failed to toggle favorite")
            setFavorited(prev => !prev) // reverts immediate change if failed
        }
    })

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["top"]}>
            <Text>{data.info.name}'s Courses</Text>

            {favoriteLoading ? <ActivityIndicator size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} /> : 
            favoriteError ? <Ionicons name="alert-outline" size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} /> : (
                <GestureWrapper className="flex flex-row justify-between items-center py-4" onPress={toggleFavorite} >
                    <Ionicons name={`bookmark${favorited ? "" : "-outline"}`} size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
                </GestureWrapper>
            )}

            <CatalogSection data={data.courses} ItemComponent={FavoriteCourseCard} />

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
      numColumns={3}
      keyExtractor={(item: any) => item.id.toString() ?? crypto.randomUUID()}
      showsVerticalScrollIndicator={false}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
    />
  )
}

export default AllProfessorCourses