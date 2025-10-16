import { Stack } from "expo-router";
import CustomHeader from '@/components/CustomHeader';

export default function DiscoverLayout() {
  return (
    <Stack
        screenOptions={{
            headerShown: true,
            headerTransparent: true
        }}
    >
      <Stack.Screen
        name="all"
        options={{
            // headerTitle: () => <CustomHeader />,
            // headerStyle: {
            //     backgroundColor: "#000",
            // },
            // headerTransparent: false,
            headerTransparent: true,
            headerShown: false
        }}
      />
      <Stack.Screen
        name="[name]"
        options={{
            headerBackTitle: "Subjects",
            headerTitle: ""
        }}
      />
      <Stack.Screen
        name="courses/[id]"
        options={{
            headerTitle: ""
        }}
      />
      <Stack.Screen
        name="courses/professors/[id]"
        options={{
            headerTitle: ""
        }}
      />
    </Stack>
  );
}
