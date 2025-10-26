import { Stack } from "expo-router";

export default function DiscoverLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
            headerTransparent: true,
            headerShown: false
        }}
      />
      <Stack.Screen
        name="[category]"
        options={{
            headerTransparent: true,
            headerShown: false
        }}
      />
    </Stack>
  );
}
