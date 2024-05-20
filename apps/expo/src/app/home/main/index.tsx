import type { SvgProps } from "react-native-svg";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";
import { Image } from "expo-image";
import { Link, Redirect, useRootNavigationState } from "expo-router";
import EventsEmpty from "@assets/defImages/events_empty.png";
import { format, isToday, setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";

import type { IEvent, IUser } from "@acme/api";

import { EventAvatar } from "~/app/_components/eventAvatar";
import { EmptyList, PageHeader } from "~/app/_components/layoutElements";
import Spinner from "~/app/_components/spinner";
import { UserAvatar } from "~/app/_components/userAvatar";
import { api } from "~/utils/api";
import { getAuthToken } from "~/utils/auth";

setDefaultOptions({ locale: ru });

const IconCalendar = (props: SvgProps) => (
  <Svg width={12} height={12} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path d="M0 4v-.5C0 2.122 1.121 1 2.5 1H3V.5a.5.5 0 1 1 1 0V1h4V.5a.5.5 0 1 1 1 0V1h.5C10.879 1 12 2.122 12 3.5V4H0Zm12 1v4.5c0 1.379-1.121 2.5-2.5 2.5h-7A2.503 2.503 0 0 1 0 9.5V5h12ZM6 9.5a.5.5 0 0 0-.5-.5H3a.5.5 0 1 0 0 1h2.5a.5.5 0 0 0 .5-.5Zm3.5-2A.5.5 0 0 0 9 7H3a.5.5 0 1 0 0 1h6a.5.5 0 0 0 .5-.5Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path d="M0 0h12v12H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

const MicroGuests = ({ guests }: { guests: IEvent["guests"] }) => {
  if (!guests.length) return null;

  const firstThree = guests.slice(0, 3);

  return (
    <View className="flex flex-row">
      {firstThree.map((v) => (
        <View key={v.userId} className="w-[14px]">
          <UserAvatar
            user={v.user}
            style={{
              width: 24,
              height: 24,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "rgba(254, 254, 254, 1)",
              resizeMode: "contain",
              display: "flex",
            }}
          />
        </View>
      ))}
      {guests.length > 3 && (
        <View className="flex w-[24px] items-center justify-center rounded-lg bg-surface-inverse">
          <Text
            style={{ fontSize: 10, lineHeight: 14, fontFamily: "Nunito-Bold" }}
          >
            +{guests.length - 3}
          </Text>
        </View>
      )}
    </View>
  );
};

const EventItem = ({ event }: { event: IEvent }) => {
  const today = event.date && isToday(event.date);

  return (
    <Link
      href={{
        // pathname: "home/create/third/[eventId]",
        pathname: "/event/[eventId]/",
        params: { eventId: event.id },
      }}
      asChild
    >
      <Pressable>
        <View className="px-3">
          <View className="mt-2 flex  flex-row  items-center justify-between rounded-[20px] bg-surface-secondary  p-3">
            <View className="flex flex-row items-center gap-2 ">
              <View className="">
                <EventAvatar
                  image={event.image || ""}
                  style={{ width: 44, height: 44, borderRadius: 12 }}
                />
              </View>
              <View className="flex flex-col gap-1.5">
                <Text className="subHeadingL">{event.name}</Text>
                <View className="flex flex-row items-center gap-1">
                  <IconCalendar
                    fill={
                      today ? "rgba(33, 186, 114, 1)" : "rgba(86, 58, 220, 1)"
                    }
                  />
                  <Text
                    style={{
                      fontFamily: "Nunito-Bold",
                      fontSize: 10,
                      lineHeight: 14,
                      color: today
                        ? "rgba(33, 186, 114, 1)"
                        : "rgba(86, 58, 220, 1)",
                    }}
                  >
                    {event.date ? format(event.date, "d MMMM") : "Без даты"}
                  </Text>
                </View>
              </View>
            </View>
            <MicroGuests guests={event.guests} />
          </View>
        </View>
      </Pressable>
    </Link>
  );
};

const MainHeader = ({ user }: { user?: IUser }) => {
  return (
    <>
      <View className=" px-4">
        <Text className="headingLAccent mt-5">
          Привет, {user?.firstName} 👋🏻
        </Text>
        <View className="mb-5 mt-3"></View>
      </View>
    </>
  );
};

const EventsList = () => {
  const { data, isFetching, isPending, error } = api.events.list.useQuery();

  const utils = api.useUtils();

  if (isPending) {
    return <Spinner />;
  }

  return (
    <>
      <PageHeader title="Мои мероприятия" />
      <FlatList
        ListEmptyComponent={
          <EmptyList
            image={EventsEmpty}
            text="Время сделать первый шаг"
            subtext={
              <>
                У вас нет мероприятий,{"\n"}самое время создать новое
                мероприятие
              </>
            }
            buttonText="Создать мероприятие"
            buttonHref={{ pathname: "/home/create" }}
          />
        }
        data={data}
        ListFooterComponent={
          <View>
            <View className="h-6"></View>
            <SafeAreaView />
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isPending}
            onRefresh={async () => {
              await utils.events.list.refetch();
            }}
          />
        }
        keyExtractor={(item) => item.id}
        renderItem={(v) => <EventItem event={v.item} />}
      ></FlatList>
    </>
  );
};

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const token = getAuthToken();

  const u = api.user.getMe.useQuery();

  if (rootNavigationState.key) {
    if (!token) {
      return <Redirect href={"/login/"} />;
    }
  }

  return <EventsList />;
}
