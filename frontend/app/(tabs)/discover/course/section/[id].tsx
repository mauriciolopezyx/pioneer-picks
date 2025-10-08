import { Text, View, Pressable } from 'react-native'
import { useLocalSearchParams, Link, useRouter } from 'expo-router'
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import data from "@/assets/english.json"
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from "@tanstack/react-query"

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
    const { id:sectionId, course }: {id: string, course: string} = useLocalSearchParams();
    const navigation = useNavigation();

    useEffect(() => {
        if (course) {
        navigation.setOptions({
            headerBackTitle: course,
        });
        }
    }, [course]);

    const info = data.courses.find(c =>
        c.sections.some(section => section.sectionId === sectionId)
    )
    const section = info?.sections.find(s => s.sectionId === sectionId)

    if (!section) {
        return (
            <View></View>
        )
    }

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
        <SafeAreaView className="flex-1 pt-[40px]" edges={["top"]}>
            <View
                className="flex-1 px-5"
            >
                <Text className="font-montserrat-extrabold text-4xl mb-2">{sectionId}</Text>
                <Text className="font-montserrat-bold text-2xl">{section?.professor}</Text>
                <Text className="font-montserrat text-2xl mb-8">{section?.schedule}</Text>

                {/* <View className="border-t-[1px] mb-8"></View> */}

                <View className="border-t-[1px]"></View>
                <Options title="General Information" onPress={ () => {} } />
                <View className="border-t-[1px]"></View>
                <Options title="Reviews" onPress={ () => {} } />
                <View className="border-t-[1px]"></View>

                <Options title="Comments" onPress={ () => { router.navigate({pathname: "/(modals)/section/[commentsId]", params: {commentsId: sectionId}}) } } />
                <View className="border-t-[1px]"></View>
                
            </View>
        </SafeAreaView>
    )
}

const Options = ({title, onPress}: {title: string, onPress: () => void}) => {
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
                <Text className="font-montserrat-medium text-2xl">{title}</Text>
                <Ionicons name="chevron-forward-outline" size={30} color="black" />
            </Animated.View>
        </GestureDetector>
    )
}

export default Course