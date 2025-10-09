import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from "@/components/QueryProvider";
import { Stack } from "expo-router";
import { useFonts } from '@expo-google-fonts/montserrat';
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
    <QueryProvider>
      <GestureHandlerRootView>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="(tabs)"
          />
          <Stack.Screen 
            name="(modals)/professors/[commentsId]" 
            options={{ presentation: "modal" }} 
          />
        </Stack>
      </GestureHandlerRootView>
    </QueryProvider>
  )
}
