import { useCallback, useMemo, useRef } from "react";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useGlobalSearchParams } from "expo-router";
import Logo from "@assets/logo.png";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import { Button } from "~/app/_components/button";
import { UserAvatar } from "~/app/_components/userAvatar";
import { api } from "~/utils/api";
import { clearAuthToken } from "~/utils/auth";
import { useHandleError } from "~/utils/useHandleError";

export const UserMenu = () => {
  const u = api.user.getMe.useQuery();
  useHandleError(u.error);

  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ["25%"], []);
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);
  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  if (!u.data) return <></>;

  const logout = async () => {
    await clearAuthToken();
    u.refetch();
  };

  return (
    <>
      <Pressable onPress={handlePresentModalPress}>
        <UserAvatar
          user={u.data}
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            resizeMode: "contain",
            display: "flex",
          }}
        />
      </Pressable>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        style={{
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,

          elevation: 10,
        }}
      >
        <BottomSheetView className=" flex  items-center px-4">
          <Text className="subHeadingL">
            {u.data.firstName} {u.data.lastName}
          </Text>
          <Text className="textXL">{u.data.phone}</Text>
          <Button onPress={logout} className="mt-4 w-full" variant={"stroke"}>
            Выйти
          </Button>
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

const EventHead = () => {
  const { eventId, taskId } = useGlobalSearchParams<{
    eventId: string;
    taskId: string;
  }>();
  const event = api.events.get.useQuery(eventId);

  return (
    <View className="flex flex-row items-center gap-2 ">
      <Text
        className="text-xl font-bold"
        style={{ fontFamily: "NeueMachina-Ultrabold" }}
      >
        {event.data?.name}
      </Text>
    </View>
  );
};

const TitleHead = () => {
  return (
    <View className="flex flex-row items-center gap-2">
      <Image
        source={Logo}
        style={{
          width: 36,
          height: 36,
          resizeMode: "contain",
          display: "flex",
        }}
      />
      <Text
        className="text-xl font-bold"
        style={{ fontFamily: "NeueMachina-Ultrabold" }}
      >
        Место Встречи
      </Text>
    </View>
  );
};

export const TitleUserHeader = ({
  forceTitle,
  hideUser,
}: {
  hideUser?: boolean;
  forceTitle?: boolean;
}) => {
  const { eventId } = useGlobalSearchParams<{
    eventId?: string;
  }>();

  return (
    <SafeAreaView className="bg-surface-secondary">
      <View className="flex w-full py-6">
        <View className="flex flex-row items-center justify-between px-[16px]">
          {!eventId || forceTitle ? <TitleHead /> : <EventHead />}
          <View>{!hideUser && <UserMenu />}</View>
        </View>
      </View>
    </SafeAreaView>
  );
};
