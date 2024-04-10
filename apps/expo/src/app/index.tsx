import { useEffect } from "react";
import { Button, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Link,
  Stack,
  useGlobalSearchParams,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { TRPCClientError } from "@trpc/client";

import { api } from "~/utils/api";

export default function Index() {
  const { data, error } = api.events.list.useQuery();

  const params = useLocalSearchParams<{ authToken: string }>();
  const p2 = useGlobalSearchParams();

  const router = useRouter();
  useEffect(() => {
    if (error instanceof TRPCClientError && error.message === "UNAUTHORIZED") {
      //router.replace("/login/");
    }
  }, [error]);

  return (
    <SafeAreaView className="bg-background">
      {/* Changes page title visible on the header */}
      <Stack.Screen options={{ title: "Home Page" }} />
      <View className="bg-background h-full w-full p-4">
        <Text className="text-foreground pb-2 text-center text-5xl font-bold">
          Main page with data
        </Text>

        <Link href={"/login/"}>авторизация</Link>
        <Link href={"/login2/"}>авторизация2</Link>

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
