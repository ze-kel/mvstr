import type { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useCallback, useMemo, useRef, useState } from "react";
import { Image, Modal, Pressable, Text, View } from "react-native";
import { Link } from "expo-router";
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
      <Link href={"/usermenu/"}>
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
      </Link>
    </>
  );
};

export const TitleUserHeader = ({ hideUser }: { hideUser?: boolean }) => {
  return (
    <View className="flex flex-row items-center justify-between px-[16px]">
      <View className="flex flex-row items-center gap-2">
        <Image
          source={Logo}
          style={{ width: 36, resizeMode: "contain", display: "flex" }}
        />
        <Text
          className="text-xl font-bold"
          style={{ fontFamily: "NeueMachina-Ultrabold" }}
        >
          Место Встречи
        </Text>
      </View>

      <View>{!hideUser && <UserMenu />}</View>
    </View>
  );
};
