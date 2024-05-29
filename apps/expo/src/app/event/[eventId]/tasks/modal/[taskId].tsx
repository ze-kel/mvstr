import React, { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { format } from "date-fns";

import type { INewTask, ITask } from "@acme/api";

import { Button } from "~/app/_components/button";
import { IconCross, IconTime } from "~/app/_components/icons";
import { api } from "~/utils/api";

const TaskEditor = ({
  initial,
  handleSave,
}: {
  initial?: Partial<ITask>;
  handleSave: (v: Partial<ITask>) => Promise<void>;
}) => {
  const { eventId } = useGlobalSearchParams<{
    eventId: string;
    taskId: string;
  }>();

  const task = useRef<Partial<ITask>>(
    initial || {
      title: "",
      description: "",
      eventId,
    },
  );

  const [date, setDate] = useState<Date | undefined>(
    initial?.time || undefined,
  );

  const [showDateSelector, setShowDate] = useState(false);

  const [isLoading, setIsloading] = useState(false);

  return (
    <View className="rounded-[28px] bg-surface-inverse px-4 pb-32 pt-6">
      <TextInput
        defaultValue={task.current.title}
        onChangeText={(v) => (task.current.title = v)}
        placeholderTextColor={"rgba(185, 184, 188, 1)"}
        className="headingM mt-4 h-14"
        placeholder="Название задачи"
        autoFocus
      />
      <TextInput
        defaultValue={task.current.description}
        placeholderTextColor={"rgba(185, 184, 188, 1)"}
        onChangeText={(v) => (task.current.description = v)}
        className="textXXL mt-1"
        placeholder="Описание задачи"
      />

      <View className="mt-2 flex flex-col">
        <View className="flex flex-row gap-1">
          <Button
            onPress={() => {
              setDate(new Date());
              setShowDate(!showDateSelector);
            }}
            size={"xs"}
            variant={"secondary"}
            leftIcon={<IconTime width={12} height={12} />}
          >
            {date ? format(date, "dd MMMM HH:mm") : "Без даты"}
          </Button>
          {date && (
            <Pressable
              onPress={() => {
                setShowDate(false);
                setDate(undefined);
              }}
            >
              <View className="flex h-8 w-8 items-center justify-center rounded-xl ">
                <IconCross width={12} height={12} />
              </View>
            </Pressable>
          )}
        </View>

        {showDateSelector && (
          <DateTimePicker
            display="spinner"
            testID="dateTimePicker"
            value={date}
            mode={"datetime"}
            locale="ru-RU"
            onChange={(_, selectedDate) => {
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}
      </View>

      <Button
        loading={isLoading}
        className="mt-4"
        onPress={async () => {
          setIsloading(true);
          await handleSave({ ...task.current, time: date });
          setIsloading(false);
        }}
      >
        Сохранить
      </Button>
    </View>
  );
};

const EditMode = () => {
  const { eventId, taskId } = useGlobalSearchParams<{
    eventId: string;
    taskId: string;
  }>();

  const { data, isLoading, error } = api.tasks.getTasksForEvent.useQuery(
    {
      id: eventId || "",
    },
    { refetchOnMount: false },
  );

  const router = useRouter();
  const utils = api.useUtils();

  const currentOne = data?.find((v) => v.id === taskId);

  const k = getQueryKey(api.tasks.getTasksForEvent, { id: eventId });

  // Note that Im not revalidating here becuase that will automatically happen
  // when we navigate to other page after saving
  const mutate = api.tasks.updateTask.useMutation({
    onMutate: (updatedTask) => {
      utils.tasks.getTasksForEvent.setData({ id: eventId }, (data) => {
        if (!data) return data;

        const u = data.map((t) => {
          if (t.id !== updatedTask.taskId) return t;

          return { ...t, ...updatedTask.update };
        });

        return u;
      });
    },
  });

  const handler = async (v: Partial<ITask>) => {
    mutate.mutateAsync({ taskId, update: v });
    router.navigate({
      pathname: "/event/[eventId]/tasks/",
      params: { eventId },
    });
  };

  if (isLoading) {
    return (
      <View>
        <Text>loading</Text>
      </View>
    );
  }

  if (!currentOne)
    return (
      <Redirect
        href={{ pathname: "/event/[eventId]/tasks/", params: { eventId } }}
      ></Redirect>
    );

  return (
    <View>
      <TaskEditor initial={currentOne} handleSave={handler}></TaskEditor>
    </View>
  );
};

const CreateMode = () => {
  const { eventId, taskId } = useGlobalSearchParams<{
    eventId: string;
    taskId: string;
  }>();

  const qc = useQueryClient();
  const router = useRouter();

  const k = getQueryKey(api.tasks.getTasksForEvent, { id: eventId });
  const mutate = api.tasks.addTaskToEvent.useMutation({
    onSuccess: () => {
      //  qc.invalidateQueries({ queryKey: k });
    },
  });

  const handler = async (v: INewTask) => {
    await mutate.mutateAsync(v);
    router.replace({
      pathname: "/event/[eventId]/tasks/",
      params: { eventId },
    });
  };

  return (
    <TaskEditor
      initial={{ title: "", description: "", eventId }}
      handleSave={handler}
    ></TaskEditor>
  );
};

const CreationModal = () => {
  const { taskId } = useGlobalSearchParams<{
    eventId: string;
    taskId: string;
  }>();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex h-full flex-col-reverse "
    >
      <View className="rounded-[28px] bg-surface-inverse">
        {taskId === "create" ? <CreateMode /> : <EditMode />}
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreationModal;
