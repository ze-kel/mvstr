import { useEffect } from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Link,
  Redirect,
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  useRootNavigationState,
  useRouter,
} from "expo-router";
import { TRPCClientError } from "@trpc/client";

import { api } from "~/utils/api";
import { clearAuthTOken, getAuthToken } from "~/utils/auth";

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const token = getAuthToken();

  const { data, error } = api.events.list.useQuery();

  if (rootNavigationState.key) {
    if (!token) {
      return <Redirect href={"/login/"} />;
    }

    if (error instanceof TRPCClientError && error.message === "UNAUTHORIZED") {
      clearAuthTOken();
      return <Redirect href={"/login/"} />;
    }
  }

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="bg-background h-full w-full p-4">
        <Text className="text-foreground pb-2 text-center text-5xl font-bold">
          Main page with data {token}
        </Text>

        <Link href={"/login/"}>авторизация</Link>

        {data?.map((v) => {
          return (
            <Text className="text-foreground pb-2 text-center text-5xl font-bold">
              {v.id}
            </Text>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
