import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";

import { TitleUserHeader } from "~/app/_components/layoutElements";

export default function Layout() {
  return (
    <>
      <TitleUserHeader hideUser forceTitle />
      <Stack screenOptions={{ headerShown: false }}></Stack>
    </>
  );
}
