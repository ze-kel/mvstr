import type { ImageStyle, StyleProp } from "react-native";

import { ImageWithDefaults } from "~/app/_components/imageWithDefaults";

export const EventAvatar = ({
  image,
  style,
  className,
}: {
  image?: string;
  className?: string;
  style?: StyleProp<ImageStyle>;
}) => {
  return (
    <ImageWithDefaults
      className={className}
      image={image}
      defaultImage="default/cool"
      style={style}
    />
  );
};
