import { View, Text, Button, Pressable } from 'react-native'
import { useState, useEffect } from "react"
import { useRouter } from 'expo-router';

import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const Account = () => {

  const router = useRouter()
  const [authenticated, setAuthenticated] = useState<boolean>(false)

  const {mutate:heartbeat} = useMutation({
    mutationFn: async () => {
      const sessionId = await SecureStore.getItemAsync("session");
      if (!sessionId) throw Error("Session id does not exist")
      const response = await fetch(`http://${LOCALHOST}:8080/user/ok`, {
          method: "GET",
          ...(sessionId ? { Cookie: `SESSION=${sessionId}` } : {}),
      })
      if (!response.ok) {
          const payload = await response.text()
          throw new Error(payload)
      }
      console.log("successfully sent ok request!")
    },
    onSuccess: () => {
      setAuthenticated(true)
    },
    onError: (e: any) => {
      setAuthenticated(false)
    }
  })

  useEffect(() => {
    heartbeat()
  }, [])

  return (
    <View className="flex-1 justify-center items-center gap-4">
      {authenticated ? (
        <>
        </>
      ) : (
        <>
          <Text style={{textAlign: "center"}} className="font-montserrat w-3/4 text-lg mb-8" numberOfLines={2}>Sign in or register to comment and bookmark</Text>
          <ControlButton title="Login" onPress={() => { router.navigate({pathname: "/login"})}} />
          <ControlButton title="Register" onPress={() => { router.navigate({pathname: "/register"})}} />
          <ControlButton title="Verify" onPress={() => { router.navigate({pathname: "/verify"})}} />
            <ControlButton title="Search" onPress={() => { router.navigate({pathname: "/search"})}} />
        </>
      )}
    </View>
  )
}

const ControlButton = ({title, onPress}: {title: string, onPress: () => void}) => {
    const scale = useSharedValue(1);
    const opacity = useSharedValue(1);

    const handleSubmit = () => {
        onPress()
    };

    const tap = Gesture.Tap()
        .onBegin(() => {
            scale.value = withTiming(0.97, { duration: 80 });
            opacity.value = withTiming(0.7, { duration: 80 });
        })
        .onFinalize(() => {
            scale.value = withTiming(1, { duration: 150 });
            opacity.value = withTiming(1, { duration: 150 });
        })
        .onEnd(() => {
            scheduleOnRN(handleSubmit);
        });
    
    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
        opacity: opacity.value,
    }));
    
    return (
        <GestureDetector gesture={tap}>
          <Animated.View
            className="w-72 py-3 px-4 flex items-center justify-center rounded-full bg-[#767576]"
            style={animatedStyle}
          >
            <Text className="text-white text-xl font-montserrat-bold">{title}</Text>
          </Animated.View>
        </GestureDetector>
    )
}

export default Account