import * as React from "react";
import { useColorScheme, View } from "react-native";
import Svg, { ClipPath, Defs, G, Path } from "react-native-svg";
import { Tabs } from "expo-router";

const IconAll = ({ focused }: { focused: boolean }) => (
  <View
    className="flex h-full w-full items-center justify-center"
    style={{
      position: "absolute",
      top: 0,
      height: 60,
    }}
  >
    <Svg
      width={20}
      height={20}
      fill={focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"}
    >
      <Path d="M5.833 0h-2.5A3.333 3.333 0 0 0 0 3.333v2.5a3.333 3.333 0 0 0 3.333 3.334h2.5a3.333 3.333 0 0 0 3.334-3.334v-2.5A3.333 3.333 0 0 0 5.833 0ZM16.666 0h-2.5a3.333 3.333 0 0 0-3.333 3.333v2.5a3.333 3.333 0 0 0 3.333 3.334h2.5A3.333 3.333 0 0 0 20 5.833v-2.5A3.333 3.333 0 0 0 16.666 0ZM5.833 10.833h-2.5A3.333 3.333 0 0 0 0 14.167v2.5A3.333 3.333 0 0 0 3.333 20h2.5a3.333 3.333 0 0 0 3.334-3.333v-2.5a3.333 3.333 0 0 0-3.334-3.334ZM16.666 10.833h-2.5a3.333 3.333 0 0 0-3.333 3.334v2.5A3.333 3.333 0 0 0 14.166 20h2.5A3.333 3.333 0 0 0 20 16.667v-2.5a3.333 3.333 0 0 0-3.334-3.334Z" />
    </Svg>
  </View>
);

const IconTasks = ({ focused }: { focused: boolean }) => (
  <View
    className="flex h-full w-full items-center justify-center"
    style={{
      position: "absolute",
      top: 0,
      height: 60,
    }}
  >
    <Svg
      width={20}
      height={20}
      fill={focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"}
    >
      <Path d="M19.828 15a4.148 4.148 0 0 1-1.049 1.754l-2.025 2.025A4.15 4.15 0 0 1 15 19.828v-3.995c0-.46.374-.833.833-.833h3.995ZM20 4.167v9.166h-4.167a2.503 2.503 0 0 0-2.5 2.5V20H4.167A4.171 4.171 0 0 1 0 15.833V4.167A4.171 4.171 0 0 1 4.167 0h11.666A4.171 4.171 0 0 1 20 4.167ZM5.833 14.583a1.25 1.25 0 1 0-2.5.001 1.25 1.25 0 0 0 2.5 0Zm0-4.583a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Zm0-4.583a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0Z" />
    </Svg>
  </View>
);

const IconAdd = ({ focused }: { focused: boolean }) => (
  <View
    className="flex h-full w-full items-center justify-center"
    style={{
      position: "absolute",
      top: 0,
      height: 60,
    }}
  >
    <Svg
      width={24}
      height={24}
      fill={focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"}
    >
      <Path d="M3.598 13.2a1.2 1.2 0 0 1 0-2.4h16.8a1.2 1.2 0 1 1 0 2.4h-16.8Z" />
      <Path d="M13.198 20.4a1.2 1.2 0 1 1-2.4 0V3.6a1.2 1.2 0 0 1 2.4 0v16.8Z" />
    </Svg>
  </View>
);

const IconPeople = ({ focused }: { focused: boolean }) => (
  <View
    className="flex h-full w-full items-center justify-center"
    style={{
      position: "absolute",
      top: 0,
      height: 60,
    }}
  >
    <Svg
      width={24}
      height={24}
      fill={focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"}
    >
      <G clipPath="url(#a)">
        <Path d="M6.25 10.833a3.75 3.75 0 1 1 0-7.499 3.75 3.75 0 0 1 0 7.5ZM11.667 20H.833A.833.833 0 0 1 0 19.167v-.417a6.25 6.25 0 0 1 12.5 0v.417a.833.833 0 0 1-.833.833Zm2.916-12.5a3.75 3.75 0 1 1 0-7.5 3.75 3.75 0 0 1 0 7.5ZM13.4 9.184a5.687 5.687 0 0 0-3.891 2.36 7.948 7.948 0 0 1 4.095 4.29h5.564A.834.834 0 0 0 20 15v-.032a5.84 5.84 0 0 0-6.6-5.784Z" />
      </G>
      <Defs>
        <ClipPath id="a">
          <Path d="M0 0h20v20H0z" />
        </ClipPath>
      </Defs>
    </Svg>
  </View>
);

const IconWishlist = ({ focused }: { focused: boolean }) => (
  <View
    className="flex h-full w-full items-center justify-center"
    style={{
      position: "absolute",
      top: 0,
      height: 60,
    }}
  >
    <Svg
      width={20}
      height={20}
      fill={focused ? "rgba(86, 58, 220, 1)" : "rgba(61, 56, 73, 1)"}
    >
      <Path d="M18.327 17.64c-.012.13-.025.23-.04.277A2.918 2.918 0 0 1 15.493 20H5.2a3.73 3.73 0 0 0 .633-2.083c0-1.151.933-2.084 2.084-2.084h8.748c.975 0 1.75.836 1.66 1.807h.002ZM12.75 9.87l2.257-1.51 2.295 1.494a.835.835 0 0 0 1.245-.96l-.815-2.483 1.971-1.606a.834.834 0 0 0-.536-1.47h-2.501L15.78.85a.834.834 0 0 0-1.562 0l-.885 2.483h-2.5a.833.833 0 0 0-.539 1.469l1.98 1.611-.783 2.514a.835.835 0 0 0 1.258.943V9.87Zm3.083 2.573v1.724H7.918a3.753 3.753 0 0 0-3.751 3.754 2.085 2.085 0 0 1-2.342 2.064C.759 19.857 0 18.875 0 17.8V4.162C0 1.86 1.866 0 4.167 0h7.608a6.682 6.682 0 0 0-2.953 3.333H4.167a.833.833 0 1 0 0 1.667H8.39c-.034.273-.058.55-.058.833 0 .283.024.56.058.834H4.167a.833.833 0 1 0 0 1.666h4.655A6.665 6.665 0 0 0 15 12.5c.283 0 .56-.023.833-.057Zm-6.666-1.61A.833.833 0 0 0 8.333 10H4.167a.833.833 0 1 0 0 1.667h4.166c.46 0 .834-.373.834-.834Z" />
    </Svg>
  </View>
);

export default function TabLayout() {
  const colorScheme = useColorScheme();

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
          tabBarIcon: IconAll,
        }}
      />
      <Tabs.Screen
        name="tasks"
        options={{
          header: () => null,
          tabBarLabel: () => null,
          tabBarIcon: IconTasks,
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          header: () => null,
          tabBarLabel: () => null,
          tabBarIcon: IconAdd,
        }}
      />
      <Tabs.Screen
        name="people"
        options={{
          header: () => null,
          tabBarLabel: () => null,
          tabBarIcon: IconPeople,
        }}
      />
      <Tabs.Screen
        name="wishlist"
        options={{
          header: () => null,
          tabBarLabel: () => null,
          tabBarIcon: IconWishlist,
        }}
      />
    </Tabs>
  );
}
