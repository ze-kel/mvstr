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
          justifyContent: "center",
          backgroundColor: "white",
        },
      }}
    ></Stack>
  );
}
