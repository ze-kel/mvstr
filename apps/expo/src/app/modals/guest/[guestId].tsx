import { useState } from "react";
import { Text, View } from "react-native";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";

import type { IGuestFull } from "@acme/api";

import { Button } from "~/app/_components/button";
import { Input } from "~/app/_components/input";
import { RadioTabs } from "~/app/_components/radioTabs";
import Spinner from "~/app/_components/spinner";
import { UserAvatar } from "~/app/_components/userAvatar";
import { getBaseUserInfo, maskDBNumber } from "~/app/event/[eventId]/people";
import { PhoneNumberInput } from "~/app/login/phone";
import { api } from "~/utils/api";
import { ContactList } from "./contactList";

export interface ToAdd {
  phone: string;
  firstName: string;
  lastName: string;
  gender: string;
}

const AddForm = ({
  included,
  addHandler,
}: {
  included: string[];
  addHandler: (c: ToAdd, dismiss?: boolean) => Promise<void>;
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("female");
  const [phone, setPhone] = useState("");

  const alreadyThere = included.includes(phone);

  const canSubmit =
    firstName.length && lastName.length && phone.length === 11 && !alreadyThere;

  return (
    <View className="px-4">
      <Input placeholder="Имя" value={firstName} onChangeText={setFirstName} />

      <Input
        className="mt-2"
        placeholder="Фамилия"
        value={lastName}
        onChangeText={setLastName}
      />
      <RadioTabs
        value={gender}
        onChange={setGender}
        className="mt-2"
        values={[
          { value: "male", label: "Мужчина" },
          { value: "female", label: "Женщина" },
        ]}
      />
      <PhoneNumberInput className="mt-2" value={phone} onChange={setPhone} />

      <Button
        onPress={() => {
          if (canSubmit) {
            addHandler({ firstName, lastName, phone, gender }, true);
          }
        }}
        className="mt-4"
        variant={"stroke"}
        disabled={!canSubmit}
      >
        {alreadyThere ? "Номер уже добавлен" : "Добавить"}
      </Button>
    </View>
  );
};

const CreationModal = () => {
  const { eventId } = useGlobalSearchParams<{
    eventId: string;
  }>();

  const router = useRouter();

  const utils = api.useUtils();

  const m = api.events.addGuest.useMutation();

  const { data } = api.events.getGuests.useQuery(eventId || "");

  const addHandler = async (c: ToAdd, dismiss?: boolean) => {
    if (!eventId) return;
    await m.mutateAsync({ ...c, eventId });

    if (dismiss) {
      router.navigate({
        pathname: "/event/[eventId]/people",
        params: { eventId },
      });
      await utils.events.getGuests.invalidate(eventId);
    }
    await utils.events.getGuests.invalidate(eventId);
  };

  const [mode, setMode] = useState("form");

  const inc = (data?.map((v) => v.user.phone) as string[]) || [];

  return (
    <View className="h-full">
      <View className="px-4 pb-4" style={{}}>
        <Text
          className="pb-4 pt-7"
          style={{
            fontSize: 22,
            fontFamily: "NeueMachina-Ultrabold",
          }}
        >
          Добавить гостя
        </Text>

        <RadioTabs
          value={mode}
          values={[
            { value: "form", label: "По номеру" },
            { value: "contacts", label: "Из контактов" },
          ]}
          onChange={setMode}
        />
      </View>

      {mode === "form" ? (
        <AddForm included={inc} addHandler={addHandler} />
      ) : (
        <ContactList included={inc} addHandler={addHandler} />
      )}
    </View>
  );
};

const Editor = ({ g }: { g: IGuestFull }) => {
  const { guestId, eventId } = useGlobalSearchParams<{
    eventId: string;
    guestId: string;
  }>();

  const [firstName, setFirstName] = useState(g.firstName || "");
  const [lastName, setLastName] = useState(g.lastName || "");
  const [gender, setGender] = useState(g.gender || "male");

  const updateMutation = api.events.updateGuest.useMutation();

  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  const utils = api.useUtils();

  const updateHandler = async () => {
    if (!guestId) return;

    setIsLoading(true);

    await updateMutation.mutateAsync({ guestId, firstName, lastName, gender });

    await utils.events.getGuests.invalidate(eventId);

    router.dismiss();
    setIsLoading(false);
  };

  return (
    <>
      <Text className="headingS text-center">Изменить данные гостя</Text>

      <Text className="textXXL mb-5 mt-1.5 text-center">
        Вы можете изменить данные гостя
      </Text>

      <Input placeholder="Имя" value={firstName} onChangeText={setFirstName} />

      <Input
        className="mt-2"
        placeholder="Фамилия"
        value={lastName}
        onChangeText={setLastName}
      />
      <RadioTabs
        value={gender}
        onChange={setGender}
        className="mt-2"
        values={[
          { value: "male", label: "Мужчина" },
          { value: "female", label: "Женщина" },
        ]}
      />

      <Button className="mt-2" loading={isLoading} onPress={updateHandler}>
        Сохранить
      </Button>
    </>
  );
};

const EditMode = () => {
  const { guestId, eventId } = useGlobalSearchParams<{
    eventId: string;
    guestId: string;
  }>();

  const { data } = api.events.getGuests.useQuery(eventId || "", {
    refetchOnMount: false,
  });

  const delM = api.events.removeGuest.useMutation();

  const [isDeleting, setIsDeleting] = useState(false);

  const router = useRouter();

  const utils = api.useUtils();

  const deleteHandler = async () => {
    if (!guestId) return;
    setIsDeleting(true);

    await delM.mutateAsync(guestId);
    await utils.events.getGuests.invalidate(eventId);
    router.dismiss();

    setIsDeleting(false);
  };

  if (!data) return <Spinner />;

  const target = data.find((v) => v.id === guestId);

  if (!target) return <View>Guest ID error</View>;

  if (target.user.registered) {
    const { firstName, lastName, gender } = getBaseUserInfo(target);

    return (
      <View className="px-4 py-7">
        <Text className="headingS text-center">Существующий пользователь</Text>

        <Text className="textXXL mb-5 mt-1.5 text-center">
          Этот человек уже зарегистрировался в&nbsp;приложении, он сам
          устанавливает свои данные и аватар
        </Text>
        <View className="flex flex-row items-center gap-2.5">
          <UserAvatar
            user={target.user}
            gender={gender}
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
              {firstName} {lastName}
            </Text>
            <Text className="textL mt-0.5 w-full">
              {maskDBNumber(target.user.phone || "")}
            </Text>
          </View>
        </View>
        <Button
          loading={isDeleting}
          className="mt-4"
          onPress={deleteHandler}
          variant={"stroke"}
        >
          Убрать из гостей
        </Button>
      </View>
    );
  }

  return (
    <View className="px-4 py-6">
      <Editor g={target} />
      <Button
        loading={isDeleting}
        className="mt-4"
        onPress={deleteHandler}
        variant={"stroke"}
      >
        Убрать из гостей
      </Button>
    </View>
  );
};

const PersonModal = () => {
  const { guestId } = useGlobalSearchParams<{
    eventId: string;
    guestId: string;
  }>();

  if (guestId === "create") return <CreationModal />;

  return <EditMode />;
};

export default PersonModal;
