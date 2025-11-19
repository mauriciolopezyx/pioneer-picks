import { LOCALHOST } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useLocalSearchParams } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useParsedLocalSearchParams } from "@/services/utils";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import MasterToast from "@/components/ToastWrapper"
import { useAuth } from "@/components/AuthProvider";

import { View, Text, KeyboardAvoidingView, Platform, Pressable, TextInput, TouchableOpacity, useColorScheme } from 'react-native'
import React, { useState } from 'react'

const formSchema = z.object({
    old: z.string().optional(),
    new: z.string().min(5, {
        message: "New password is required"
    }),
})

type ResetPasswordParams = {
    token?: string,
    email?: string
}

// since we're not doing OAuth, if token/email both aren't in params then its coming from a user already signed in (and they have to have a password...)

const ResetPassword = () => {

    const [passwordShowStatuses, setPasswordShowStatuses] = useState({old: false, new: false})
    const onToggleUpdate = (key: "old" | "new", value: boolean) => {
        setPasswordShowStatuses((prev) => ({...prev, [key]: value}))
    }

    const params = useParsedLocalSearchParams<ResetPasswordParams>((raw) => ({
        token: raw.token,
        email: raw.email
    }))
    const { token, email } = params

    const router = useRouter()
    const { refetch:refetchAuth } = useAuth()
    const colorScheme = useColorScheme()
    const isDark = colorScheme === "dark"

    const conditionalTitle = (!token && !email) ? "Enter your current and newly chosen password:" : "Create your new password below:"
    const endpoint = token ? `${LOCALHOST}/auth/forgot-password/reset` : `${LOCALHOST}/user/me/password`

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            old: "",
            new: ""
        },
        mode: "onChange"
    })

    const {isPending:loading, isError, error, mutate:resetPassword} = useMutation({
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            console.log("submitting reset password *Attempt*")
            const sessionId = await SecureStore.getItemAsync("session");
            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                ...(sessionId ? { Cookie: `SESSION=${sessionId}` } : {}),
                body: JSON.stringify({
                    ...( (!token && !email) && {oldPassword: data.old}),
                    ...(token && {forgotToken: token}),
                    ...(email && {email: email}),
                    newPassword: data.new
                })
            })
            if (!response.ok) {
                const payload = await response.text()
                throw new Error(payload)
            }
        },
        onSuccess: async () => {
            console.log("reset password successfully!")
            MasterToast.show({
                text1: "Successfully reset password!"
            })
            reset()
            if (token) {
                await refetchAuth()
            }
            router.replace({pathname: "/"})
        },
        onError: (e: any) => {
            //console.error(e?.message ?? "failed to reset password")
            MasterToast.show({
                text1: "Error resetting password",
                text2: JSON.parse(e.message)?.message ?? "Failed to reset"
            })
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log("att reset?")
        resetPassword(values)
    }

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1 justify-center px-6 py-12"
            >
                <View className="mb-6">
                    <Text className="font-montserrat-bold text-4xl mx-auto text-gray-900 dark:text-white mb-6">
                        Reset Password
                    </Text>
                    <Text className="font-montserrat text-md mx-auto text-gray-900 dark:text-white mb-2">
                        {conditionalTitle}
                    </Text>
                </View>

                { (!token && !email) ? <View className="mb-6">
                    <Text className="ml-4 font-montserrat-semibold font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Current Password
                    </Text>
                    <View className="relative">
                        <Controller
                        control={control}
                        name="old"
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
                            secureTextEntry={!passwordShowStatuses.old}
                            autoCapitalize="none"
                            autoCorrect={false}
                            />
                        )}
                        />
                        <Pressable
                            onPress={() => onToggleUpdate("old", !passwordShowStatuses.old)}
                            className="absolute right-5 top-1/2 transform -translate-y-1/2"
                        >
                        {passwordShowStatuses.old ? (
                            <Ionicons name="eye-off-outline" size={20} color={isDark ? "#9CA3AF" : "#6B7280"}/>
                        ) : (
                            <Ionicons name="eye-outline" size={20} color={isDark ? "#9CA3AF" : "#6B7280"}/>
                        )}
                        </Pressable>
                    </View>
                    {errors.old ? (
                        <Text className="font-montserrat text-red-500 dark:text-red-400 text-sm mt-2">
                            {errors.old.message}
                        </Text>
                    ) : null}
                </View> : null }

                <View className="mb-6">
                    <Text className="ml-4 font-montserrat-semibold font-medium text-gray-700 dark:text-gray-300 mb-2">
                        New Password
                    </Text>
                    <View className="relative">
                        <Controller
                        control={control}
                        name="new"
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
                            secureTextEntry={!passwordShowStatuses.new}
                            autoCapitalize="none"
                            autoCorrect={false}
                            />
                        )}
                        />
                        <Pressable
                            onPress={() => onToggleUpdate("new", !passwordShowStatuses.new)}
                            className="absolute right-5 top-1/2 transform -translate-y-1/2"
                        >
                        {passwordShowStatuses.new ? (
                            <Ionicons name="eye-off-outline" size={20} color={isDark ? "#9CA3AF" : "#6B7280"}/>
                        ) : (
                            <Ionicons name="eye-outline" size={20} color={isDark ? "#9CA3AF" : "#6B7280"}/>
                        )}
                        </Pressable>
                    </View>
                    {errors.new ? (
                        <Text className="font-montserrat text-red-500 dark:text-red-400 text-sm mt-2">
                            {errors.new.message}
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

export default ResetPassword