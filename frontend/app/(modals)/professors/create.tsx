import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput } from "react-native";
import React, { useState } from 'react'
import { GestureWrapper } from '@/app/(tabs)/home'
import { useRouter, useLocalSearchParams } from "expo-router"
import { ToastInstance } from "@/components/ToastWrapper";
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";
import MasterToast from "@/components/ToastWrapper"

type Form = {
    courseId: string,
    name: string
}

const Create = () => {

    // they'll come from (tabs)/discover/courses/[id].tsx, where we'll have + button to add a professor
    
    const { courseId, subjectAbbreviation, courseAbbreviation }: {courseId: string, subjectAbbreviation: string, courseAbbreviation: string} = useLocalSearchParams()
    const router = useRouter()
    
    const [form, setForm] = useState<Form>({
        courseId: courseId,
        name: ""
    })

    const {mutate:onCreate} = useMutation({
        mutationFn: async () => {
            console.log("attempting to post new professor attempt with:", form)
            if (form.name.trim() === "") {
                throw new Error(`The following fields are required: Professor Name`)
            }
            const sessionId = await SecureStore.getItemAsync("session");
            const response = await fetch(`http://${LOCALHOST}:8080/professors`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                ...(sessionId ? { Cookie: `SESSION=${sessionId}` } : {}),
                body: JSON.stringify(form)
            })
            if (!response.ok) {
                const payload = await response.text()
                throw new Error(payload)
            }
        },
        onSuccess: () => {
            router.back()
            //router.navigate({pathname: "/(modals)/professors/reviews/[id]", params: {id: professorId, courseId: courseId} })
            MasterToast.show({
                text1: "Successfully requested professor!*",
                text2: "*may take up to 24-48h for additions"
            })
        },
        onError: (e: any) => {
            console.error(e?.message ?? "Failed to verify")
        }
    })

    return (
        <KeyboardAvoidingView
            className="relative flex-1 dark:bg-gray-800"
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={55}
        >
            <ScrollView className="flex-1 px-5 pt-5">
                <Text className="font-montserrat-bold text-2xl mb-4 mx-auto dark:text-white">Add Professor</Text>
                <View className="border-t-[1px] dark:border-white mb-8"></View>
                <Text className="font-montserrat-medium text-lg mb-4 mx-auto dark:text-white">Request a course to be added to a professor (will also add them if they aren't added already), requires manual approval</Text>
                <View className="flex flex-row justify-between items-center mb-4 border-[1px] rounded-full py-2 px-4 border-light-100 dark:border-light-200 overflow-hidden">
                    <Text className="font-montserrat-bold text-2xl dark:text-white">Course <Text className="font-montserrat text-red-600">*</Text></Text>
                    <Text className="font-montserrat text-xl text-primary">{`${subjectAbbreviation} ${courseAbbreviation}`}</Text>
                </View>
                <View className="flex flex-col justify-start items-start mb-4 border-[1px] py-4 px-4 border-light-100 dark:border-light-200 overflow-hidden">
                    <Text className="flex-1 font-montserrat-bold font-bold text-2xl dark:text-white">Professor Name <Text className="font-montserrat text-red-600">*</Text></Text>
                    <View className="w-full">
                        <TextInput
                            value={form.name}
                            onChangeText={(newText) => { setForm((prev) => ({...prev, ["name"]: newText})) }}
                            className="font-montserrat text-lg text-primary dark:text-white"
                            placeholder=""
                            placeholderTextColor={"#999"}
                        />
                    </View>
                </View>
                <View className="bg-transparent h-[65px]"></View>
            </ScrollView>
            
            { (form.name.length > 0) ? <View className="absolute w-[250px] bottom-1 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <GestureWrapper className="flex flex-row gap-x-2 items-center justify-center bg-blue-600 w-full py-2 rounded-full" onPress={onCreate}>
                    <Text className="text-white text-xl font-montserrat-semibold">Post</Text>
                    <Ionicons name="send-outline" size={12} color="white" />
                </GestureWrapper>
            </View> : null }

            <ToastInstance />
        </KeyboardAvoidingView>   
    )
}

export default Create