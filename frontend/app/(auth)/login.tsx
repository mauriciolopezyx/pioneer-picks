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
import { Ionicons } from "@expo/vector-icons";

import { LOCALHOST } from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/components/AuthProvider";
import MasterToast from "@/components/ToastWrapper"

const formSchema = z.object({
    email: z.string().min(22, {
        message: "Email is required"
    }),
    password: z.string().min(5, {
        message: "Password must be at least 5 characters"
    }),
})

export default function Login() {
  
  const router = useRouter()
  const { refetch:refetchAuth } = useAuth()
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState({email: false, password: false})
  
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
      password: ""
    },
    mode: "onChange"
  })

  const {isPending:loading, isError, error, mutate:login} = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      console.log("submitting login attempt")

      const response = await fetch(`http://${LOCALHOST}:8080/auth/login`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json"
          },
          credentials: "include",
          body: JSON.stringify(data)
      })
      if (!response.ok) {
          const payload = await response.text()
          throw new Error(payload)
      }

      const json = await response.json()

      if (json.sessionId) {
        console.log("Saving session:", json.sessionId)
        await SecureStore.setItemAsync("session", json.sessionId)
      }

      console.log("login json response:")
      console.log(json)
    },
    onSuccess: async () => {
      await refetchAuth()
      router.replace({pathname: "/"})
      reset()
    },
    onError: (e: any) => {
      //console.error("Login error:", e.message)
      console.log("yoohoo:", e.message)
      MasterToast.show({
        text1: "Error logging in",
        text2: JSON.parse(e.message)?.message ?? "Failed to login"
      })
    }
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
      login(values)
  }

  return (
    <SafeAreaView className="flex-1 dark:bg-gray-800">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 justify-center px-6 py-12">

            <View className="mb-12">
              <Text className="font-montserrat-bold text-4xl mx-auto text-gray-900 dark:text-white mb-2">
                Login
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
                    onFocus={() => setFocused(prev => ({ ...prev, email: true }))}
                    onBlur={() => {
                      setFocused(prev => ({ ...prev, email: false }));
                      onBlur();
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
                      onFocus={() => setFocused(prev => ({ ...prev, password: true }))}
                      onBlur={() => {
                        setFocused(prev => ({ ...prev, password: false }));
                        onBlur();
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

            <TouchableOpacity className="mb-6" onPress={() => { router.navigate({pathname: "/(auth)/forgot-password"}) }} >
              <Text className="font-montserrat-semibold text-md text-blue-600 dark:text-light-100 text-right">
                Forgot password?
              </Text>
            </TouchableOpacity>

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
              testID="login-button"
            >
              <Text className="font-montserrat-semibold text-white text-center text-lg">
                {loading ? "Logging in..." : "Login"}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center">
                <Text className="font-montserrat text-gray-600 dark:text-gray-400 text-sm">
                Don&apos;t have an account?{" "}
                </Text>
                <Link replace href="/register" className="font-montserrat-semibold text-blue-600 dark:text-light-100 text-md">Register</Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}