import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "modal",
        contentStyle: {
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          backgroundColor: "rgba(254, 254, 254, 1)",
        },
      }}
    ></Stack>
  );
}
