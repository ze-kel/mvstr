/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { useMemo, useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import * as Svg from "react-native-svg";
import { Image } from "expo-image";
import { Link, useGlobalSearchParams, useRouter } from "expo-router";

import type { IGuestFull, IWish } from "@acme/api";

import { Button } from "~/app/_components/button";
import { IconPlus } from "~/app/_components/icons";
import { Input } from "~/app/_components/input";
import Spinner from "~/app/_components/spinner";
import { UserAvatar } from "~/app/_components/userAvatar";
import { transformNumber } from "~/app/login/phone";
import { api } from "~/utils/api";

const mask = "+# (###) ###-##-##";

const maskDBNumber = (s: string) => {
  let m = mask;

  if (s.length !== 11) return s;

  for (const ss of s) {
    m = m.replace("#", ss);
  }

  return m;
};

export const GuestItem = ({ guest }: { guest: IGuestFull }) => {
  const { eventId } = useGlobalSearchParams<{ eventId?: string }>();

  return (
    <View className="my-3 flex flex-row items-center justify-between px-4">
      <View className="flex flex-row items-center gap-2.5">
        <UserAvatar
          user={guest.user}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            resizeMode: "contain",
            display: "flex",
          }}
        />

        <View>
          <Text className="captionL w-full">
            {guest.user.firstName} {guest.user.lastName}
          </Text>
          <Text className="textL mt-0.5 w-full">
            {maskDBNumber(guest.user.phone || "")}
          </Text>
        </View>
      </View>

      <Button variant={"stroke"} size={"xs"}>
        Напомнить
      </Button>
    </View>
  );
};

export const GuestListHeader = () => {
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();

  return (
    <View className="my-4 flex flex-row items-center justify-between px-4">
      <View>
        <Text
          className=""
          style={{
            fontSize: 22,
            fontFamily: "NeueMachina-Ultrabold",
          }}
        >
          Гости на мероприятии
        </Text>
      </View>

      <Link
        asChild
        href={{
          pathname: "/event/[eventId]/people/add",
          params: { eventId: eventId, wishId: "create" },
        }}
      >
        <Button size="sIcon" icon className="items-center">
          <IconPlus width={18} height={18} fill={"white"} />
        </Button>
      </Link>
    </View>
  );
};

export default function Index() {
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();

  const router = useRouter();

  if (!eventId) {
    router.replace("/home");
    throw new Error("no event id");
  }

  const utils = api.useUtils();
  const { data, isFetching, error, isPending } =
    api.events.getGuests.useQuery(eventId);

  const [searchQ, setSearchQ] = useState("");

  const filtered = useMemo(() => {
    return (
      data?.filter(
        (v) =>
          v.user.firstName?.includes(searchQ) ||
          v.user.lastName?.includes(searchQ),
      ) || []
    );
  }, [data, searchQ]);

  if (isPending) {
    return <Spinner />;
  }

  return (
    <>
      <GuestListHeader />
      <View className="mx-4">
        <Input
          value={searchQ}
          onChangeText={setSearchQ}
          placeholder="Поиск"
          className="py-2"
        />
      </View>
      <FlatList
        className="pt-4"
        data={filtered}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={async () => {
              await utils.wish.getAllWishes.refetch();
            }}
          />
        }
        horizontal={false}
        keyExtractor={(item) => item.userId}
        renderItem={(v) => (
          <>
            {v.index > 0 && (
              <View
                className="mx-4"
                style={{
                  borderWidth: 0.5,
                  borderRadius: 1,
                  borderColor: "rgba(236, 236, 236, 1)",
                }}
              ></View>
            )}
            <GuestItem guest={v.item} />
          </>
        )}
      ></FlatList>
    </>
  );
}
