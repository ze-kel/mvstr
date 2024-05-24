import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Link, useGlobalSearchParams } from "expo-router";

import { Button } from "~/app/_components/button";
import WIndex from "~/app/event/[eventId]/wishlist/list/index";
import { Steps } from "~/app/home/create";

export default function Index() {
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();

  return (
    <>
      <Steps current={2} total={3} />
      <WIndex />
      <View className="px-4 pt-4">
        <Link
          asChild
          replace
          href={{
            pathname: "/home/create/third/[eventId]/",
            params: { eventId },
          }}
        >
          <Button>Продолжить</Button>
        </Link>
      </View>
      <SafeAreaView edges={["bottom"]} />
    </>
  );
}
