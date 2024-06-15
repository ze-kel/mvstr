import { useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Contacts from "expo-contacts";

import type { ToAdd } from "~/app/modals/guest/[guestId]";
import { Button } from "~/app/_components/button";
import { Input } from "~/app/_components/input";
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
  const [isLoading, setIsLoading] = useState(false);

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
          loading={isLoading}
          onPress={async () => {
            if (!n) return;
            setIsLoading(true);
            await addHandler({
              firstName: item.firstName || "",
              lastName: item.lastName || "",
              phone: n,
              gender: "",
            });
            setIsLoading(false);
          }}
          className="w-[130px]"
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

  const [searchQ, setSearchQ] = useState("");

  const sortedList = useMemo(() => {
    const filtered = searchQ
      ? list.filter((v) => {
          return (
            v.firstName?.includes(searchQ) || v.lastName?.includes(searchQ)
          );
        })
      : list;

    return filtered.sort((a, b) => {
      const last = (a.lastName || "").localeCompare(b.lastName || "");

      return last === 0
        ? (a.firstName || "").localeCompare(b.firstName || "")
        : last;
    });
  }, [list, searchQ]);

  return (
    <>
      <View className="ob mx-4">
        <Input
          value={searchQ}
          onChangeText={setSearchQ}
          placeholder="Поиск"
          className="py-2"
        />
      </View>
      <FlatList
        data={sortedList}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={async () => {
              await gs();
            }}
          />
        }
        ListFooterComponent={<SafeAreaView edges={["bottom"]} />}
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
    </>
  );
};
