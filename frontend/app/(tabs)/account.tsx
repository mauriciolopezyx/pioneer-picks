import { View, Text, useColorScheme } from 'react-native'
import { useRouter } from 'expo-router';

import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { useAuth } from '@/components/AuthProvider';
import { GestureWrapper } from './home';
import { Ionicons } from '@expo/vector-icons';

import {
    SafeAreaView
} from 'react-native-safe-area-context';

const Account = () => {

  const { user } = useAuth()
  const router = useRouter()
  const colorScheme = useColorScheme()

  // return (
  //   <View className="flex-1 justify-center items-center gap-4 dark:bg-white">
  //     <Text style={{textAlign: "center"}} className="font-montserrat w-3/4 text-lg mb-8" numberOfLines={2}>Sign in or register to comment and bookmark</Text>
  //     <ControlButton title="Login" onPress={() => { router.navigate({pathname: "/login"})}} />
  //     <ControlButton title="Register" onPress={() => { router.navigate({pathname: "/register"})}} />
  //     <ControlButton title="Verify" onPress={() => { router.navigate({pathname: "/verify"})}} />
  //     <ControlButton title="Search" onPress={() => { router.navigate({pathname: "/search"})}} />
  //   </View>
  // )

  if (!user) return

  return (
    <SafeAreaView className="flex-1 dark:bg-gray-800 px-5" edges={["left", "right"]}>

      <Text className="font-montserrat-extrabold text-3xl mb-2 dark:text-white">Name</Text>
      <Text className="font-montserrat mb-2 dark:text-white">{user.username}</Text>
      <Text className="font-montserrat-extrabold text-3xl mb-2 dark:text-white">Email</Text>
      <Text className="font-montserrat mb-2 dark:text-white">{user.email}</Text>

      <GestureWrapper className="flex flex-row justify-between items-center py-4" onPress={ () => { }} >
        <Text className="font-montserrat-medium text-xl dark:text-white">Reset Password</Text>
        <Ionicons name="chevron-forward-outline" size={30} color={(colorScheme && colorScheme === "dark") ? "white" : "black"} />
      </GestureWrapper>


    </SafeAreaView>
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