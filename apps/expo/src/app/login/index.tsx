import React, { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import { Link, Redirect, Stack, useRootNavigationState } from "expo-router";
import * as WebBrowser from "expo-web-browser";

import { Button } from "~/app/_components/button";
import { TitleUserHeader } from "~/app/_components/layoutElements";
import { getAuthToken, setAuthTokenSync } from "~/utils/auth";

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

  return (
    <Button
      leftIcon={
        <Image
          source={require("@assets/vklogo.svg")}
          style={{
            width: 18,
            height: 18,
          }}
        />
      }
      className="mt-4"
      variant={"stroke"}
      onPress={() => void handlePress()}
    >
      ВКонтакте ID
    </Button>
  );
};

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const token = getAuthToken();

  const [_, setKey] = useState(1);

  if (rootNavigationState.key && token) return <Redirect href={"/home/"} />;

  return (
    <View className="flex h-full w-full ">
      <View className="mx-4 rounded-[20px] bg-surface-inverse px-5 py-7">
        <View className="headingL text-center text-[24px] leading-[28px]">
          <Text className="headingL text-center text-[24px] leading-[28px]">
            Добро пожаловать
          </Text>
          <Text className="headingL text-center text-[24px] leading-[28px]">
            в Место Встречи
          </Text>
        </View>
        <Text className="textL mt-1.5 text-center">
          Войдите в ваш аккаунт или создайте новый
        </Text>

        <Link href={"/login/phone"} asChild>
          <Button className="mt-4" variant={"stroke"}>
            По номеру телефона
          </Button>
        </Link>

        <LoginWithVk
          onToken={(v) => {
            setAuthTokenSync(v);
            setKey((v) => v + 1);
          }}
        />
      </View>
    </View>
  );
}
