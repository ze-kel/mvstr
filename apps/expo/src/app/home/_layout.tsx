import React from "react";
import { Tabs } from "expo-router";

import {
  IconAll,
  IconPeople,
  IconPlus,
  IconWishList,
} from "~/app/_components/icons";
import { TitleUserHeader } from "~/app/_components/layoutElements";
import { IconWrapper } from "~/app/event/[eventId]/_layout";

export default function TabLayout() {
  return (
    <>
      <TitleUserHeader forceTitle />
      <Tabs
        sceneContainerStyle={{
          overflow: "hidden",
          borderRadius: 28,
          backgroundColor: "rgba(254, 254, 254, 1)",
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
