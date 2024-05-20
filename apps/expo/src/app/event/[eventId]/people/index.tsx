import { useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGlobalSearchParams, useRouter } from "expo-router";
import PeopleEmpty from "@assets/defImages/people_empty.png";

import type { IGuestFull } from "@acme/api";

import { Button } from "~/app/_components/button";
import { Input } from "~/app/_components/input";
import { EmptyList, PageHeader } from "~/app/_components/layoutElements";
import Spinner from "~/app/_components/spinner";
import { UserAvatar } from "~/app/_components/userAvatar";
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

export const GuestItem = ({ guest }: { guest: Omit<IGuestFull, "event"> }) => {
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

export default function Index() {
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();

  const router = useRouter();

  if (!eventId) {
    router.replace("/home");
    throw new Error("no event id");
  }

  const utils = api.useUtils();
  const { data, isFetching, error, isPending, refetch } =
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
      <PageHeader
        title="Гости на мероприятии"
        buttonHref={{
          pathname: "/event/[eventId]/people/add",
          params: { eventId: eventId, wishId: "create" },
        }}
      />
      <View className="mx-4">
        <Input
          value={searchQ}
          onChangeText={setSearchQ}
          placeholder="Поиск"
          className="py-2"
        />
      </View>
      <FlatList
        className="pb-4"
        data={filtered}
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={async () => {
              await refetch();
            }}
          />
        }
        ListEmptyComponent={
          <EmptyList
            image={PeopleEmpty}
            text={
              searchQ ? "Таких гостей не приглашено" : "Вы не добавили гостей"
            }
            subtext={
              searchQ ? "Но можно пригласить" : "Пора пригласить кого-нибудь"
            }
            buttonText="Добавить гостей"
            buttonHref={{
              pathname: "/event/[eventId]/people/add",
              params: { eventId: eventId, wishId: "create" },
            }}
          />
        }
        
        horizontal={false}
        keyExtractor={(item) => item.userId}
        ListFooterComponent={() => <SafeAreaView />}
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
