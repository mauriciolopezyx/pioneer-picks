import { Redirect } from 'expo-router'
import React from 'react'
import { useAuth } from "@/components/AuthProvider";

const index = () => {

  const { user } = useAuth()

  if (!user) {
    return <Redirect href="/login" />
  }

  return <Redirect href="/home" />
}

export default index