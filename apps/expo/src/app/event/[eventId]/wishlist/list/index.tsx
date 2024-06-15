import { useState } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Link, useGlobalSearchParams } from "expo-router";
import BlankImage from "@assets/defImages/blankitem.png";

import type { IWish } from "@acme/api";

import { Button } from "~/app/_components/button";
import { EmptyList, PageHeader } from "~/app/_components/layoutElements";
import Spinner from "~/app/_components/spinner";
import { WishItem } from "~/app/home/main/wishlist";
import { api } from "~/utils/api";
import { formatPrice } from "~/utils/priceFormater";

export const SelectWishItem = ({ wish }: { wish: IWish }) => {
  const { eventId } = useGlobalSearchParams<{ eventId?: string }>();

  const { data } = api.events.getWishes.useQuery(eventId || "");

  const utils = api.useUtils();

  const included = data?.includes(wish.id);

  const add = api.events.addWish.useMutation({
    onMutate: (d) => {
      utils.events.getWishes.setData(eventId || "", (v) => {
        const s = new Set(v);
        s.add(d.wish);
        return Array.from(s);
      });
    },
  });
  const remove = api.events.removeWish.useMutation({
    onMutate: (d) => {
      utils.events.getWishes.setData(eventId || "", (v) => {
        const s = new Set(v);
        s.delete(d.wish);
        return Array.from(s);
      });
    },
  });

  const handler = async () => {
    if (!data || !eventId) return;

    if (!included) {
      await add.mutateAsync({
        wish: wish.id,
        event: eventId,
      });
    } else {
      await remove.mutateAsync({
        wish: wish.id,
        event: eventId,
      });
    }
  };

  return (
    <Link
      push
      asChild
      href={{
        pathname: "/modals/wish/[wishId]?eventId=[eventId]",
        params: { eventId: eventId, wishId: wish.id },
      }}
    >
      <Pressable className="flex flex-row  items-center justify-between gap-4 truncate px-4 py-2">
        <View className="flex flex-1 flex-row gap-4 truncate">
          <View className="flex h-[50px] w-[50px]  overflow-hidden rounded-[10px]">
            <Image
              source={wish.image || BlankImage}
              style={{
                flex: 1,
                width: 50,
                height: 50,
                aspectRatio: 1,
              }}
            />
          </View>

          <View>
            <Text className="captionXL mt-2 w-full">{wish.title}</Text>
            <Text className="textM mt-0.5 w-full">
              {formatPrice(wish.price)}
            </Text>
          </View>
        </View>

        <Button
          className="flex-shrink-0"
          onPress={handler}
          size={"s"}
          variant={included ? "primary" : "stroke"}
        >
          {included ? "Добавлено" : "Добавить"}
        </Button>
      </Pressable>
    </Link>
  );
};

export default function Index({ noHeader }: { noHeader?: boolean }) {
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();

  const utils = api.useUtils();
  const { data, isRefetching, error, isLoading } =
    api.wish.getAllWishes.useQuery();

  const eventWishes = api.events.getWishes.useQuery(eventId || "");

  const [allowSpiiner, setAllowSpinner] = useState(false);
  if (isLoading || eventWishes.isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {!noHeader && (
        <PageHeader
          className="pt-7"
          title="Добавить в событие"
          buttonHref={{
            pathname: "/modals/wish/[wishId]?eventId=[eventId]",
            params: { eventId, wishId: "create" },
          }}
        />
      )}
      <FlatList
        data={data}
        ListEmptyComponent={
          <EmptyList
            className="mt-10 px-4"
            text={"У вас пока не добавлено ни одного желания"}
            subtext="Добавьте свое первое"
            buttonText="Добавить желание"
            buttonHref={{
              pathname: "/modals/wish/[wishId]?eventId=[eventId]",
              params: { eventId, wishId: "create" },
            }}
          />
        }
        ListFooterComponent={<SafeAreaView edges={["bottom"]} />}
        refreshControl={
          <RefreshControl
            refreshing={
              allowSpiiner && (isRefetching || eventWishes.isRefetching)
            }
            onRefresh={async () => {
              setAllowSpinner(true);
              await utils.wish.getAllWishes.refetch();
              await eventWishes.refetch();
              setAllowSpinner(false);
            }}
          />
        }
        horizontal={false}
        keyExtractor={(item) => item.id}
        renderItem={(v) => <SelectWishItem wish={v.item} />}
      ></FlatList>
    </>
  );
}
