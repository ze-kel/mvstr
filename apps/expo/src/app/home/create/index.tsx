import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { add, format } from "date-fns";

import { Button } from "~/app/_components/button";
import { defaultEventImages, EventAvatar } from "~/app/_components/eventAvatar";
import { Input } from "~/app/_components/input";
import { PageHeader } from "~/app/_components/layoutElements";
import { RadioTabs } from "~/app/_components/radioTabs";
import { ImageUploader } from "~/app/home/main/wishlist/item/[wishId]";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";

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

const CreateImageStuff = ({
  value,
  setValue,
}: {
  value: string;
  setValue: (v: string) => void;
}) => {
  const [imageSelection, setImageSelection] = useState("choice");

  return (
    <View>
      <RadioTabs
        values={[
          { value: "choice", label: "Выбрать" },
          { value: "upload", label: "Загрузить" },
        ]}
        value={imageSelection}
        onChange={setImageSelection}
      />

      <View className="flex h-[75px] flex-row items-center ">
        {imageSelection === "choice" && (
          <View className="flex flex-row gap-1">
            {defaultEventImages.map((v) => {
              return (
                <Pressable key={v} onPress={() => setValue(v)}>
                  <View
                    style={{
                      borderColor:
                        value === v ? "rgba(86, 58, 220, 1)" : "transparent",
                      borderWidth: 1,
                      borderRadius: 18,
                      padding: 2,
                      overflow: "hidden",
                    }}
                  >
                    <EventAvatar
                      style={{ width: 60, height: 60, borderRadius: 16 }}
                      image={v}
                    />
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}

        {imageSelection === "upload" && (
          <ImageUploader
            value={value}
            actions={[{ resize: { width: 750, height: 750 } }]}
            onChange={setValue}
          />
        )}
      </View>
    </View>
  );
};

export const Steps = ({
  total,
  current,
}: {
  total: number;
  current: number;
}) => {
  return (
    <View className="mt-6 flex flex-row items-center justify-center gap-2">
      {Array.from(Array(total)).map((_, i) => {
        return (
          <View
            key={i}
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-lg",
              i + 1 === current ? "bg-buttons-primary" : "bg-surface-secondary",
            )}
          >
            <Text
              className={cn(
                i + 1 === current ? "text-text-inverse" : "text-text-secondary",
              )}
              style={{
                fontFamily: "NeueMachina-Ultrabold",
                fontSize: 10,
                lineHeight: 10,
                marginTop: 2,
              }}
            >
              {i + 1}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const Create = () => {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [place, setPlace] = useState("");
  const [date, setDate] = useState(add(new Date(), { days: 14 }));
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(defaultEventImages[0] || "");

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
      image,
    });
    if (r.id) {
      setTitle("");
      setType("");
      setPlace("");
      setDate(add(new Date(), { days: 14 }));
      setDescription("");

      void utils.events.list.invalidate();

      router.replace({
        pathname: "/home/create/second/[eventId]/",
        params: { eventId: r.id },
      });
    }
  };

  return (
    <>
      <Steps current={1} total={3} />
      <PageHeader title="Создать мероприятие" />
      <KeyboardAwareScrollView>
        <View className="pb-8">
          <View className="px-4">
            <Text className="subHeadingL mb-3 mt-5">Выберите изображение</Text>
            <CreateImageStuff value={image} setValue={setImage} />
            <Text className="subHeadingL mt-7">
              Введите информацию о мероприятии
            </Text>

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
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default Create;
