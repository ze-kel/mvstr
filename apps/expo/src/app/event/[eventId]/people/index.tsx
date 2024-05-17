/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { Image } from "expo-image";
import { Link, useGlobalSearchParams, useRouter } from "expo-router";

import type { IGuestFull, IWish } from "@acme/api";

import { Button } from "~/app/_components/button";
import { IconPlus } from "~/app/_components/icons";
import Spinner from "~/app/_components/spinner";
import { api } from "~/utils/api";
import { formatPrice } from "~/utils/priceFormater";

export const GuestItem = ({ guest }: { guest: IGuestFull }) => {
  const { eventId } = useGlobalSearchParams<{ eventId?: string }>();

  return (
    <View className="">
      <Text className="captionXL mt-2 w-full">{guest.userId}</Text>
      <Text className="textM mt-0.5 w-full">{guest.user.firstName}</Text>
      <Text className="textM mt-0.5 w-full">{guest.user.lastName}</Text>
      <Text className="textM mt-0.5 w-full">{guest.user.phone}</Text>
    </View>
  );
};

export const GuestListHeader = () => {
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();

  return (
    <View className="flex flex-row items-start justify-between px-4">
      <View>
        <Text
          className=""
          style={{
            fontSize: 22,
            fontFamily: "NeueMachina-Ultrabold",
          }}
        >
          Гости
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

  if (isPending) {
    return <Spinner />;
  }

  return (
    <FlatList
      className="pt-7"
      data={data}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={async () => {
            await utils.wish.getAllWishes.refetch();
          }}
        />
      }
      horizontal={false}
      ListHeaderComponent={GuestListHeader}
      keyExtractor={(item) => item.userId}
      renderItem={(v) => <GuestItem guest={v.item} />}
    ></FlatList>
  );
}
