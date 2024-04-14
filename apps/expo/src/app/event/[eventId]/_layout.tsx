import * as React from "react";
import { Text, View } from "react-native";
import { Tabs } from "expo-router";

import {
  IconAll,
  IconPeople,
  IconPlus,
  IconTasks,
  IconWishList,
} from "~/app/_components/icons";

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
    <Tabs
      screenOptions={{
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
          header: () => null,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <IconWrapper>
              <IconAll
                width={20}
                height={20}
                fill={focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"}
              />
            </IconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          header: () => null,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <IconWrapper>
              <IconTasks
                width={20}
                height={20}
                fill={focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"}
              />
            </IconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          header: () => null,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <IconWrapper>
              <IconPlus
                width={20}
                height={20}
                fill={focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"}
              />
            </IconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          header: () => null,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <IconWrapper>
              <IconPeople
                width={20}
                height={20}
                fill={focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"}
              />
            </IconWrapper>
          ),
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          header: () => null,
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => (
            <IconWrapper>
              <IconWishList
                width={20}
                height={20}
                fill={focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"}
              />
            </IconWrapper>
          ),
        }}
      />
    </Tabs>
  );
}
