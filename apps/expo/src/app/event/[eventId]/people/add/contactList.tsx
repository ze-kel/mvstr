import { useEffect, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import * as Contacts from "expo-contacts";

import type { ToAdd } from "~/app/event/[eventId]/people/add";
import { Button } from "~/app/_components/button";
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
}: {
  item: Contacts.Contact;
  addHandler: (c: ToAdd) => Promise<void>;
}) => {
  const n = verifyNumber(item.phoneNumbers?.map((v) => v.digits)[0]);

  return (
    <View className="flex flex-row justify-between gap-4 px-4 py-2">
      <View>
        <Text className="subHeadingL">
          {item.firstName} {item.lastName}
        </Text>
        <Text className="textXL">{n}</Text>
      </View>

      <Button
        onPress={() => {
          if (!n) return;

          void addHandler({
            firstName: item.firstName || "",
            lastName: item.lastName || "",
            phone: n,
          });
        }}
        variant={"stroke"}
      >
        Добавить
      </Button>
    </View>
  );
};

export const ContactList = ({
  addHandler,
}: {
  addHandler: (c: ToAdd) => Promise<void>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [list, setList] = useState<Contacts.Contact[]>([
    { id: "aa", name: "asaa", contactType: "person", firstName: "aaa" },
    { id: "bbb", name: "asass", contactType: "person", firstName: "bbb" },
  ]);

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
      ListHeaderComponent={
        <View className="px-4" style={{}}>
          <Text
            className="pb-4 pt-7"
            style={{
              fontSize: 22,
              fontFamily: "NeueMachina-Ultrabold",
            }}
          >
            Контакты
          </Text>
        </View>
      }
      keyExtractor={(item) => item.name + item.id}
      renderItem={(v) => <ConctactItem addHandler={addHandler} item={v.item} />}
    ></FlatList>
  );
};