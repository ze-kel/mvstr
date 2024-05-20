import { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import * as Contacts from "expo-contacts";

import type { ToAdd } from "~/app/event/[eventId]/people/add";
import { Button } from "~/app/_components/button";
import { EmptyList } from "~/app/_components/layoutElements";
import { regexNonNumbers } from "~/app/login/phone";

const getContacts = async () => {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status === "granted") {
    const { data } = await Contacts.getContactsAsync({
      fields: [Contacts.Fields.PhoneNumbers],
    });

    if (data.length > 0) {
      return data;
    }
  }
  return [];
};

const verifyNumber = (n?: string) => {
  if (!n) return;

  n = n.replaceAll(regexNonNumbers, "");

  if (n.length !== 11) return;

  if (n.startsWith("7")) {
    return n;
  }

  if (n.startsWith("8")) {
    return n.replace("8", "7");
  }

  return;
};

const ConctactItem = ({
  item,
  addHandler,
  included,
}: {
  included: string[];
  item: Contacts.Contact;
  addHandler: (c: ToAdd) => Promise<void>;
}) => {
  const n = verifyNumber(item.phoneNumbers?.map((v) => v.digits)[0]);

  const inc = included.includes(n || "none");

  return (
    <View className="flex flex-row justify-between gap-4 px-4 py-2">
      <View>
        <Text className="subHeadingL">
          {item.firstName} {item.lastName}
        </Text>
        <Text className="textXL">
          {n ? n : "Номер отсутствует или невалидный"}
        </Text>
      </View>

      {n && (
        <Button
          onPress={() => {
            if (!n) return;
            void addHandler({
              firstName: item.firstName || "",
              lastName: item.lastName || "",
              phone: n,
              gender: "",
            });
          }}
          disabled={inc}
          variant={"stroke"}
        >
          {inc ? "Добавлен" : "Добавить"}
        </Button>
      )}
    </View>
  );
};

export const ContactList = ({
  included,
  addHandler,
}: {
  included: string[];
  addHandler: (c: ToAdd) => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<Contacts.Contact[]>([]);

  const gs = async () => {
    setIsLoading(true);
    const r = await getContacts();
    setList(r);
    setIsLoading(false);
  };

  useEffect(() => {
    void gs();
  }, []);

  return (
    <FlatList
      data={list}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={async () => {
            await gs();
          }}
        />
      }
      ListEmptyComponent={
        <EmptyList
          text={"Нет контактов"}
          subtext={
            "Либо ваш список контактов пуст, либо у нас нет к ним доступа"
          }
        />
      }
      keyExtractor={(item) => item.name + item.id}
      renderItem={(v) => (
        <ConctactItem
          included={included}
          addHandler={addHandler}
          item={v.item}
        />
      )}
    ></FlatList>
  );
};
