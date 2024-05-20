import type { ImageStyle, StyleProp } from "react-native";
import { Image, View } from "react-native";
import DefaultCool from "@assets/defImages/cool.jpg";
import DefaultCrazy from "@assets/defImages/crazy.jpg";
import DefaultLove from "@assets/defImages/love.jpg";
import DefaultParty from "@assets/defImages/party.jpg";

const defaultImagesMap = {
  "default/cool": DefaultCool,
  "default/crazy": DefaultCrazy,
  "default/love": DefaultLove,
  "default/party": DefaultParty,
};

export const defaultEventImages = Object.keys(defaultImagesMap);

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
    <Image
      className={className}
      source={
        defaultImagesMap[image] || image || defaultImagesMap["default/cool"]
      }
      style={style}
    />
  );
};
