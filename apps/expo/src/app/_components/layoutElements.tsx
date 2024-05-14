import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useGlobalSearchParams } from "expo-router";
import DefaultBoy from "@assets/defaultBoy.png";
import DefaultGirl from "@assets/defaultGirl.png";
import Logo from "@assets/logo.png";
import {
  BottomSheetModalProvider,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { api } from "~/utils/api";
import { useHandleError } from "~/utils/useHandleError";

export const UserMenu = () => {
  const u = api.user.getMe.useQuery();
  useHandleError(u.error);

  if (!u.data) return <></>;

  return (
    <>
      <Pressable>
        {u.data.profileImage?.length ? (
          <Image
            source={{ uri: u.data.profileImage }}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              resizeMode: "contain",
              display: "flex",
            }}
          />
        ) : (
          <Image
            source={u.data.gender === "girl" ? DefaultGirl : DefaultBoy}
            style={{
              width: 36,
              height: 36,
              borderRadius: 12,
              resizeMode: "contain",
              display: "flex",
            }}
          />
        )}
      </Pressable>
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
    <SafeAreaView>
      <LinearGradient
        colors={["rgba(223, 203, 255, 0.4)", "rgba(223, 203, 255, 0)"]}
        style={{
          height: 300,
          width: "100%",
          position: "absolute",
          zIndex: 0,
          elevation: 0,
        }}
      />
      <View className="flex w-full py-6">
        <View className="flex flex-row items-center justify-between px-[16px]">
          {!eventId || forceTitle ? <TitleHead /> : <EventHead />}
          <View>{!hideUser && <UserMenu />}</View>
        </View>
      </View>
    </SafeAreaView>
  );
};
