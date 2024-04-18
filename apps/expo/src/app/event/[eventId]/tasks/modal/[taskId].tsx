import { useRef } from "react";
import { Text, TextInput, View } from "react-native";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";

import type { INewTask, ITask } from "@acme/api";

import { Button } from "~/app/_components/button";
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

  return (
    <View className="rounded-[28px] bg-surface-inverse px-4 pb-32 pt-6">
      <TextInput
        defaultValue={task.current.title}
        onChangeText={(v) => (task.current.title = v)}
        className="headingM mt-4 h-14 "
        placeholder="Название задачи"
        autoFocus
      />
      <TextInput
        defaultValue={task.current.description}
        onChangeText={(v) => (task.current.description = v)}
        className="textXXL mt-1"
        placeholder="Описание задачи"
      />
      <Button
        className="mt-6"
        onPress={() => {
          void handleSave(task.current);
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

  const { data, isLoading, error } = api.tasks.getTasksForEvent.useQuery({
    id: eventId,
  });

  const router = useRouter();
  const utils = api.useUtils();

  const currentOne = data?.find((v) => v.id === taskId);

  const k = getQueryKey(api.tasks.getTasksForEvent, { id: eventId });

  // Note that Im not revalidating here becuase that will automatically happen
  // when we navigate to other page after saving
  const mutate = api.tasks.updateTask.useMutation({
    onMutate: (updatedTask) => {
      console.log("MUTATING", updatedTask);

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

  if (taskId === "create")
    return (
      <View>
        <Text>create mode</Text>
        <CreateMode />
      </View>
    );

  return <EditMode />;
};

export default CreationModal;
