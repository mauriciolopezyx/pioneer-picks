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

import api from "@/services/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { Controller, useForm } from "react-hook-form";
import * as SecureStore from "expo-secure-store";
import { z } from "zod";
import { useAuth } from "@/components/AuthProvider";
import MasterToast from "@/components/ToastWrapper"

const formSchema = z.object({
    password: z.string().min(5, {
        message: "Password must be at least 5 characters"
    })
})

export default function DeleteAccount() {
  
  const router = useRouter()
  const { refetch:refetchAuth } = useAuth()
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient()
  
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
      password: ""
    },
    mode: "onChange"
  })

  const {isPending:loading, mutate} = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      console.log("submitting delete account attempt")
      const response = await api.delete('/user/me', {data: data})
      return true
    },
    onSuccess: async () => {
      console.log("on delete account success")
      await SecureStore.deleteItemAsync("sessionId")
      delete api.defaults.headers.common['Cookie']
      queryClient.invalidateQueries({queryKey: ["authenticated-heartbeat"]})
      MasterToast.show({
        text1: "Successfully deleted account, thank you for using Pioneer Picks"
      })
      router.dismissTo({pathname: "/login"})
    },
    onError: (e: any) => {
      MasterToast.show({
        text1: "Error deleting account",
        text2: e?.message ?? "Failed to delete account"
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
        className="flex-1"
      >
          <View className="flex-1 justify-center items-center px-6">
            <View className="w-full max-w-[500px]">
              <View className="mb-6">
                <Text className="font-montserrat-bold text-4xl mx-auto text-gray-900 dark:text-white mb-2">
                  Delete Account
                </Text>
                <Text className="font-montserrat text-md mx-auto text-gray-900 dark:text-white mb-2" style={{textAlign: "center"}}>
                    WARNING: By entering your password and pressing "Delete", you are deleting your account. This is irreversible!
                </Text>
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
                testID="delete-account-button"
              >
                <Text className="font-montserrat-semibold text-white text-center text-lg">
                  {loading ? "Deleting..." : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}