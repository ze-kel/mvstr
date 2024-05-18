import { Stack, useRouter } from "expo-router";

export default function Layout() {
  const router = useRouter();
  return (
    <Stack>
      <Stack.Screen
        name="main"
        options={{
          contentStyle: {
            backgroundColor: "transparent",
          },
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="create"
        listeners={{
          blur: () => {},
        }}
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
