import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { TRPCProvider } from "~/utils/api";

import "../styles.css";

import { useFonts } from "expo-font";

import "../typography.css";

import { GestureHandlerRootView } from "react-native-gesture-handler";

import Spinner from "~/app/_components/spinner";

// This is the main layout of the app
// It wraps your pages with the providers they need
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "NeueMachina-Light": require("../../assets/NeueMachina-Light.otf"),
    "NeueMachina-Regular": require("../../assets/NeueMachina-Regular.otf"),
    "NeueMachina-Ultrabold": require("../../assets/NeueMachina-Ultrabold.otf"),
    "Nunito-Regular": require("../../assets/Nunito-Regular.ttf"),
    "Nunito-Bold": require("../../assets/Nunito-Bold.ttf"),
    "Nunito-SemiBold": require("../../assets/Nunito-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return <Spinner />;
  }

  return (
    <TRPCProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: "rgba(243, 245, 247, 1)" },
          contentStyle: { backgroundColor: "rgba(243, 245, 247, 1)" },
        }}
      ></Stack>
      <StatusBar translucent={false} style="dark" />
    </TRPCProvider>
  );
}
