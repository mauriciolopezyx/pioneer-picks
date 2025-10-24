import { Text, View, Pressable, useColorScheme, ActivityIndicator } from 'react-native'
import { useLocalSearchParams, Link, useRouter } from 'expo-router'
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import data from "@/assets/english.json"
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from "@tanstack/react-query"
import { revolvingColorPalette, subjectColorMappings } from "@/services/utils"

import {
    SafeAreaView
} from 'react-native-safe-area-context';

import { useQuery } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const Course = () => {

    const colorScheme = useColorScheme()
    const router = useRouter()
    const { id:professorId, courseId, subjectName, subjectAbbreviation, courseAbbreviation }: {id: string, courseId: string, subjectName: string, subjectAbbreviation: string, courseAbbreviation: string} = useLocalSearchParams();
    const navigation = useNavigation();

    const { isLoading:loading, isSuccess:success, error, data:professor } = useQuery({
        queryKey: ["specific-course-professor", professorId, courseId],
        queryFn: async () => {
            const sessionId = await SecureStore.getItemAsync("session");
            const response = await fetch(`http://${LOCALHOST}:8080/professors/${courseId}/${professorId}`, {
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

    const paletteKey = subjectColorMappings[subjectName.toLowerCase()] ?? 0
    const bgColor = revolvingColorPalette[paletteKey]?.primary ?? "#000";
    const textColor = revolvingColorPalette[paletteKey]?.secondary ?? "text-white"

    useEffect(() => {
        if (subjectName) {
            navigation.setOptions({
                headerBackTitle: subjectAbbreviation + " " + courseAbbreviation,
            });
        }
    }, [subjectName]);

    if (loading) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800" edges={["top"]}>
                <ActivityIndicator size="large" color="#fff" className="mt-10 self-center" />
            </SafeAreaView>
        )
    }

    if (error) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800" edges={["top"]}>
                <Text>Failed to load professor: {error?.message}</Text>
            </SafeAreaView>
        )
    }

    if (!professor) {
        return (
            <SafeAreaView className="flex-1 dark:bg-gray-800" edges={["top"]}>
                <Text>Failed to load professor (no data found)</Text>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["top"]}>
            <Text className="font-montserrat-bold text-4xl mb-4 dark:text-white">{professor.name}</Text>

            <View className="flex flex-row items-center justify-start">
                <View style={{backgroundColor: bgColor}} className="rounded-full px-4 py-1 mb-8">
                    <Text className="font-montserrat-semibold text-md dark:text-white">{`${subjectName} ${courseAbbreviation}`}</Text>
                </View>

                <Options onPress={() => {}} colorScheme={colorScheme} category={2} />
            </View>

            {/* <Text className="font-montserrat-bold text-2xl mb-2 dark:text-white">Courses</Text>
            <View className="flex flex-row gap-5 w-full mb-8">
                <View className={`flex justify-center items-center py-2 px-4 rounded-full`} style={{ backgroundColor: bgColor }}>
                    <Text className={`font-montserrat-bold text-sm ${textColor}`}>{"null"}</Text>
                </View>
            </View> */}

            {/* <View className="border-t-[1px] mb-8"></View> */}

            <View className="border-t-[1px] dark:border-white"></View>
            <Options title={`Reviews`} category={2} emphasis={`(${professor.reviewCount})`} onPress={ () => { router.navigate({pathname: "/(modals)/professors/reviews/[id]", params: {id: professor.id, courseId: courseId}}) } } colorScheme={colorScheme} />
            <View className="border-t-[1px] dark:border-white"></View>

            <Options title={`Comments`} category={1} emphasis={`(${professor.commentCount})`} onPress={ () => { router.navigate({pathname: "/(modals)/professors/comments/[id]", params: {id: professor.id, courseId: courseId}}) } } colorScheme={colorScheme} />
            <View className="border-t-[1px] dark:border-white"></View>
        </SafeAreaView>
    )
}

const Options = ({title, emphasis, onPress, colorScheme, category}: {title?: string, emphasis?: string | number, onPress: () => void, colorScheme: string | null | undefined, category: number}) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const handleSubmit = () => {
        onPress()
    };

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
        });
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));

    if (category === 1) {
        return (
            <GestureDetector gesture={tap}>
                <Animated.View
                    className="flex flex-row justify-between items-center py-4"
                    style={animatedStyle}
                >   
                    <View className="flex flex-row justify-center items-center gap-x-2">
                        <Text className="font-montserrat-medium text-xl dark:text-white">{title}</Text>
                        {emphasis ? (
                            <Text className="font-montserrat-semibold text-2xl dark:text-white">{emphasis}</Text>
                        ): null}
                    </View>
                    <Ionicons name="chevron-forward-outline" size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
                </Animated.View>
            </GestureDetector>
        )
    }

    return (
        <GestureDetector gesture={tap}>
            <Animated.View
                className="flex flex-row justify-between items-center py-4"
                style={animatedStyle}
            >   
                <Ionicons name="bookmark-outline" size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
            </Animated.View>
        </GestureDetector>
    )
}

export default Course