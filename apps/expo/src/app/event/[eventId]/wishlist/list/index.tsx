import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { Link, useGlobalSearchParams } from "expo-router";

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
      href={
        eventId
          ? {
              pathname: "/event/[eventId]/wishlist/item/[wishId]",
              params: { eventId: eventId, wishId: wish.id },
            }
          : {
              pathname: "/home/main/wishlist/item/[wishId]",
              params: { wishId: wish.id },
            }
      }
    >
      <Pressable className="flex w-fit flex-row items-center  justify-between px-4 py-2">
        <View className="flex flex-row gap-4">
          <View className="flex h-[50px] w-[50px]  overflow-hidden rounded-[10px]">
            {wish.image && (
              <Image
                source={{
                  uri: wish.image,
                }}
                style={{
                  flex: 1,
                  width: 50,
                  height: 50,
                  aspectRatio: 1,
                }}
              />
            )}
          </View>

          <View>
            <Text className="captionXL mt-2 w-full">{wish.title}</Text>
            <Text className="textM mt-0.5 w-full">
              {formatPrice(wish.price)}
            </Text>
          </View>
        </View>

        <Button
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
  const { data, isFetching, error, isPending } =
    api.wish.getAllWishes.useQuery();

  const eventWishes = api.events.getWishes.useQuery(eventId || "");

  if (isPending || eventWishes.isPending) {
    return <Spinner />;
  }

  return (
    <>
      {!noHeader && (
        <PageHeader
          className="pt-7"
          title="Добавить в событие"
          buttonHref={{
            pathname: "/event/[eventId]/wishlist/item/[wishId]",
            params: { eventId, wishId: "create" },
          }}
        />
      )}
      <FlatList
        data={data}
        ListEmptyComponent={
          <EmptyList
            className="mt-10"
            text={"У вас пока не добавлено ни одного желания"}
            subtext="Добавьте свое первое"
            buttonText="Добавить желание"
            buttonHref={{
              pathname: "event/[eventId]/wishlist/item/create",
              params: { eventId },
            }}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={async () => {
              await utils.wish.getAllWishes.refetch();
              await eventWishes.refetch();
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
