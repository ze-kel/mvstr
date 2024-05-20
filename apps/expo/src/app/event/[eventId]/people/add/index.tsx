import { useState } from "react";
import { Text, View } from "react-native";
import { useGlobalSearchParams, useRouter } from "expo-router";

import { Button } from "~/app/_components/button";
import { Input } from "~/app/_components/input";
import { RadioTabs } from "~/app/_components/radioTabs";
import { ContactList } from "~/app/event/[eventId]/people/add/contactList";
import { PhoneNumberInput } from "~/app/login/phone";
import { api } from "~/utils/api";

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

  const m = api.events.addGuest.useMutation({
    onSuccess: () => {
      void utils.events.getGuests.invalidate(eventId);
    },
  });

  const { data } = api.events.getGuests.useQuery(eventId || "");

  const addHandler = async (c: ToAdd, dismiss?: boolean) => {
    if (!eventId) return;
    await m.mutateAsync({ ...c, eventId });

    if (dismiss) {
      router.navigate({
        pathname: "/event/[eventId]/people",
        params: { eventId },
      });
    }
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

export default CreationModal;
