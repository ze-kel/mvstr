import type { ImageStyle } from "expo-image";
import type { StyleProp } from "react-native";
import { Image } from "expo-image";

import type { IUser } from "@acme/api";

import { ImageWithDefaults } from "~/app/_components/imageWithDefaults";

export const UserAvatar = ({
  user,
  style,
  gender,
  className,
}: {
  user: IUser;
  gender?: string;
  className?: string;
  style?: StyleProp<ImageStyle>;
}) => {
  const g = user.registered ? user.gender : gender;

  const src = g === "female" ? "default/girl" : "default/boy";

  return (
    <ImageWithDefaults
      className={className}
      image={user.profileImage}
      defaultImage={src}
      style={style}
    />
  );
};
