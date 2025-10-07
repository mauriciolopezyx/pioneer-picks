import { SafeAreaView, Text, View, Pressable } from 'react-native'
import { useLocalSearchParams, Link } from 'expo-router'
import { useState, useEffect, useRef } from "react";
import { useNavigation } from "@react-navigation/native";
import data from "@/assets/english.json"
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from "@tanstack/react-query"

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
        <SafeAreaView className="flex-1">
            <View
                className="flex-1 px-5"
            >
                <Text className="font-extrabold text-4xl mb-2">{sectionId}</Text>
                <Text className="font-bold text-2xl">{section?.professor}</Text>
                <Text className="text-2xl mb-8">{section?.schedule}</Text>

                {/* <View className="border-t-[1px] mb-8"></View> */}

                <Pressable className="flex flex-row justify-between items-center border-y-[1px] py-4">
                    <Text className="text-2xl">Syllabus</Text>
                    <Ionicons name="chevron-forward-outline" size={30} color="black" />
                </Pressable>

                <Pressable className="flex flex-row justify-between items-center border-b-[1px] py-4">
                    <Text className="text-2xl">Books</Text>
                    <Ionicons name="chevron-forward-outline" size={30} color="black" />
                </Pressable>

                <Pressable className="flex flex-row justify-between items-center border-b-[1px] py-4">
                    <Text className=" text-2xl">Student Contributions</Text>
                    <Ionicons name="chevron-forward-outline" size={30} color="black" />
                </Pressable>

                <Link href={`/section/${sectionId}`} asChild>
                    <Pressable className="flex flex-row justify-between items-center border-b-[1px] py-4">
                        <Text className="text-2xl">Reviews</Text>
                        <Ionicons name="chevron-forward-outline" size={30} color="black" />
                    </Pressable>
                </Link>
                
            </View>
        </SafeAreaView>
    )
}


export default Course