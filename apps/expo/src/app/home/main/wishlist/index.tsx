import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { Image } from "expo-image";
import { Link, useGlobalSearchParams } from "expo-router";
import { setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";

import type { IWish } from "@acme/api";

import { Button } from "~/app/_components/button";
import { IconPlus } from "~/app/_components/icons";
import Spinner from "~/app/_components/spinner";
import { api } from "~/utils/api";
import { formatPrice } from "~/utils/priceFormater";

setDefaultOptions({ locale: ru });

export const WishItem = ({ wish }: { wish: IWish }) => {
  const { eventId } = useGlobalSearchParams<{ eventId?: string }>();

  return (
    <Link
      asChild
      className="px-4"
      href={
        eventId
          ? {
              pathname: "/event/[eventId]/wishlist/modal/[wishId]",
              params: { eventId: eventId, wishId: wish.id },
            }
          : {
              pathname: "/home/main/wishlist/modal/[wishId]",
              params: { wishId: wish.id },
            }
      }
    >
      <Pressable
        className="flex w-fit flex-col items-center"
        style={{ width: "48%" }}
      >
        <View className="">
          <View className="flex w-full overflow-hidden rounded-[20px]">
            {wish.image && (
              <Image
                source={{
                  uri: wish.image,
                }}
                style={{
                  flex: 1,
                  minWidth: 100,
                  minHeight: 100,
                  aspectRatio: 1,
                }}
              />
            )}
          </View>

          <Text className="captionXL mt-2 w-full">{wish.title}</Text>
          <Text className="textM mt-0.5 w-full">{formatPrice(wish.price)}</Text>
        </View>
      </Pressable>
    </Link>
  );
};

export const WishlistHeader = () => {
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
          Список желаний
        </Text>
      </View>

      <Link
        asChild
        href={
          eventId
            ? {
                pathname: "/event/[eventId]/wishlist/modal/[wishId]",
                params: { eventId: eventId, wishId: "create" },
              }
            : {
                pathname: "/home/main/wishlist/modal/[wishId]",

                params: { wishId: "create" },
              }
        }
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
