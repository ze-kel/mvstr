import React from "react";
import { Image, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export default function Spinner() {
  const randomWidth = useSharedValue(0);

  const config = {
    duration: 1000,
    easing: Easing.linear,
  };

  React.useEffect(() => {
    randomWidth.value = withRepeat(withTiming(1, config), 100);
  }, []);

  const style = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${randomWidth.value * 360}deg` }],
    };
  });

  return (
    <View className="flex h-full w-full items-center justify-center">
      <Animated.View
        style={[
          {
            transformOrigin: "center center",
            width: 50,
            height: 50,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
          style,
        ]}
      >
        <Image
          source={require("@assets/spinner.png")}
          style={{ width: 50, resizeMode: "contain", display: "flex" }}
        />
      </Animated.View>
    </View>
  );
}
