import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from "@/components/QueryProvider";
import { AuthProvider } from '@/components/AuthProvider';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Stack } from "expo-router";
import { useFonts } from '@expo-google-fonts/montserrat';
import Toast from "react-native-toast-message"
import { RootSiblingParent } from 'react-native-root-siblings';
import { Montserrat_400Regular, Montserrat_500Medium, Montserrat_700Bold, Montserrat_800ExtraBold, Montserrat_900Black, Montserrat_600SemiBold } from '@expo-google-fonts/montserrat';
import "./global.css";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black
  });

  return (
    <RootSiblingParent>
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
                  options={{ presentation: "transparentModal" }} 
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
              <Toast />
            </GestureHandlerRootView>
          </ActionSheetProvider>
        </AuthProvider>
      </QueryProvider>
    </RootSiblingParent>
  )
}
