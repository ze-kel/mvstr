import { Text, View } from "react-native";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="modal"
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
