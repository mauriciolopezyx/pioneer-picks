import { Text, useColorScheme } from 'react-native'
import { useRouter } from 'expo-router';
import { useAuth } from '@/components/AuthProvider';
import { GestureWrapper } from './home';
import { Ionicons } from '@expo/vector-icons';
import MasterToast from "@/components/ToastWrapper"
import { useQueryClient, useQuery, useMutation, queryOptions } from '@tanstack/react-query'
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

import {
    SafeAreaView
} from 'react-native-safe-area-context';

const Account = () => {

  const { user } = useAuth()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const queryClient = useQueryClient()

  const {mutate:logout} = useMutation({
    mutationFn: async () => {
      console.log("Attempting to log out")
      const sessionId = await SecureStore.getItemAsync("session");
      const response = await fetch(`http://${LOCALHOST}:8080/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: `SESSION=${sessionId}`
        },
      })
      if (!response.ok) {
        const payload = await response.text()
        throw new Error(payload)
      }
    },
    onSuccess: async () => {
      await SecureStore.deleteItemAsync("session")
      queryClient.invalidateQueries({queryKey: ["authenticated-heartbeat"]})
      MasterToast.show({
        text1: "Successfully logged out!"
      })
      router.navigate({pathname: "/login"})
    },
    onError: (e: any) => {
      console.error(e?.message ?? "failed to log out")
    }
  })

  if (!user) return

  return (
    <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["left", "right"]}>

      <Text className="font-montserrat-bold text-2xl mb-2 dark:text-white mt-5">Name</Text>
      <Text className="font-montserrat mb-4 dark:text-white">{user.username}</Text>
      <Text className="font-montserrat-bold text-2xl mb-2 dark:text-white">Email</Text>
      <Text className="font-montserrat mb-4 dark:text-white">{user.email}</Text>

      <GestureWrapper className="flex flex-row justify-between items-center py-4" onPress={ () => { router.navigate({pathname: "/(auth)/reset-password"}) }} >
        <Text className="font-montserrat-medium text-xl dark:text-white">Reset Password</Text>
        <Ionicons name="chevron-forward-outline" size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
      </GestureWrapper>

      <GestureWrapper className="flex flex-row justify-between items-center py-4" onPress={ () => { logout() }} >
        <Text className="font-montserrat-medium text-xl text-primary">Log Out</Text>
        <Ionicons name="chevron-forward-outline" size={30} color="#d50032" />
      </GestureWrapper>

      <Text className="align-bottom">version 1.0</Text>

    </SafeAreaView>
  )
}

export default Account