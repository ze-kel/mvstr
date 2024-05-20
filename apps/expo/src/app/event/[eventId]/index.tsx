import { Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { Button } from "~/app/_components/button";
import { api } from "~/utils/api";

const EventPage = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const { data } = api.events.get.useQuery(eventId || "");

  return (
    <View className="px-4" style={{ zIndex: 1, elevation: 1 }}>
      <Text>{eventId}</Text>

      <Text>Тип мероприятия</Text>

      <Text>{data?.type}</Text>
      <Text>О мероприятии</Text>
      <Text>{data?.description}</Text>

      <Text>Место проведения</Text>
      <Text>{data?.place}</Text>

      <Text>Ссылка на приглашение</Text>

      <Button>Изменить</Button>
      <Button className="mt-6" variant={"inverse"}>
        Удалить
      </Button>
    </View>
  );
};

export default EventPage;
