import type { Contact } from "expo-contacts";
import { useRef } from "react";
import { Text, TextInput, View } from "react-native";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

import type { INewTask, ITask } from "@acme/api";

import { Button } from "~/app/_components/button";
import { ContactList } from "~/app/event/[eventId]/people/add/contactList";
import { api } from "~/utils/api";

export interface ToAdd {
  phone: string;
  firstName: string;
  lastName: string;
}

const CreationModal = () => {
  const { eventId } = useGlobalSearchParams<{
    eventId: string;
  }>();

  const utils = api.useUtils();

  const m = api.events.addGuest.useMutation({
    onSuccess: () => {
      void utils.events.getGuests.invalidate(eventId);
    },
  });

  const addHandler = async (c: ToAdd) => {
    if (!eventId) return;
    await m.mutateAsync({ ...c, eventId });
  };

  return (
    <View className="h-full">
      <ContactList addHandler={addHandler} />
    </View>
  );
};

export default CreationModal;
