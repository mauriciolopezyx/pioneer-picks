import { Text, ScrollView, View, ActivityIndicator, Animated as RNAnimated, useColorScheme } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { FlashList } from "@shopify/flash-list";
import { useState, useEffect, useLayoutEffect, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import ProfessorCard from '@/components/ProfessorCard';
import { Ionicons } from '@expo/vector-icons';
import { areas, revolvingColorPalette, areaAbbreviations, findAreaParentKey, areaColorMappings } from "@/services/utils";
import { GestureWrapper } from '../../home';

import { useQuery, useMutation } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

import MasterToast from "@/components/ToastWrapper"

import {
    SafeAreaView
} from 'react-native-safe-area-context';

//public record FullCourseDto(UUID id, String name, String abbreviation, Integer units, String areas, List<BasicProfessorDto> professors) {}

const Course = () => {

    const router = useRouter()
    const colorScheme = useColorScheme()
    const { id:courseId, subjectName, subjectAbbreviation }: {id: string, subjectName: string, subjectAbbreviation: string} = useLocalSearchParams();
    const navigation = useNavigation();

    const [favorited, setFavorited] = useState<boolean | null>(null)

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
            const sessionId = await SecureStore.getItemAsync("session");
            const response = await fetch(`http://${LOCALHOST}:8080/courses/${courseId}`, {
                method: "GET",
                ...(sessionId ? { Cookie: `SESSION=${sessionId}` } : {}),
            })
            if (!response.ok) {
                const payload = await response.text()
                throw new Error(payload)
            }
            const json = await response.json()
            setFavorited(json.favorited)
            return json
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 48
    })

    const onAreaPress = () => {
        router.navigate({
            pathname: "/(modals)/areas"
        })
    }
    
    const scrollY = useMemo(() => new RNAnimated.Value(0), []);

    useLayoutEffect(() => {
        const listenerId = scrollY.addListener(({ value }) => {
        const opacity = Math.min(value / 30, 1)
        navigation.setOptions({
            headerTintColor: `rgba(213, 0, 50, ${1 - opacity})`
        })
        })

        return () => {
        scrollY.removeListener(listenerId)
        }
    }, [])

    const handleScroll = RNAnimated.event(
        [{ nativeEvent: { contentOffset: { y: scrollY } } }],
        { useNativeDriver: false }
    )

    const seen = new Set()
    const areaDisplays = course ? course.areas.split(",").map((area: string) => {
        if (seen.has(area)) return null
        if (areaAbbreviations[area] && seen.has(areaAbbreviations[area])) return null

        seen.add(area)
        const parentArea = findAreaParentKey(areas, area)
        const bgAreaColor = (parentArea && areaColorMappings[parentArea.toLowerCase()]) ? revolvingColorPalette[areaColorMappings[parentArea.toLowerCase()]].primary : "transparent"
        const textAreaColor = (parentArea && areaColorMappings[parentArea.toLowerCase()]) ? revolvingColorPalette[areaColorMappings[parentArea.toLowerCase()]].secondary : "text-white"

        if (areaAbbreviations[area]) {
            seen.add(areaAbbreviations[area])
            return (
                <View key={areaAbbreviations[area]} className="rounded-full px-4 py-1" style={ { backgroundColor: bgAreaColor } }>
                <Text className={`font-montserrat-medium text-sm ${textAreaColor}`}>{areaAbbreviations[area]}</Text>
                </View>
            )
        }
        return (
            <View key={area} className="rounded-full px-4 py-1" style={ { backgroundColor: bgAreaColor } }>
            <Text className={`font-montserrat-medium text-sm ${textAreaColor}`}>{area}</Text>
            </View>
        )
    }) : null

    ///////////////////////

    const {isPending:favoriteLoading, isError, error:favoriteError, mutate:toggleFavorite} = useMutation({
        mutationFn: async () => {
            console.log("attempting to toggle favorite course when favorited status is:", favorited)
            const sessionId = await SecureStore.getItemAsync("session");
            const response = await fetch(`http://${LOCALHOST}:8080/favorites/course/${courseId}`, {
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

    if (loading) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800" edges={['left', 'right']}>
                <ActivityIndicator size="large" color="#fff" className="mt-10 self-center" />
            </SafeAreaView>
        )
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800" edges={['left', 'right']}>
                <Text>Failed to load course information: {error?.message}</Text>
            </SafeAreaView>
        )
    }

    if (!course) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800" edges={['left', 'right']}>
                <Text>Failed to load course information (no data found)</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800" edges={['left', 'right']}>
            <ScrollView
                className="flex-1 px-5"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    minHeight: "100%", paddingBottom: 10
                }}
                onScroll={handleScroll}
            >
                <View className="h-[50px]"></View>
                <Text className="font-montserrat-extrabold text-3xl mb-2 dark:text-white">{course.name}</Text>

                <Text className="font-montserrat mb-2 dark:text-white">Also known as <Text className="font-montserrat-semibold text-xl">{`${subjectAbbreviation} ${course.abbreviation}`}</Text></Text>
                <Text className="font-montserrat mb-4 dark:text-white"><Text className="font-montserrat-semibold text-xl">{course.units}</Text> units</Text>

                <View className="flex flex-row justify-between items-center gap-x-2 mb-2">
                    <Text className="font-montserrat-bold text-2xl dark:text-white">Areas</Text>
                    <View className="flex flex-row justify-center items-center">
                        <GestureWrapper className="flex items-center justify-center rounded-full bg-black dark:bg-light-200" onPress={onAreaPress}>
                            <Ionicons name="information-outline" size={25} color="white" />
                        </GestureWrapper>
                        {(favorited === null || favoriteLoading) ? <ActivityIndicator size="large" color="#fff" className="mt-10 self-center" />
                        : favoriteError ? <Ionicons name="alert-outline" size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} /> :
                        (
                            <GestureWrapper className="flex flex-row justify-between items-center py-4" onPress={toggleFavorite} >
                                <Ionicons name={`bookmark${favorited ? "" : "-outline"}`} size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
                            </GestureWrapper>
                        )}
                    </View> 
                </View>

                <View className="flex flex-row gap-2 w-full mb-4">
                    {areaDisplays}
                </View>

                <Text className="font-montserrat-bold text-2xl mb-2 dark:text-white">Professors</Text>
                <FlashList
                    data={course.professors}
                    renderItem={(item: any) => (
                        <ProfessorCard professor={item.item} course={{id: courseId, abbreviation: course.abbreviation}} subject={{name: subjectName, abbreviation: subjectAbbreviation}} />
                    )}
                    keyExtractor={(item: any) => item.id.toString() ?? crypto.randomUUID()}
                    numColumns={1}
                    ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
                    scrollEnabled={false}
                />
                <View className="h-[50px]"></View>
            </ScrollView>
        </SafeAreaView>
    )
}

export default Course