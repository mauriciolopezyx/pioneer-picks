import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryProvider } from "@/components/QueryProvider";
import { AuthProvider } from '@/components/AuthProvider';
import { ActionSheetProvider } from '@expo/react-native-action-sheet';
import { Stack } from "expo-router";
import { ToastInstance } from '@/components/ToastWrapper';
import "./global.css";

export default function RootLayout() {
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
                name="(modals)/courses/create"
                options={{ presentation: "modal" }}
              />
              <Stack.Screen
                name="(modals)/professors/create"
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
