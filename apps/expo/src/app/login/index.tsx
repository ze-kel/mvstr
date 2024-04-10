import React, { useState } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { Stack } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { getBaseUrl } from "~/utils/api";

const fullUrl = getBaseUrl() + `/login/vk?return=true`;

const LoginWithVk = ({ onToken }: { onToken: (v: string) => void }) => {
  const handlePress = async () => {
    try {
      const fullUrl =
        getBaseUrl() + `/login/vk?return=${Linking.createURL("/?")}`;

      const result = await WebBrowser.openAuthSessionAsync(fullUrl);
      let redirectData;
      if (result.url) {
        redirectData = Linking.parse(result.url);
      }

      onToken(result.url);
    } catch (error) {
      console.log(error);
    }
  };

  return <Button title={"Войти через VK"} onPress={() => void handlePress()} />;
};

export default function Index() {
  const [token, setToken] = useState("");

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="bg-background h-full w-full p-4">
        <Text className="text-foreground pb-2 text-center text-5xl font-bold">
          Please login
        </Text>
        <Text>token {token}</Text>
        <LoginWithVk onToken={setToken} />
      </View>
    </SafeAreaView>
  );
}
