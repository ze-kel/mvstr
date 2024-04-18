import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { Image } from "expo-image";
import { Link, useGlobalSearchParams } from "expo-router";
import { ru } from "date-fns/locale";

import type { IWish } from "@acme/api";

import { Button } from "~/app/_components/button";
import { IconPlus } from "~/app/_components/icons";
import Spinner from "~/app/_components/spinner";
import { api } from "~/utils/api";
import { WishlistHeader, WishItem } from "~/app/home/wishlist";


export default function Index() {
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();

  const utils = api.useUtils();
  const { data, isFetching, error, isPending } =
    api.wish.getAllWishes.useQuery();

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
      numColumns={2}
      columnWrapperClassName="justify-between"
      contentContainerClassName="mt-3 flex flex-col gap-2"
      ListHeaderComponent={WishlistHeader}
      keyExtractor={(item) => item.id}
      renderItem={(v) => <WishItem wish={v.item} />}
    ></FlatList>
  );
}
