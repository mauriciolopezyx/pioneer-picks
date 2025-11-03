import { Redirect } from 'expo-router'
import { View } from 'react-native';
import React from 'react'
import { useAuth } from "@/components/AuthProvider";

const index = () => {

  const { user, loading } = useAuth()

  if (loading) {
    return <View className="flex-1 dark:bg-gray-800"></View>
  }

  if (!user) {
    return <Redirect href="/login" />
  }

  return <Redirect href="/home" />
}

export default index