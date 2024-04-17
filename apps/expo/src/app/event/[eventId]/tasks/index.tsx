import type { SvgProps } from "react-native-svg";
import { useEffect } from "react";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, ClipPath, Defs, G, Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useGlobalSearchParams } from "expo-router";
import { format, isToday, setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";

import type { ITask } from "@acme/api";

import { Button } from "~/app/_components/button";
import { IconCheck, IconPlus } from "~/app/_components/icons";
import Spinner from "~/app/_components/spinner";
import { api } from "~/utils/api";

setDefaultOptions({ locale: ru });

const IconCalendar = (props: SvgProps) => (
  <Svg width={12} height={12} fill="none" {...props}>
    <G clipPath="url(#a)">
      <Path d="M0 4v-.5C0 2.122 1.121 1 2.5 1H3V.5a.5.5 0 1 1 1 0V1h4V.5a.5.5 0 1 1 1 0V1h.5C10.879 1 12 2.122 12 3.5V4H0Zm12 1v4.5c0 1.379-1.121 2.5-2.5 2.5h-7A2.503 2.503 0 0 1 0 9.5V5h12ZM6 9.5a.5.5 0 0 0-.5-.5H3a.5.5 0 1 0 0 1h2.5a.5.5 0 0 0 .5-.5Zm3.5-2A.5.5 0 0 0 9 7H3a.5.5 0 1 0 0 1h6a.5.5 0 0 0 .5-.5Z" />
    </G>
    <Defs>
      <ClipPath id="a">
        <Path d="M0 0h12v12H0z" />
      </ClipPath>
    </Defs>
  </Svg>
);

const TaskItem = ({ task }: { task: ITask }) => {
  const today = task.time && isToday(task.time);
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();

  const utils = api.useUtils();
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

  return (
    <View className="flex flex-row items-center rounded-xl bg-surface-secondary p-3 pr-0">
      <Pressable
        className="h-full pl-2 pr-4"
        onPress={() => {
          void mutate.mutateAsync({
            taskId: task.id,
            update: { completed: !task.completed },
          });
        }}
      >
        <View className="bg-surface-action flex h-5 w-5 items-center justify-center rounded-[6px] border border-text-accent">
          {task.completed && (
            <IconCheck width={12} height={12} fill={"rgba(86, 58, 220, 1)"} />
          )}
        </View>
      </Pressable>
      <Link
        asChild
        href={{
          pathname: "/event/[eventId]/tasks/modal/[taskId]",
          params: { eventId, taskId: task.id },
        }}
      >
        <Pressable>
          <View className="flex flex-col">
            <Text className="subHeadingL">{task.title}</Text>
            {task.description && (
              <Text className="textM text-text-tertiary">
                {task.description}
              </Text>
            )}

            <View className="mt-1 flex flex-row items-center gap-1">
              <IconCalendar
                fill={today ? "rgba(33, 186, 114, 1)" : "rgba(86, 58, 220, 1)"}
              />
              <Text
                style={{
                  fontFamily: "Nunito-Bold",
                  fontSize: 10,
                  lineHeight: 14,
                  color: today
                    ? "rgba(33, 186, 114, 1)"
                    : "rgba(86, 58, 220, 1)",
                }}
              >
                {task.time ? format(task.time, "d MMMM") : "Без даты"}
              </Text>
            </View>
          </View>
        </Pressable>
      </Link>
    </View>
  );
};

const CompletionIndicator = ({ tasks }: { tasks: ITask[] }) => {
  const total = tasks.length;
  const completed = tasks.filter((v) => v.completed).length;

  const progress = (completed / total) * 100;

  const circumf = 2 * 3.14 * 6;
  const offset = circumf * ((100 - progress) / 100);

  return (
    <View className="flex flex-row gap-1">
      <Svg width={14} height={14} style={{ transform: [{ rotate: "-90deg" }] }}>
        <Circle
          r="6"
          cx="7"
          cy="7"
          fill="transparent"
          stroke="rgba(243, 245, 247, 1)"
          strokeWidth={3}
        />
        <Circle
          r="6"
          cx="7"
          cy="7"
          stroke="rgba(86, 58, 220, 1)"
          fill="transparent"
          strokeDasharray={circumf}
          strokeDashoffset={offset}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </Svg>
      <Text className="textLAccent text-text-tertiary">
        {total === 0 ? "0 задач" : `Выполнено ${completed} из ${total}`}
      </Text>
    </View>
  );
};

export default function Index() {
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();

  const utils = api.useUtils();
  const { data, isFetching, isPending, error } =
    api.tasks.getTasksForEvent.useQuery({
      id: eventId,
    });

  if (isPending) {
    return <Spinner />;
  }

  return (
    <>
      <FlatList
        className="pt-7"
        data={data}
        refreshControl={
          <RefreshControl
            refreshing={isFetching && !isPending}
            onRefresh={async () => {
              await utils.tasks.getTasksForEvent.refetch({ id: eventId });
            }}
          />
        }
        contentContainerClassName="mt-3 flex flex-col gap-2"
        ListHeaderComponent={
          <View className="flex flex-row items-start justify-between">
            <View className="glex gap-1">
              <Text
                style={{
                  fontSize: 22,
                  fontFamily: "NeueMachina-Ultrabold",
                }}
              >
                Список моих задач
              </Text>
              <CompletionIndicator tasks={data || []} />
            </View>

            <Link
              asChild
              href={{
                pathname: "/event/[eventId]/tasks/modal/[taskId]",
                params: { eventId, taskId: "create" },
              }}
            >
              <Button size="sIcon" icon>
                <IconPlus width={18} height={18} fill={"white"} />
              </Button>
            </Link>
          </View>
        }
        keyExtractor={(item) => item.id}
        renderItem={(v) => <TaskItem task={v.item} />}
      />
    </>
  );
}
