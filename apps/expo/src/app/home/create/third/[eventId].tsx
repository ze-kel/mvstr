import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Button } from "~/app/_components/button";
import WIndex from "~/app/event/[eventId]/people/index";
import { Steps } from "~/app/home/create";

export default function Index() {
  return (
    <>
      <Steps current={3} total={4} />
      <WIndex />
      <View className="px-4 pt-4">
        <Button>Продолжить</Button>
      </View>
      <SafeAreaView edges={["bottom"]} />
    </>
  );
}
