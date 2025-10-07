import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from "@/components/QueryProvider";
import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <QueryProvider>
      <GestureHandlerRootView>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen
            name="(tabs)"
          />
          <Stack.Screen 
            name="(modals)/section/[id]" 
            options={{ presentation: "modal" }} 
          />
        </Stack>
      </GestureHandlerRootView>
    </QueryProvider>
  )
}
