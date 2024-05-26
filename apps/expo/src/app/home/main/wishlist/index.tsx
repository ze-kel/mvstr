import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Link, useGlobalSearchParams } from "expo-router";
import BlankImage from "@assets/defImages/blankitem.png";
import { setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";

import type { IWish } from "@acme/api";

import { EmptyList, PageHeader } from "~/app/_components/layoutElements";
import Spinner from "~/app/_components/spinner";
import { api } from "~/utils/api";
import { formatPrice } from "~/utils/priceFormater";

setDefaultOptions({ locale: ru });

export const WishItem = ({ wish }: { wish: IWish }) => {
  const { eventId } = useGlobalSearchParams<{ eventId?: string }>();

  const [isWaitingForImage, setIsWaiting] = useState(false);

  return (
    <Link
      asChild
      href={{
        pathname: "/modals/wish/[wishId]?eventId=[eventId]",
        params: { eventId: eventId, wishId: wish.id },
      }}
    >
      <Pressable
        className="flex w-fit flex-col items-center  px-4"
        style={{ maxWidth: Dimensions.get("window").width / 2, flex: 0.5 }}
      >
        <View className="">
          <View className="flex w-full overflow-hidden rounded-[20px]">
            <Image
              onLoadStart={() => setIsWaiting(true)}
              onLoadEnd={() => setIsWaiting(false)}
              source={wish.image || BlankImage}
              style={{
                flex: 1,
                width: Dimensions.get("window").width / 2 - 24,
                aspectRatio: 1,
              }}
            />
          </View>

          <Text className="captionXL mt-2 w-full">{wish.title}</Text>
          <Text className="textM mt-0.5 w-full">{formatPrice(wish.price)}</Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default function Index() {
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();

  const utils = api.useUtils();
  const { data, isRefetching, error, isLoading } =
    api.wish.getAllWishes.useQuery();

  const [allowSpiiner, setAllowSpinner] = useState(false);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      <PageHeader
        title="Список желаний"
        buttonHref={{
          pathname: "/modals/wish/[wishId]?eventId=[eventId]",
          params: { eventId, wishId: "create" },
        }}
      />
      <FlatList
        data={data}
        ListEmptyComponent={
          <EmptyList
            text={"У вас пока не добавлено ни одного желания"}
            subtext="Добавьте свое первое"
            buttonText="Добавить желание"
            buttonHref={{
              pathname: "/modals/wish/[wishId]?eventId=[eventId]",
              params: { eventId, wishId: "create" },
            }}
          />
        }
        refreshControl={
          <RefreshControl
            refreshing={allowSpiiner && isRefetching}
            onRefresh={async () => {
              setAllowSpinner(true);
              await utils.wish.getAllWishes.refetch();
              setAllowSpinner(false);
            }}
          />
        }
        ListFooterComponent={() => <SafeAreaView />}
        horizontal={false}
        numColumns={2}
        columnWrapperClassName=""
        contentContainerClassName="mt-3 flex flex-col gap-4 pb-4"
        keyExtractor={(item) => item.id}
        renderItem={(v) => <WishItem wish={v.item} />}
      ></FlatList>
    </>
  );
}
