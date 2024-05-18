import type { ImageStyle } from "expo-image";
import type { StyleProp } from "react-native";
import { Image } from "expo-image";
import DefaultBoy from "@assets/defaultBoy.png";
import DefaultGirl from "@assets/defaultGirl.png";

import type { IUser } from "@acme/api";

export const UserAvatar = ({
  user,
  style,
  className,
}: {
  user: IUser;
  className?: string;
  style?: StyleProp<ImageStyle>;
}) => {
  const src =
    user.profileImage || user.gender === "female" ? DefaultGirl : DefaultBoy;

  return <Image className={className} source={src} style={style} />;
};
