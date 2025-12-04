import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    useColorScheme,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MasterToast from "@/components/ToastWrapper"

import { zodResolver } from "@hookform/resolvers/zod";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Link, useRouter } from "expo-router";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import api from "@/services/api";

const formSchema = z.object({
    email: z.string().min(22, {
        message: "Email is required"
    }),
    username: z.string(),
    password: z.string().min(5, {
        message: "Password must be at least 5 characters"
    }),
})

export default function Register() {
  
    const router = useRouter()
    const [showPassword, setShowPassword] = useState(false);

    const colorScheme = useColorScheme();
    const isDark = colorScheme === "dark";

    const {
        control,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            username: "",
            password: ""
        },
        mode: "onChange"
    })

    const {isPending:loading, mutate:register} = useMutation({
        mutationFn: async (data: z.infer<typeof formSchema>) => {
            console.log("submitting with:")
            console.log(data)
            const response = await api.post(`/auth/register`, {username: data.username, email: data.email, password: data.password})
            return data.email
        },
        onSuccess: (email: string) => {
            router.dismissTo({pathname: "/verify", params: {email: email, forgot: "false"}})
            reset()
        },
        onError: (e: any) => {
            //console.error(e?.error ?? "Failed to register")
            MasterToast.show({
                text1: "Error registering",
                text2: e?.message ?? "Failed to register"
            })
        }
    })

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        register(values)
    }

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="flex-1 justify-center items-center px-6">
                    <View className="w-full max-w-[500px]">
                        <View className="mb-12">
                            <Text className="font-montserrat-bold text-4xl mx-auto font-bold text-gray-900 dark:text-white mb-2">
                            Register
                            </Text>
                        </View>

                        <View className="mb-4">
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
                                    rounded-full px-4 py-3 
                                    text-gray-900 dark:text-white
                                `}
                                placeholder=""
                                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                                onBlur={() => {
                                    onBlur()
                                }}
                                onChangeText={onChange}
                                value={value}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                                testID="email-input"
                                />
                            )}
                            />
                            {errors.email ? (
                            <Text className="font-montserrat text-red-500 dark:text-red-400 text-sm mt-2">
                                {errors.email.message}
                            </Text>
                            ) : null}
                        </View>

                        <View className="mb-4">
                            <Text className="ml-4 font-montserrat-semibold font-medium text-gray-700 dark:text-gray-300 mb-2">
                            First and Last Name
                            </Text>
                            <Controller
                            control={control}
                            name="username"
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                className={`
                                    font-montserrat
                                    bg-gray-50 dark:bg-gray-700 
                                    rounded-full px-4 py-3 
                                    text-gray-900 dark:text-white
                                `}
                                placeholder=""
                                placeholderTextColor={isDark ? "#9CA3AF" : "#6B7280"}
                                onBlur={() => {
                                    onBlur()
                                }}
                                onChangeText={onChange}
                                value={value}
                                autoCapitalize="none"
                                autoCorrect={false}
                                testID="username-input"
                                />
                            )}
                            />
                            {errors.username ? (
                            <Text className="font-montserrat text-red-500 dark:text-red-400 text-sm mt-2">
                                {errors.username.message}
                            </Text>
                            ) : null}
                        </View>

                        <View className="mb-6">
                            <Text className="ml-4 font-montserrat-semibold font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Password
                            </Text>
                            <View className="relative">
                            <Controller
                                control={control}
                                name="password"
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
                                    onBlur={() => {
                                        onBlur()
                                    }}
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry={!showPassword}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    testID="password-input"
                                />
                                )}
                            />
                            <Pressable
                                onPress={() => setShowPassword(!showPassword)}
                                className="absolute right-5 top-1/2 transform -translate-y-1/2"
                                testID="password-toggle"
                            >
                                {showPassword ? (
                                    <Ionicons name="eye-off-outline" size={20} color={isDark ? "#9CA3AF" : "#6B7280"}/>
                                ) : (
                                    <Ionicons name="eye-outline" size={20} color={isDark ? "#9CA3AF" : "#6B7280"}/>
                                )}
                            </Pressable>
                            </View>
                            {errors.password ? (
                            <Text className="font-montserrat text-red-500 dark:text-red-400 text-sm mt-2">
                                {errors.password.message}
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
                            testID="register-button"
                        >
                            <Text className="font-montserrat-semibold text-white text-center font-semibold text-base">
                            {loading ? "Signing up..." : "Register"}
                            </Text>
                        </TouchableOpacity>

                        <View className="flex-row justify-center items-center">
                            <Text className="font-montserrat text-gray-600 dark:text-gray-400 text-sm">
                            Already have an account?{" "}
                            </Text>
                            <Link replace href="/login" className="font-montserrat-semibold text-blue-600 dark:text-light-100 text-md">Login</Link>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}