import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TextInput } from "react-native";
import React, { useState } from 'react'
import { GestureWrapper } from '@/app/(tabs)/home'
import { useRouter, useLocalSearchParams } from "expo-router"
import { ToastInstance } from "@/components/ToastWrapper";
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from "@tanstack/react-query";
import api from "@/services/api";
import MasterToast from "@/components/ToastWrapper"
import axios from "axios";

type Form = {
    courseId: string,
    name: string
}

const Create = () => {
    
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
            const response = await api.post(`/professors`, form)
            return true
        },
        onSuccess: () => {
            MasterToast.show({
                text1: "Successfully requested professor!*",
                text2: "*may take up to 24-48h for additions"
            })
            router.back()
        },
        onError: (e: any) => {
            //console.error(e?.message ?? "Failed to verify")
            MasterToast.show({
                text1: "Error requesting professor",
                text2: e?.message ?? "Failed to request"
            })
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
                <Text className="font-montserrat-medium text-lg mb-8 mx-auto dark:text-white">Request a course to be added to a professor (will also add the professor if they aren't added already), requires manual approval. Please allow 24-48 hours for additions</Text>
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
                            placeholder="Enter professor name here..."
                            placeholderTextColor={"#999"}
                        />
                    </View>
                </View>

                { (form.name.trim().length > 0) ? (
                    <GestureWrapper className="flex flex-row gap-x-2 items-center justify-center w-full py-2 rounded-full" backgroundColor="#155dfc" onPress={onCreate}>
                        <Text className="text-white text-xl font-montserrat-semibold">Request</Text>
                        <Ionicons name="send" size={12} color="white" />
                    </GestureWrapper>
                ) : (
                    <View className="flex flex-row gap-x-2 items-center justify-center opacity-50 bg-blue-600 w-full py-2 rounded-full">
                        <Text className="text-white text-xl font-montserrat-semibold">Request</Text>
                        <Ionicons name="send" size={12} color="white" />
                    </View>
                )}

                <View className="bg-transparent h-[65px]"></View>
            </ScrollView>
            <ToastInstance />
        </KeyboardAvoidingView>   
    )
}

export default Create