import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { add, format } from "date-fns";

import type { IEventBase } from "../../../../../../packages/api/dist/router/events";
import { Button } from "~/app/_components/button";
import {
  defaultEventPicsArray,
  ImageWithDefaults,
} from "~/app/_components/imageWithDefaults";
import { Input } from "~/app/_components/input";
import { PageHeader } from "~/app/_components/layoutElements";
import { RadioTabs } from "~/app/_components/radioTabs";
import { ImageUploader } from "~/app/modals/wish/[wishId]";
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

export const UploadOrSelectImage = ({
  value,
  setValue,
  defaults,
}: {
  value: string;
  setValue: (v: string) => void;
  defaults: string[];
}) => {
  const [imageSelection, setImageSelection] = useState(
    !value || defaults.includes(value) ? "choice" : "upload",
  );

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

      <View className="flex h-[80px] flex-row items-center ">
        {imageSelection === "choice" && (
          <ScrollView horizontal className="flex flex-row gap-1 ">
            {defaults.map((v) => {
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
                    <ImageWithDefaults
                      style={{ width: 60, height: 60, borderRadius: 16 }}
                      defaultImage=""
                      image={v}
                    />
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
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

export type IEditorHandler = (v: {
  title: string;
  type: string;
  place: string;
  date: Date;
  description: string;
  image: string;
}) => Promise<void>;

export const EventEditor = ({
  initial,
  submitHandler,
}: {
  initial?: IEventBase;
  submitHandler: IEditorHandler;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const [title, setTitle] = useState(initial?.name || "");
  const [type, setType] = useState(initial?.type || "");
  const [place, setPlace] = useState(initial?.place || "");
  const [date, setDate] = useState(
    initial?.date || add(new Date(), { days: 14 }),
  );
  const [description, setDescription] = useState(initial?.description || "");
  const [image, setImage] = useState(
    initial?.image || defaultEventPicsArray[0] || "",
  );

  return (
    <KeyboardAwareScrollView>
      <View className="pb-8">
        <View className="px-4">
          <Text className="subHeadingL mb-3 mt-5">Выберите изображение</Text>
          <UploadOrSelectImage
            defaults={defaultEventPicsArray}
            value={image}
            setValue={setImage}
          />
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
          <Button
            loading={isLoading}
            onPress={async () => {
              setIsLoading(true);

              await submitHandler({
                title,
                type,
                place,
                date,
                description,
                image,
              });

              setIsLoading(false);

              setTitle("");
              setType("");
              setPlace("");
              setDate(add(new Date(), { days: 14 }));
              setDescription("");
            }}
            className="mt-4"
          >
            {initial ? "Сохранить" : "Создать"}
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

const Create = () => {
  const m = api.events.create.useMutation();

  const router = useRouter();

  const utils = api.useUtils();

  const submitHandler: IEditorHandler = async ({
    title,
    type,
    place,
    date,
    description,
    image,
  }) => {
    const r = await m.mutateAsync({
      name: title,
      type,
      place,
      date,
      description,
      image,
    });
    if (r.id) {
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

      <EventEditor submitHandler={submitHandler} />
    </>
  );
};

export default Create;
