import React, { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import * as Linking from "expo-linking";
import { Redirect, Stack, useRootNavigationState } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { Button } from "~/app/_components/button";
import { Input } from "~/app/_components/input";
import { getAuthToken, setAuthToken } from "~/utils/auth";

const LoginWithVk = ({ onToken }: { onToken: (v: string) => void }) => {
  const handlePress = async () => {
    try {
      const fullUrl =
        "https://mvstr.vercel.app" +
        `/login/vk?customRedirect=${Linking.createURL("/?")}`;

      const result = await WebBrowser.openAuthSessionAsync(fullUrl);

      console.log("result", result);

      if (result.type === "success") {
        const redirectData = Linking.parse(result.url);

        if (redirectData.queryParams) {
          const token = redirectData.queryParams.token;
          if (typeof token === "string") {
            onToken(token);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return <Button title={"Войти через VK"} onPress={() => void handlePress()} />;
};

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const token = getAuthToken();

  const [_, setKey] = useState(1);

  const [ttt, setTttt] = useState("");

  if (rootNavigationState.key && token) return <Redirect href={"/"} />;

  return (
    <SafeAreaView className="bg-surface-secondary">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="h-full w-full bg-surface-secondary p-4">
        <Text
          className="text-foreground pb-2 text-center text-5xl font-bold"
          style={{ fontFamily: "NeueMachina-Light" }}
        >
          Please login
        </Text>
        <Text>token {token}</Text>
        <LoginWithVk
          onToken={(v) => {
            setAuthToken(v);
            setKey((v) => v + 1);
          }}
        />
        <Input value={ttt} onChangeText={setTttt} placeholder="123" />
        <Button
          onPress={() => {
            setAuthToken(ttt);
            setKey((v) => v + 1);
          }}
        >
          Выставить токен
        </Button>
      </View>
    </SafeAreaView>
  );
}
