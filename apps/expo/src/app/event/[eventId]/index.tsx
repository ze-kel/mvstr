import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Calendar from "expo-calendar";
import * as Clipboard from "expo-clipboard";
import { Image } from "expo-image";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import InvitationPic from "@assets/invitation.png";
import { addHours, differenceInDays, format, isAfter } from "date-fns";

import type { IEventBase } from "../../../../../../packages/api/dist/router/events";
import { Button } from "~/app/_components/button";
import { IconCopy } from "~/app/_components/icons";
import Spinner from "~/app/_components/spinner";
import { api } from "~/utils/api";
import { declOfNum } from "~/utils/declOfNum";

const ReminderView = ({ event }: { event: IEventBase }) => {
  if (!event.reminder) {
    return (
      <View className="mt-2 rounded-2xl border border-buttons-hover-primary bg-[#ECECFF] px-4 py-5">
        <View className="flex items-center justify-center">
          {!event.reminder && (
            <>
              <Text className="subHeadingL">Рассылка не создана</Text>
              <Text className="textXL">
                Вы можете сделать рассылку приглашений гостям
              </Text>
              <Link
                href={{
                  pathname: "/modals/sendedit/[eventId]",
                  params: { eventId: event.id },
                }}
                asChild
              >
                <Button className="mt-2" variant={"inverse"}>
                  Отправить или запланировать
                </Button>
              </Link>
            </>
          )}
        </View>
      </View>
    );
  }

  return (
    <View className="mt-2 rounded-2xl border border-buttons-hover-primary bg-[#ECECFF] px-4 py-5">
      <View className="flex items-center justify-center"></View>

      {event.reminder && event.reminderSent && (
        <>
          <Text className="subHeadingL">Приглашения отправлены</Text>
          <Text className="textXL">
            Приглашения были отправлены{" "}
            {format(event.reminder, "dd MMMM в hh:mm")}
          </Text>
        </>
      )}

      {event.reminder &&
      !event.reminderSent &&
      isAfter(new Date(), event.reminder || new Date()) ? (
        <>
          <Text className="subHeadingL">Приглашения рассылаются</Text>
          <Text className="textXL">
            Приглашения готовятся к отправке и будут отправлены в течение часа.
          </Text>
          <Button className="mt-2" variant={"inverse"}>
            Изменить дату отправки
          </Button>
        </>
      ) : (
        <>
          <Text className="subHeadingL">Рассылка запланирована</Text>
          <Text className="textXL">
            Приглашения будут отправлены{" "}
            {format(event.reminder as Date, "dd MMMM в hh:mm")}
          </Text>
          <Link
            href={{
              pathname: "/modals/sendedit/[eventId]",
              params: { eventId: event.id },
            }}
            asChild
          >
            <Button className="mt-2" variant={"inverse"}>
              Изменить или отправить сейчас
            </Button>
          </Link>
        </>
      )}
    </View>
  );
};

const AddToCalendar = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const { data, isLoading } = api.events.get.useQuery(eventId || "");

  const [sucess, setSucess] = useState(false);

  const [list, setList] = useState<Calendar.Calendar[]>([]);

  const buttonToGet = async () => {
    if (list.length) {
      setList([]);
      return;
    }

    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      const calendars = await Calendar.getCalendarsAsync(
        Calendar.EntityTypes.EVENT,
      );

      setList(calendars);
    }
  };

  const addToId = async (id: string) => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status === "granted") {
      await Calendar.createEventAsync(id, {
        title: data?.name,
        startDate: data?.date,
        endDate: data?.date ? addHours(data.date, 3) : undefined,

        location: data?.place || "",
        notes: data?.description || "",
      });

      setList([]);
      setSucess(true);
    }
  };

  return (
    <>
      <Button size={"s"} variant={"inverse"} onPress={buttonToGet}>
        {sucess
          ? "Добавлено в календарь"
          : list.length
            ? "Выберите календарь"
            : "Добавить в календарь"}
      </Button>

      {list.length ? (
        <>
          <ScrollView className="mt-2 flex max-h-64 flex-col gap-2">
            <View className="flex flex-col gap-2">
              {list.map((v) => (
                <Button
                  key={v.id}
                  onPress={() => addToId(v.id)}
                  size={"s"}
                  variant={"inverse"}
                >
                  {v.title}
                </Button>
              ))}
            </View>
          </ScrollView>
        </>
      ) : null}
    </>
  );
};

const EventPage = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const { data, isLoading } = api.events.get.useQuery(eventId || "");

  const delM = api.events.delete.useMutation();
  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const utils = api.useUtils();

  const deleteHandler = async () => {
    if (!eventId) return;
    setIsDeleting(true);

    await delM.mutateAsync(eventId);

    await utils.events.list.invalidate();

    router.navigate("/home/main");

    setIsDeleting(false);
  };

  if (isLoading || !data) {
    return (
      <View className="px-4" style={{ zIndex: 1, elevation: 1 }}>
        <Spinner />
      </View>
    );
  }

  const invLink = `https://mvstr.vercel.app/event/${eventId}`;

  const copyInvLink = async () => {
    await Clipboard.setStringAsync(invLink);
  };

  const toDate = differenceInDays(data.date, new Date());

  return (
    <>
      <ScrollView className=" px-4 " style={{ zIndex: 1, elevation: 1 }}>
        <Text className="headingS mt-4 text-center">
          {format(data.date, "d MMMM hh:mm")}
        </Text>

        <Text className="textXXL text-center">
          {toDate === 0 && <>Сегодня</>}
          {toDate > 0 && (
            <>
              Через {toDate} {declOfNum(toDate, ["день", "дня", "дней"])}
            </>
          )}
          {toDate < 0 && (
            <>
              {toDate} {declOfNum(toDate, ["день", "дня", "дней"])} назад
            </>
          )}
        </Text>

        <AddToCalendar />

        <View className="mt-3 rounded-2xl border border-stroke-secondary px-4 py-5">
          <Text className="headingXS">О мероприятии</Text>

          <Text className="textXXL">{data.description || "—"}</Text>
        </View>

        <View className="mt-2 flex flex-row gap-2">
          <View className="mt-2 flex-1 rounded-2xl bg-buttons-hover-secondary px-4 py-5">
            <Text className="headingXS">Место</Text>
            <Text className="textXXL">{data.place || "—"}</Text>
          </View>
          <View className="mt-2 flex-1 rounded-2xl bg-buttons-hover-secondary px-4 py-5">
            <Text className="headingXS">Тип</Text>
            <Text className="textXXL">{data.type || "—"}</Text>
          </View>
        </View>

        <View className="mt-4 flex flex-row items-center gap-8  rounded-2xl border border-stroke-secondary px-4 py-5">
          <Image source={InvitationPic} style={{ width: 100, height: 70 }} />
          <View className="flex-1">
            <Text className="headingXS">Приглашние</Text>
            <Text className="textXXL">
              Ссылка которую можно отправить гостям
            </Text>

            <View className=" mt-2 flex flex-row items-center gap-2 ">
              <Link href={invLink} asChild>
                <Button className="flex-1" variant={"stroke"}>
                  Открыть
                </Button>
              </Link>
              <Button
                onPress={copyInvLink}
                icon
                className="h-[44px] w-[44px] items-center"
                size={"sIcon"}
                variant={"stroke"}
              >
                <IconCopy
                  width={20}
                  height={20}
                  fill={"rgba(61, 56, 73, 1)"}
                ></IconCopy>
              </Button>
            </View>
          </View>
        </View>

        {data && <ReminderView event={data} />}

        <Link
          href={{
            pathname: "/modals/eventedit/[eventId]",
            params: { eventId },
          }}
          asChild
        >
          <Button className="mt-6" variant={"primary"}>
            Редактировать
          </Button>
        </Link>

        <Button
          onPress={deleteHandler}
          loading={isDeleting}
          className="mb-6 mt-6"
          variant={"stroke"}
        >
          Удалить
        </Button>
        <SafeAreaView />
      </ScrollView>
    </>
  );
};

export default EventPage;
