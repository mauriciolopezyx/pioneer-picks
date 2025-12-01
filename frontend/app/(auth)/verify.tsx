import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState, useCallback, useEffect } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import api from "@/services/api";
import axios from "axios";
import MasterToast from "@/components/ToastWrapper"
import { useAuth } from "@/components/AuthProvider";

export default function Verify() {

    const [code, setCode] = useState("")
    const onChangeQuery = useCallback((text: string) => {
        setCode(text)
    }, [])

    const [resendCooldown, setResendCooldown] = useState(0)

    useEffect(() => {
        if (resendCooldown === 0) return

        const interval = setInterval(() => {
            setResendCooldown(prev => {
                if (prev <= 1) {
                    clearInterval(interval)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(interval)
    }, [resendCooldown])

    const router = useRouter()
    const { email, forgot }: {email: string, forgot: string} = useLocalSearchParams()
    const forgotPassword = forgot === "true"
    const { refetch } = useAuth()

    const verifyEndpoint = forgotPassword ? `/auth/forgot-password/code` : `/auth/verify`
    const resendEndpoint = forgotPassword ? `/auth/forgot-password/code/resend` : `/auth/resend`
    const redirectUrl = forgotPassword ? "/(auth)/reset-password" : "/"

    const {isPending:loading, isError, mutate:confirmMutate} = useMutation({
        mutationFn: async () => {
            if (code.length !== 6) {
                throw new Error("Failed to send code: Please enter a 6-digit code")
            }
            if (!email) {
                throw new Error("Failed to send code: no email detected")
            }
            console.log("submitting verify attempt")
            const response = await api.post(verifyEndpoint, {email: email, verificationCode: code})
            return response.data
        },
        onSuccess: async (json) => {
            await refetch()
            router.replace({pathname: redirectUrl, params: {token: (json?.token && forgotPassword) ? json.token : undefined, email: (json?.token && forgotPassword) ? email : undefined}})
        },
        onError: (e: any) => {
            //console.error(e?.message ?? "Failed to verify")
            MasterToast.show({
                text1: "Error verifying code",
                text2: e?.message ?? "Failed to verify"
            })
        }
    })

    const {mutate:resendCode} = useMutation({
        mutationFn: async () => {
            console.log("submitting resend code")
            const response = await api.post(resendEndpoint, {email: email})
            setResendCooldown(30)
            return true
        },
        onSuccess: () => {
            console.log("successfully resent code!")
        },
        onError: (e: any) => {
            //console.error(e?.message ?? "Failed to resend code")
            MasterToast.show({
                text1: "Error resending code",
                text2: e?.message ?? "Failed to resend"
            })
        }
    })

    function maskEmail(email: string) {
        const [local, domain] = email.split('@')
        if (!domain) return email
        return email[0] + '*'.repeat(local.length-1) + '@' + domain
    }

    return (
        <SafeAreaView className="flex-1 dark:bg-gray-800">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <View className="flex-1 justify-center items-center px-6">
                    <View className="w-full max-w-[500px]">
                        <View className="items-center mb-8">
                            <Text className="font-montserrat-bold text-3xl font-bold text-gray-900 dark:text-white mb-6">
                                Verify
                            </Text>
                            <Text className="font-montserrat text-gray-600 dark:text-gray-300 text-center">
                                Enter the code sent to <Text className="font-montserrat-semibold">{email ? maskEmail(email) : maskEmail("placeholder@gmail.com")}</Text>
                            </Text>
                        </View>

                        <TextInput
                            className={`font-montserrat-bold w-full h-14 text-xl text-center font-semibold rounded-full dark:bg-gray-700 dark:text-white ${isError ? "mb-4" : "mb-8"}`}
                            keyboardType="numeric"
                            onChangeText={onChangeQuery}
                            maxLength={6}
                            selectTextOnFocus
                            textContentType="oneTimeCode"
                        />

                        <TouchableOpacity
                            className={`w-full py-4 rounded-lg mb-4 ${
                                loading || code.length !== 6
                                ? 'bg-gray-300 dark:bg-gray-700'
                                : 'bg-primary dark:bg-primary'
                            }`}
                            onPress={() => {confirmMutate()}}
                            disabled={loading || code.length !== 6}
                        >
                            <Text className={`font-montserrat-semibold text-center font-semibold text-lg ${
                                loading || code.length !== 6
                                ? 'text-gray-500 dark:text-gray-400'
                                : 'text-white'
                            }`}>
                                {loading ? 'Verifying...' : 'Confirm'}
                            </Text>
                        </TouchableOpacity>

                        <View className="items-center">
                            <Text className="font-montserrat text-gray-600 dark:text-gray-300 text-sm mb-2">
                                Didn't receive a code?
                            </Text>
                            <TouchableOpacity onPress={() => {resendCode()}} disabled={loading || resendCooldown > 0}>
                                <Text className="font-montserrat-semibold text-md text-blue-600 dark:text-light-100 font-semibold">
                                {resendCooldown > 0 ? `Resent Code! (${resendCooldown})` : "Resend Code"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}