import { useState } from "react";
import { Text, View } from "react-native";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { differenceInDays, format, isAfter } from "date-fns";

import { Button } from "~/app/_components/button";
import { PageHeader } from "~/app/_components/layoutElements";
import Spinner from "~/app/_components/spinner";
import { api } from "~/utils/api";
import { declOfNum } from "~/utils/declOfNum";

const EventPage = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const { data, isFetching } = api.events.get.useQuery(eventId || "");

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

  if (isFetching || !data) {
    return (
      <View className="px-4" style={{ zIndex: 1, elevation: 1 }}>
        <Spinner />
      </View>
    );
  }

  const toDate = differenceInDays(data.date, new Date());

  return (
    <>
      <PageHeader title="Ваше мероприятие" />
      <View className="px-4 py-2" style={{ zIndex: 1, elevation: 1 }}>
        <Text className="headingS">{format(data.date, "d MMMM hh:mm")}</Text>

        <Text className="textXXL">
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

        <Text className="headingS mt-5">О мероприятии</Text>

        <Text className="textXXL">{data.description || "—"}</Text>
        <Text className="headingS mt-5">Тип мероприятия</Text>
        <Text className="textXXL">{data.type}</Text>

        <Text className="headingS mt-5">Место проведения</Text>
        <Text className="textXXL">{data.place || "—"}</Text>
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
          className="mt-6"
          variant={"stroke"}
        >
          Удалить
        </Button>
      </View>
    </>
  );
};

export default EventPage;
