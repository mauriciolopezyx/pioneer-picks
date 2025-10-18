import { useMutation } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useRef, useState, useCallback } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";

import { LOCALHOST } from "@/services/api";

export default function Verify() {

    const [code, setCode] = useState("")
    const onChangeQuery = useCallback((text: string) => {
        setCode(text)
    }, [])

    const router = useRouter()
    const { email, forgot }: {email: string, forgot: string} = useLocalSearchParams()
    const forgotPassword = forgot === "true"

    const verifyEndpoint = forgotPassword ? `http://${LOCALHOST}:8080/auth/forgot-password/code` : `http://${LOCALHOST}:8080/auth/verify`
    const resendEndpoint = forgotPassword ? `http://${LOCALHOST}:8080/auth/forgot-password/code/resend` : `http://${LOCALHOST}:8080/auth/resend`
    const redirectUrl = "/" //forgotPassword ? "/reset-password" : "/home"

    const [resent, setResent] = useState(false)

    const {isPending:loading, isError, error, mutate:confirmMutate} = useMutation({
        mutationFn: async () => {
            const verificationCode = code
            if (verificationCode.length !== 6) {
                throw new Error("Please enter all 6 digits")
            }
            if (!email) {
                throw new Error("Failed to send code: no email detected")
            }
            console.log("submitting verify attempt")
            const response = await fetch(verifyEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email,
                    verificationCode: verificationCode
                })
            })
            if (!response.ok) {
                const payload = await response.text()
                throw new Error(payload)
            }
            const json = await response.json()
            return json
        },
        onSuccess: (json) => {
            const suffix = "" //(json?.token && forgotPassword) ? `?token=${json.token}&email=${verificationEmail}` : ""
            router.push(redirectUrl)
        },
        onError: (e: any) => {
            console.error(e?.message ?? "Failed to verify")
        }
    })

    const {mutate:resendCode} = useMutation({
        mutationFn: async () => {
            console.log("submitting resend code")
            const response = await fetch(resendEndpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: email
                })
            })
            if (!response.ok) {
                const payload = await response.text()
                throw new Error(payload)
            }
            setResent(true)
            setTimeout( () => {
                setResent(false)
            }, 2000)
        },
        onSuccess: () => {
            console.log("successfully resent code!")
        },
        onError: (e: any) => {
            console.error(e?.message ?? "Failed to resend code")
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
                <View className="flex-1 justify-center px-6 pt-8">
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
                    
                    {isError ? (
                        <View className="mt-2 mb-6">
                            <Text className="font-montserrat-semibold text-red-500 text-sm font-semibold text-center">
                                {error?.message}
                            </Text>
                        </View>
                    ) : null}
                    {resent ? (
                        <View className="mt-2">
                            <Text className="text-green-500 text-sm font-semibold text-center">
                                Successfully resent code!
                            </Text>
                        </View>
                    ) : null}

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
                        <TouchableOpacity onPress={() => {resendCode()}} disabled={loading}>
                            <Text className="font-montserrat-semibold text-md text-blue-600 dark:text-light-100 font-semibold">
                            Resend Code
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}