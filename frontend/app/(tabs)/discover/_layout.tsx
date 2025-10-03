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
            headerTitle: () => <CustomHeader />,
            headerStyle: {
                backgroundColor: "#000",
            },
            headerTransparent: false
        }}
      />
      <Stack.Screen
        name="[name]"
        options={{
            headerBackTitle: "Discover",
            headerTitle: ""
        }}
      />
      <Stack.Screen
        name="course/[id]"
        options={{
            headerTitle: ""
        }}
      />
      <Stack.Screen
        name="course/section/[id]"
        options={{
            headerTitle: ""
        }}
      />
    </Stack>
  );
}
