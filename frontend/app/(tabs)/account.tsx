import { View, Text, Button, Pressable } from 'react-native'
import { useState, useEffect } from "react"

import { useMutation } from "@tanstack/react-query";
import * as SecureStore from "expo-secure-store";
import { LOCALHOST } from "@/services/api";

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const Account = () => {

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
    },
    onSuccess: () => {
      console.log("successfully sent ok request")
      setAuthenticated(true)
    },
    onError: (e: any) => {
      setAuthenticated(false)
    }
  })

  useEffect(() => {
    heartbeat()
  }, [])

  const scale1 = useSharedValue(1);
  const opacity1 = useSharedValue(1);
  const scale2 = useSharedValue(1);
  const opacity2 = useSharedValue(1);

  const tap1 = Gesture.Tap()
    .onBegin(() => {
      scale1.value = withTiming(0.97, { duration: 80 });
      opacity1.value = withTiming(0.7, { duration: 80 });
    })
    .onFinalize(() => {
      scale1.value = withTiming(1, { duration: 150 });
      opacity1.value = withTiming(1, { duration: 150 });
    })
    .onEnd(() => {
      console.log("Button pressed 1!");
    });

  const tap2 = Gesture.Tap()
    .onBegin(() => {
      scale2.value = withTiming(0.97, { duration: 80 });
      opacity2.value = withTiming(0.7, { duration: 80 });
    })
    .onFinalize(() => {
      scale2.value = withTiming(1, { duration: 150 });
      opacity2.value = withTiming(1, { duration: 150 });
    })
    .onEnd(() => {
      console.log("Button pressed 2!");
    });

  const animatedStyle1 = useAnimatedStyle(() => ({
    transform: [{ scale: scale1.value }],
    opacity: opacity1.value,
  }));
  const animatedStyle2 = useAnimatedStyle(() => ({
    transform: [{ scale: scale2.value }],
    opacity: opacity2.value,
  }));

  return (
    <View className="flex-1 justify-center items-center gap-4">
      {authenticated ? (
        <>
        </>
      ) : (
        <>
          <Text className="text-lg  mb-8">Sign in or register to unlock all features</Text>
          <GestureDetector gesture={tap1}>
            <Animated.View
              className="w-72 py-3 px-4 flex items-center justify-center rounded-full bg-[#767576]"
              style={animatedStyle1}
            >
              <Text className="text-white text-xl font-bold">Login</Text>
            </Animated.View>
          </GestureDetector>

          <GestureDetector gesture={tap2}>
            <Animated.View
              className="w-72 py-3 px-4 flex items-center justify-center rounded-full bg-[#767576]"
              style={animatedStyle2}
            >
              <Text className="text-white text-xl font-bold">Register</Text>
            </Animated.View>
          </GestureDetector>
        </>
      )}
    </View>
  )
}

export default Account