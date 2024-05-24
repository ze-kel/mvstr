import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
          contentStyle: {
            backgroundColor: "transparent",
          },
        }}
      />
      <Stack.Screen
        name="list"
        options={{
          headerShown: false,
          presentation: "modal",
          contentStyle: {
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 0,
            flex: 1,
            margin: 0,
            justifyContent: "center",
            backgroundColor: "transparent",
          },
        }}
      />
    </Stack>
  );
}
