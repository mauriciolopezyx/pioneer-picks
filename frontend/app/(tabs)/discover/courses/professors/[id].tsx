import { Text, View, Pressable } from 'react-native'
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

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const Course = () => {

    const router = useRouter()
    const { id:professorId, course, subject }: {id: string, course: string, subject: string} = useLocalSearchParams();
    const navigation = useNavigation();

    useEffect(() => {
        if (course) {
        navigation.setOptions({
            headerBackTitle: course,
        });
        }
    }, [course]);

    const info = data.courses.find(c =>
        c.professors?.some(section => section.id === professorId)
    )
    const professor = info?.professors?.find(s => s.id === professorId)

    if (!professor) {
        return (
            <View></View>
        )
    }

    const paletteKey = subjectColorMappings[subject.toLowerCase()] ?? 0
    const bgColor = revolvingColorPalette[paletteKey]?.primary ?? "#000";
    const textColor = revolvingColorPalette[paletteKey]?.secondary ?? "text-white"

    // const {isPending:loading, isError, error, mutate} = useMutation({
    //     mutationFn: async () => {
    //         const response = await fetch("https://csueb.instructure.com/api/v1/courses", {
    //             method: 'GET',
    //             //headers: { Authorization: 'Basic ' + btoa('off:off') },
    //             headers: { Authorization: `Bearer 21145~u2xzm4mr47enFYnGWCJh7RcykARRBR9DwHk9L2nnQ8JQ2CNAYTM6kk9YuePU2cLL` }
    //         })
    //         if (!response.ok) {
    //             const payload = await response.text()
    //             throw new Error(payload)
    //         }
    //         const json = await response.json()
    //         console.log("json received:")
    //         console.log(json)
    //         console.log("length is json is " + json)
    //     }
    // })

    // useEffect( () => {
    //     mutate()
    // }, [])


    return (
        <SafeAreaView className="flex-1" edges={["top"]}>
            <View
                className="px-5"
            >
                {/* <Text className="font-montserrat-bold text-lg">Professor</Text> */}
                <Text className="font-montserrat-bold text-4xl mb-2">{professor.name}</Text>

                <Text className="font-montserrat mb-4">has taught <Text className="font-montserrat-bold">{course}</Text> for <Text className="font-montserrat-bold">{3}</Text> semesters</Text>

                <Text className="font-montserrat-bold text-2xl mb-2">Courses</Text>
                <View className="flex flex-row gap-5 w-full mb-8">
                    <View className={`flex justify-center items-center py-2 px-4 rounded-full`} style={{ backgroundColor: bgColor }}>
                        <Text className={`font-montserrat-bold text-sm ${textColor}`}>{course}</Text>
                    </View>
                </View>

                {/* <View className="border-t-[1px] mb-8"></View> */}

                <View className="border-t-[1px]"></View>
                <Options title={`Reviews`} emphasis={`(${professor.reviews.length})`} onPress={ () => { router.navigate({pathname: "/(modals)/professors/reviews/[id]", params: {id: professor.id}}) } } />
                <View className="border-t-[1px]"></View>

                <Options title={`Comments`} emphasis={`(${professor.comments.length})`} onPress={ () => { router.navigate({pathname: "/(modals)/professors/comments/[id]", params: {id: professor.id}}) } } />
                <View className="border-t-[1px]"></View>
                
            </View>
        </SafeAreaView>
    )
}

const Options = ({title, emphasis, onPress}: {title: string, emphasis?: string | number, onPress: () => void}) => {
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

    return (
        <GestureDetector gesture={tap}>
            <Animated.View
                className="flex flex-row justify-between items-center py-4"
                style={animatedStyle}
            >   
                <View className="flex flex-row justify-center items-center gap-x-2">
                    <Text className="font-montserrat-medium text-xl">{title}</Text>
                    {emphasis ? (
                        <Text className="font-montserrat-semibold text-2xl">{emphasis}</Text>
                    ): null}
                </View>
                <Ionicons name="chevron-forward-outline" size={30} color="black" />
            </Animated.View>
        </GestureDetector>
    )
}

export default Course