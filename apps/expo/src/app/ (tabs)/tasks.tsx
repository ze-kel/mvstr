import type { SvgProps } from "react-native-svg";
import { useState } from "react";
import { FlatList, Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";
import { LinearGradient } from "expo-linear-gradient";
import { Redirect, Stack, useRootNavigationState } from "expo-router";
import { TRPCClientError } from "@trpc/client";
import { format, isToday, setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";

import type { IEvent, IUser } from "@acme/api";

import { api } from "~/utils/api";
import { clearAuthTOken, getAuthToken } from "~/utils/auth";

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

  return (
    <View className="px-4">
      <View className="mt-2 flex flex-row items-center rounded-xl bg-surface-secondary p-3">
        <View className="mt-2 h-11 w-11"></View>
        <View className="flex flex-col gap-1.5">
          <Text className="subHeadingL">{task.title}</Text>
          <View className="flex flex-row items-center gap-1">
            <IconCalendar
              fill={today ? "rgba(33, 186, 114, 1)" : "rgba(86, 58, 220, 1)"}
            />
            <Text
              style={{
                fontFamily: "Nunito-Bold",
                fontSize: 10,
                lineHeight: 14,
                color: today ? "rgba(33, 186, 114, 1)" : "rgba(86, 58, 220, 1)",
              }}
            >
              {task.time ? format(task.time, "d MMMM") : "Без даты"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

interface ITask {
  id: string;
  title: string;
  description?: string;
  time?: Date;
  completed?: boolean;
  parent?: string;
}

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const token = getAuthToken();

  const [tasks, setTasks] = useState<ITask[]>([
    {
      id: "1",
      title: "Купить продукты",
      description: "Не забудь купить перец и огурцы",
      time: new Date(2024, 6, 1, 18, 15),
      completed: false,
    },
    {
      id: "2",
      title: "Арендовать место",
      time: new Date(2024, 6, 1, 10, 0),
      completed: false,
    },
    {
      id: "3",
      title: "Купить алкоголь",
      description: "Водку и вино",
      time: new Date(2024, 6, 1, 13, 15),
      completed: false,
    },
  ]);

  if (rootNavigationState.key) {
    if (!token) {
      return <Redirect href={"/login/"} />;
    }

    /*

    if (error instanceof TRPCClientError && error.message === "UNAUTHORIZED") {
      clearAuthTOken();
      return <Redirect href={"/login/"} />;
    }
    */
  }

  return (
    <View className="bg-surface-secondary">
      <SafeAreaView />
      <LinearGradient
        colors={[
          "rgba(223, 203, 255, 0.4)",
          "rgba(239, 238, 246, 0.4)",
          "rgba(242, 241, 246, 0.4)",
        ]}
        style={{ height: 300, width: "100%", position: "absolute" }}
      />

      <View className="absolute bottom-0 left-0 h-1/2 w-full bg-surface-inverse"></View>

      <View className="flex h-full w-full ">
        <View className="flex flex-row items-center justify-between px-[16px]">
          <View className="flex flex-row items-center gap-2">
            <Text
              className="text-xl font-bold"
              style={{ fontFamily: "NeueMachina-Ultrabold" }}
            >
              Название текущей штуки
            </Text>
          </View>

          <View>
            <Text>user</Text>
          </View>
        </View>

        <View
          className="flex bg-surface-inverse"
          style={{
            flex: 1,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
          }}
        >
          <FlatList
            className=""
            data={tasks}
            ListHeaderComponent={
              <View className="px-4" style={{}}>
                <Text
                  className="pb-4 pt-7"
                  style={{
                    fontSize: 22,
                    fontFamily: "NeueMachina-Ultrabold",
                  }}
                >
                  Мои мероприятия
                </Text>
              </View>
            }
            keyExtractor={(item) => item.id}
            renderItem={(v) => <TaskItem task={v.item} />}
          ></FlatList>
        </View>
      </View>
    </View>
  );
}
