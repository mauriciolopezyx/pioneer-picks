import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from "@/components/QueryProvider";
import { AuthProvider, useAuth } from '@/components/AuthProvider';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Stack } from "expo-router";
import { useFonts } from '@expo-google-fonts/montserrat';
import { ToastInstance } from '@/components/ToastWrapper';
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react"
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import "./global.css";

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black
  });

  const { loading } = useAuth()

  useEffect(() => {
    if (fontsLoaded && !loading) {
      SplashScreen.hideAsync() // only hide when fully initialized
    }
  }, [fontsLoaded, loading])

  if (!fontsLoaded || loading) {
    return null // don't render anything, splash stays on screen
  }

  return (
    <QueryProvider>
      <AuthProvider>
        <ActionSheetProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen
                name="(tabs)"
              />
              <Stack.Screen 
                name="(modals)/professors/comments/[id]" 
                options={{ presentation: "modal" }} 
              />
              <Stack.Screen 
                name="(modals)/professors/reviews/[id]" 
                options={{ presentation: "modal" }} 
              />
              <Stack.Screen
                name="(modals)/areas"
                options={{ presentation: "modal" }}
              />
              <Stack.Screen
                name="search"
                options={{
                  presentation: "card",
                  animation: "fade_from_bottom"
                }}
              />
            </Stack>
            <ToastInstance />
          </GestureHandlerRootView>
        </ActionSheetProvider>
      </AuthProvider>
    </QueryProvider>
  )
}
