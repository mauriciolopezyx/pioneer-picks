import { Text, ScrollView, View, ActivityIndicator, Animated as RNAnimated } from 'react-native'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { FlashList } from "@shopify/flash-list";
import { useEffect, useLayoutEffect, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import ProfessorCard from '@/components/ProfessorCard';
import { Ionicons } from '@expo/vector-icons';
import { areas, revolvingColorPalette, subjectColorMappings, areaAbbreviations, findAreaParentKey, areaColorMappings } from "@/services/utils";

import { useQuery } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
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

//public record FullCourseDto(UUID id, String name, String abbreviation, Integer units, String areas, List<BasicProfessorDto> professors) {}

const Course = () => {

    const router = useRouter()
    const { id:courseId, subjectName, subjectAbbreviation }: {id: string, subjectName: string, subjectAbbreviation: string} = useLocalSearchParams();
    const navigation = useNavigation();

    useEffect(() => {
        if (subjectName) {
            navigation.setOptions({
                headerBackTitle: subjectName,
            });
        }
    }, [subjectName]);

    //const course = data.courses.find(element => element.courseId === courseId)

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
            return json
        },
        refetchOnWindowFocus: false,
        staleTime: 1000 * 60 * 60 * 24,
        gcTime: 1000 * 60 * 60 * 48
    })

    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const handleSubmit = () => {
        router.navigate({
            pathname: "/(modals)/areas"
        })
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
            scheduleOnRN(handleSubmit);
        })
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value
    }));

    ////////////
    
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
                <Text>Failed to load professor: {error?.message}</Text>
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
                    <GestureDetector gesture={tap}>
                        <Animated.View className="flex items-center justify-center rounded-full bg-black dark:bg-light-200" style={animatedStyle}>
                            <Ionicons name="information-outline" size={25} color="white" />
                        </Animated.View>
                    </GestureDetector>
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