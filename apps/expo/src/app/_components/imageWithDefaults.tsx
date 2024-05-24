import type { ImageStyle, StyleProp } from "react-native";
import { Image } from "expo-image";
import A1 from "@assets/avatars/1.jpg";
import A2 from "@assets/avatars/2.jpg";
import A3 from "@assets/avatars/3.jpg";
import A4 from "@assets/avatars/4.jpg";
import A5 from "@assets/avatars/5.jpg";
import A6 from "@assets/avatars/6.jpg";
import A7 from "@assets/avatars/7.jpg";
import A8 from "@assets/avatars/8.jpg";
import A9 from "@assets/avatars/9.jpg";
import A10 from "@assets/avatars/10.jpg";
import DefaultBoy from "@assets/defaultBoy.png";
import DefaultGirl from "@assets/defaultGirl.png";
import DefaultCool from "@assets/defImages/cool.jpg";
import DefaultCrazy from "@assets/defImages/crazy.jpg";
import DefaultLove from "@assets/defImages/love.jpg";
import DefaultParty from "@assets/defImages/party.jpg";

export const defaultEventPics = {
  "default/cool": DefaultCool,
  "default/crazy": DefaultCrazy,
  "default/love": DefaultLove,
  "default/party": DefaultParty,
};
export const defaultEventPicsArray = Object.keys(defaultEventPics);

export const defaultUserPics = {
  "default/a1": A1,
  "default/a2": A2,
  "default/a3": A3,
  "default/a4": A4,
  "default/a5": A5,
  "default/a6": A6,
  "default/a7": A7,
  "default/a8": A8,
  "default/a9": A9,
  "default/a10": A10,
};

export const defaultUserPicsArray = Object.keys(defaultUserPics);

const allDefaults = {
  ...defaultEventPics,
  ...defaultUserPics,
  "default/boy": DefaultBoy,
  "default/girl": DefaultGirl,
};

const findImage = (image?: string) => {
  if (image && image in allDefaults) {
    return allDefaults[image] as string;
  }
  return image;
};

export const ImageWithDefaults = ({
  image,
  defaultImage,
  style,
  className,
}: {
  image?: string | null;
  defaultImage: string;
  className?: string;
  style?: StyleProp<ImageStyle>;
}) => {
  return (
    <Image
      className={className}
      source={findImage(image) || findImage(defaultImage)}
      style={style}
    />
  );
};
