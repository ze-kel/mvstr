import { useState } from "react";
import { Text, View } from "react-native";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { add, format } from "date-fns";

import { Button } from "~/app/_components/button";
import { Input } from "~/app/_components/input";
import { RadioTabs } from "~/app/_components/radioTabs";
import { api } from "~/utils/api";

const DatePicker = ({
  date,
  onChange,
}: {
  date: Date;
  onChange: (v: Date) => void;
}) => {
  const [shown, setShown] = useState(false);
  const change = (_: unknown, selectedDate?: Date) => {
    if (selectedDate) {
      onChange(selectedDate);
    }
  };

  return (
    <View className="mt-4 flex items-start justify-start">
      <Button
        onPress={() => setShown(!shown)}
        variant={"secondary"}
        className=" w-full"
      >
        {format(date, "dd MMMM yyyy   HH:mm")}
      </Button>
      {shown && (
        <DateTimePicker
          display="spinner"
          testID="dateTimePicker"
          value={date}
          mode={"datetime"}
          locale="ru-RU"
          onChange={change}
        />
      )}
    </View>
  );
};

const Create = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState(add(new Date(), { days: 14 }));
  const [description, setDescription] = useState("");

  const m = api.events.create.useMutation();

  const router = useRouter();

  const utils = api.useUtils();

  const create = async () => {
    const r = await m.mutateAsync({
      name: title,
      type,
      place,
      date,
      description,
    });
    if (r.id) {
      setTitle("");
      setType("");
      setPlace("");
      setDate(add(new Date(), { days: 14 }));
      setDescription("");

      void utils.events.list.invalidate();

      router.navigate({
        pathname: "/event/[eventId]/",
        params: { eventId: r.id },
      });
    }
  };

  const [imageSelection, setImageSelection] = useState("Выбрать");

  return (
    <>
      <View className="mt-4  pb-8">
        <KeyboardAwareScrollView>
          <View className="px-4">
            <Text className="headingS">Расскажите о вашем мероприятии</Text>

            <Text className="subHeadingL mt-5">
              Введите информацию о мероприятии
            </Text>

            <RadioTabs
              values={[
                { value: "choice", label: "Выбрать" },
                { value: "upload", label: "Загрузить" },
              ]}
              value={imageSelection}
              onChange={setImageSelection}
            />

            <Text className="subHeadingM mt-5">Название мероприятия</Text>
            <Input
              className="mt-3"
              placeholder="Название события"
              value={title}
              onChangeText={setTitle}
            />
            <Text className="subHeadingM mt-5">Выберите тип мероприятия</Text>
            <Input
              className="mt-3"
              placeholder="Выберите тип мероприятия"
              value={type}
              onChangeText={setType}
            />
            <Text className="subHeadingM mt-5">Место проведения</Text>
            <Input
              className="mt-3"
              placeholder="Введите адрес"
              value={place}
              onChangeText={setPlace}
            />

            <Text className="subHeadingM mt-5">Дата и время начала</Text>
            <DatePicker date={date} onChange={setDate} />
            <Text className="subHeadingM mt-5">Опишите ваше мероприятите</Text>
            <Input
              className="mt-3 h-32"
              placeholder="Расскажите подробнее о вашем мероприятии в пару предложений"
              multiline
              numberOfLines={4}
              value={description}
              onChangeText={setDescription}
            />
            <Button onPress={() => void create()} className="mt-4">
              Создать
            </Button>
          </View>
        </KeyboardAwareScrollView>
      </View>
    </>
  );
};

export default Create;
