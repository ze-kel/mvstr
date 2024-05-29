import { useState } from "react";
import { FlatList, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalSearchParams } from "expo-router";

import { EmptyList, PageHeader } from "~/app/_components/layoutElements";
import Spinner from "~/app/_components/spinner";
import { WishItem } from "~/app/home/main/wishlist";
import { api } from "~/utils/api";

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

  const inEvent = data?.filter((v) => {
    if (!eventWishes.data) return false;

    return eventWishes.data.includes(v.id);
  });

  return (
    <>
      {!noHeader && (
        <PageHeader
          title="Вишлист для события"
          buttonHref={{
            pathname: "/event/[eventId]/wishlist/list",
            params: { eventId },
          }}
        />
      )}
      <FlatList
        data={inEvent}
        ListEmptyComponent={
          <EmptyList
            text={"Для этого мероприятия пока не добавлено желаний"}
            buttonText="Добавить желание"
            buttonHref={{
              pathname: "/modals/wish/[wishId]?eventId=[eventId]",
              params: { eventId, wishId: "create" },
            }}
          />
        }
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
        numColumns={2}
        ListFooterComponent={() => <SafeAreaView />}
        columnWrapperClassName="justify-between"
        contentContainerClassName="mt-3 flex flex-col gap-2 pb-4"
        keyExtractor={(item) => item.id}
        renderItem={(v) => <WishItem wish={v.item} />}
      ></FlatList>
    </>
  );
}
