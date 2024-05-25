import { useState } from "react";
import { Text, View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { add } from "date-fns";

import type { IEditorHandler } from "~/app/home/create";
import { Button } from "~/app/_components/button";
import { Input } from "~/app/_components/input";
import { PageHeader } from "~/app/_components/layoutElements";
import { RadioTabs } from "~/app/_components/radioTabs";
import { DatePicker, EventEditor } from "~/app/home/create";
import { api } from "~/utils/api";

const EditEvent = () => {
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const { data } = api.events.get.useQuery(eventId || "", {
    refetchOnMount: false,
  });

  const me = api.user.getMe.useQuery(undefined, { refetchOnMount: false });

  const m = api.events.updateReminder.useMutation();

  const router = useRouter();
  const utils = api.useUtils();

  const [when, setWhen] = useState("later");
  const [date, setDate] = useState(add(new Date(), { days: 1 }));
  const [text, setText] = useState(
    data?.reminderText ||
      `${me.data?.firstName} приглашает тебя на ${data?.name}`,
  );

  const submitHandler = async () => {
    if (!eventId) return;

    await m.mutateAsync({
      id: eventId,
      date: when === "now" ? new Date() : date,
      text,
    });
    await utils.events.get.invalidate(eventId);

    router.dismiss();
  };

  return (
    <>
      <View className="px-4 ">
        <PageHeader title="Отправить приглашение" />
        <RadioTabs
          value={when}
          onChange={setWhen}
          className="mt-2"
          values={[
            { value: "now", label: "Сейчас" },
            { value: "later", label: "Запланировать" },
          ]}
        />

        <Text className="subHeadingL mt-7">Текст приглашения</Text>
        <Input
          multiline
          numberOfLines={2}
          className="mt-3 h-20"
          value={text}
          onChangeText={setText}
        />

        {when === "later" && (
          <>
            <Text className="subHeadingL mt-7">Дата отправки</Text>
            <DatePicker date={date} onChange={setDate} />
          </>
        )}
        <Button className="mt-4" onPress={submitHandler}>
          {when === "later" ? "Запланировать" : "Отправить сейчас"}
        </Button>
      </View>
    </>
  );
};

export default EditEvent;
