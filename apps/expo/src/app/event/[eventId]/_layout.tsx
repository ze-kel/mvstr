import * as React from "react";
import { SafeAreaView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs, useGlobalSearchParams, usePathname } from "expo-router";

import {
  IconAll,
  IconPeople,
  IconPlus,
  IconTasks,
  IconWishList,
} from "~/app/_components/icons";
import { api } from "~/utils/api";

/*

            "rgba(223, 203, 255, 0.4)",
            "rgba(239, 238, 246, 0.4)",
            "rgba(242, 241, 246, 0.4)",
*/

const MainHeader = () => {
  const { eventId, taskId } = useGlobalSearchParams<{
    eventId: string;
    taskId: string;
  }>();

  const event = api.events.get.useQuery(eventId);

  return (
    <>
      <SafeAreaView>
        <LinearGradient
          colors={["rgba(223, 203, 255, 0.4)", "rgba(223, 203, 255, 0.4)"]}
          style={{
            height: 300,
            width: "100%",
            position: "absolute",
            zIndex: 0,
            elevation: 0,
          }}
        />
        <View className="flex w-full">
          <View className="flex flex-row items-center justify-between px-[16px] py-4">
            <View className="flex flex-row items-center gap-2 ">
              <Text
                className="text-xl font-bold"
                style={{ fontFamily: "NeueMachina-Ultrabold" }}
              >
                {event.data?.name}
              </Text>
            </View>

            <View>
              <Text>user</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </>
  );
};

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <View
    className="flex h-full w-full items-center justify-center"
    style={{
      position: "absolute",
      top: 0,
      height: 60,
    }}
  >
    {children}
  </View>
);

export default function TabLayout() {
  return (
    <>
      <MainHeader />
      <Tabs
        sceneContainerStyle={{
          overflow: "hidden",
          borderRadius: 28,
          backgroundColor: "rgba(254, 254, 254, 1)",
          paddingHorizontal: 16,
        }}
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            height: 60,
            position: "absolute",
            bottom: 40,
            marginHorizontal: 16,
            borderRadius: 100,
            justifyContent: "center",
            borderWidth: 1,
            borderColor: "rgba(236, 236, 236, 1)",
            shadowColor: "rgba(51, 65, 85)",
            shadowRadius: 20,
            shadowOffset: {
              width: 10,
              height: 10,
            },
            shadowOpacity: 0.1,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <IconWrapper>
                <IconAll
                  width={20}
                  height={20}
                  fill={
                    focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"
                  }
                />
              </IconWrapper>
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <IconWrapper>
                <IconTasks
                  width={20}
                  height={20}
                  fill={
                    focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"
                  }
                />
              </IconWrapper>
            ),
          }}
        />

        <Tabs.Screen
          name="create"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <IconWrapper>
                <IconPlus
                  width={20}
                  height={20}
                  fill={
                    focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"
                  }
                />
              </IconWrapper>
            ),
          }}
        />
        <Tabs.Screen
          name="people"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <IconWrapper>
                <IconPeople
                  width={20}
                  height={20}
                  fill={
                    focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"
                  }
                />
              </IconWrapper>
            ),
          }}
        />
        <Tabs.Screen
          name="wishlist"
          options={{
            tabBarLabel: () => null,
            tabBarIcon: ({ focused }) => (
              <IconWrapper>
                <IconWishList
                  width={20}
                  height={20}
                  fill={
                    focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"
                  }
                />
              </IconWrapper>
            ),
          }}
        />
      </Tabs>
    </>
  );
}
