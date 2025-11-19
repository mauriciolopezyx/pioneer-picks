import { LOCALHOST } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { SafeAreaView } from "react-native-safe-area-context";
import MasterToast from "@/components/ToastWrapper"

import { View, Text, KeyboardAvoidingView, Platform, Pressable, TextInput, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useState } from 'react'

const formSchema = z.object({
    email: z.string().min(22, {
        message: "Email is required"
    })
})

const ForgotPassword = () => {

    const router = useRouter()
    const colorScheme = useColorScheme()
    const isDark = colorScheme === "dark"

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: ""
        },
        mode: "onChange"
    })

    const {isPending:loading, isError, error, mutate} = useMutation({
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            console.log("submitting forgot password email")
            const sessionId = await SecureStore.getItemAsync("session");
            const response = await fetch(`${LOCALHOST}/auth/forgot-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                ...(sessionId ? { Cookie: `SESSION=${sessionId}` } : {}),
                body: JSON.stringify({
                    email: data.email
                })
            })
            if (!response.ok) {
                const payload = await response.text()
                throw new Error(payload)
            }
            return data.email
        },
        onSuccess: (email: string) => {
            console.log("sent forgot password code to email successfully!")
            MasterToast.show({
                text1: "Successfully sent email code!"
            })
            reset()
            router.replace({pathname: "/verify", params: {email: email, forgot: "true"}})
        },
        onError: (e: any) => {
            //console.error(e?.message ?? "failed to reset password")
            MasterToast.show({
                text1: "Error requesting code",
                text2: JSON.parse(e.message)?.message ?? "Failed to request"
            })
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        mutate(values)
    }

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 justify-center px-6 py-12"
            >
                <View className="mb-6">
                    <Text className="font-montserrat-bold text-4xl mx-auto text-gray-900 dark:text-white mb-6">
                        Forgot Password
                    </Text>
                    <Text className="font-montserrat text-md mx-auto text-gray-900 dark:text-white mb-2" style={{textAlign: "center"}}>
                        Enter your email to receive a verification code:
                    </Text>
                </View>

                <View className="mb-6">
                    <Text className="ml-4 font-montserrat-semibold font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Email
                    </Text>
                    <Controller
                        control={control}
                        name="email"
                        render={({ field: { onChange, onBlur, value } }) => (
                            <TextInput
                            className={`
                                font-montserrat
                                bg-gray-50 dark:bg-gray-700 
                                rounded-full px-4 py-3 pr-12
                                text-gray-900 dark:text-white
                            `}
                            placeholder=""
                            placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            />
                        )}
                    />
                    {errors.email ? (
                        <Text className="font-montserrat text-red-500 dark:text-red-400 text-sm mt-2">
                            {errors.email.message}
                        </Text>
                    ) : null}
                </View>

                <TouchableOpacity
                    onPress={handleSubmit(onSubmit)}
                    disabled={loading}
                    className={`
                        rounded-lg py-3.5 mb-4
                        ${loading 
                        ? "bg-gray-400 dark:bg-gray-600" 
                        : "bg-primary dark:bg-primary"
                        }
                    `}
                >
                    <Text className="font-montserrat-semibold text-white text-center text-lg">
                        {loading ? "Confirming..." : "Confirm"}
                    </Text>
                </TouchableOpacity>

            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ForgotPassword