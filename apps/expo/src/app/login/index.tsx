import React, { useState } from "react";
import { Button, SafeAreaView, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { Redirect, Stack, useRootNavigationState } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { getAuthToken, setAuthToken } from "~/utils/auth";

const LoginWithVk = ({ onToken }: { onToken: (v: string) => void }) => {
  const handlePress = async () => {
    try {
      const fullUrl =
        "https://mvstr.vercel.app" +
        `/login/vk?customRedirect=${Linking.createURL("/?")}`;

      const result = await WebBrowser.openAuthSessionAsync(fullUrl);
      let redirectData;
      if (result.url) {
        redirectData = Linking.parse(result.url);
      }

      console.log("redirData", redirectData);
      console.log("url", result.url);
      onToken(result.url);
    } catch (error) {
      console.log(error);
    }
  };

  return <Button title={"Войти через VK"} onPress={() => void handlePress()} />;
};

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const token = getAuthToken();

  if (rootNavigationState && token) return <Redirect href={"/"} />;

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="bg-background h-full w-full p-4">
        <Text className="text-foreground pb-2 text-center text-5xl font-bold">
          Please login
        </Text>
        <Text>token {token}</Text>
        <LoginWithVk
          onToken={(v) => {
            console.log(v);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
