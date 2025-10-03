import { SafeAreaView, Text, View, Pressable } from 'react-native'
import { useLocalSearchParams, Link } from 'expo-router'
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import data from "@/assets/english.json"
import { Ionicons } from '@expo/vector-icons';

const Course = () => {

    const { id:sectionId, course } = useLocalSearchParams();
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

    return (
        <SafeAreaView className="flex-1">
            <View
                className="flex-1 px-5"
            >
                <Text className="font-black text-4xl mb-2">{sectionId}</Text>
                <Text className="font-bold text-2xl">{section?.professor}</Text>
                <Text className="font-medium text-2xl mb-8">{section?.schedule}</Text>

                {/* <View className="border-t-[1px] mb-8"></View> */}

                <Pressable className="flex flex-row justify-between items-center border-y-[1px] py-4">
                    <Text className="font-medium text-2xl">Syllabus</Text>
                    <Ionicons name="chevron-forward-outline" size={30} color="black" />
                </Pressable>

                <Pressable className="flex flex-row justify-between items-center border-b-[1px] py-4">
                    <Text className="font-medium text-2xl">Books</Text>
                    <Ionicons name="chevron-forward-outline" size={30} color="black" />
                </Pressable>

                <Pressable className="flex flex-row justify-between items-center border-b-[1px] py-4">
                    <Text className="font-medium text-2xl">Student Contributions</Text>
                    <Ionicons name="chevron-forward-outline" size={30} color="black" />
                </Pressable>

                <Link href={`/section/${sectionId}`} asChild>
                    <Pressable className="flex flex-row justify-between items-center border-b-[1px] py-4">
                        <Text className="font-medium text-2xl">Reviews</Text>
                        <Ionicons name="chevron-forward-outline" size={30} color="black" />
                    </Pressable>
                </Link>
                
            </View>
        </SafeAreaView>
    )
}


export default Course