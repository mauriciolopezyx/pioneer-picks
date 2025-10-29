import { Stack } from "expo-router";

export default function DiscoverLayout() {
  return (
    <Stack
        screenOptions={{
            headerShown: true,
            headerTransparent: true,
            headerTintColor: "#d50032"
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
        name="[id]"
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
        name="professors/[id]"
        options={{
            headerTitle: ""
        }}
      />
    </Stack>
  );
}
