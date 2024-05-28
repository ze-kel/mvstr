import type { ExpoRouter } from "expo-router/types/expo-router";
import { Pressable, SafeAreaView, Text, View } from "react-native";
import { Image } from "expo-image";
import { Link, useGlobalSearchParams, useLocalSearchParams } from "expo-router";
import Logo from "@assets/logo.png";

import { Button } from "~/app/_components/button";
import { EventAvatar } from "~/app/_components/eventAvatar";
import { IconChevronLeft, IconPlus } from "~/app/_components/icons";
import { UserAvatar } from "~/app/_components/userAvatar";
import { api } from "~/utils/api";
import { cn } from "~/utils/cn";
import { useHandleError } from "~/utils/useHandleError";

export const PageHeader = ({
  title,
  buttonHref,
  customIcon,
  className,
  underTitle,
  buttonHandler,
}: {
  title: string;
  buttonHref?: ExpoRouter.Href;
  customIcon?: JSX.Element;
  className?: string;
  underTitle?: JSX.Element;
  buttonHandler?: () => void;
}) => {
  const b = (
    <Button onPress={buttonHandler} size="sIcon" icon className="items-center">
      {customIcon ? (
        customIcon
      ) : (
        <IconPlus width={18} height={18} fill={"white"} />
      )}
    </Button>
  );

  return (
    <View className="pb-2 pt-4">
      <View
        className={cn(
          "flex flex-row items-center justify-between px-4",
          className,
        )}
      >
        <View>
          <Text
            className=""
            style={{
              fontSize: 22,
              fontFamily: "NeueMachina-Ultrabold",
            }}
          >
            {title}
          </Text>
          {underTitle}
        </View>

        {buttonHref && (
          <Link asChild href={buttonHref}>
            {b}
          </Link>
        )}

        {buttonHandler && b}

        {!buttonHandler && !buttonHref && (
          <View style={{ height: 36, width: 36 }} />
        )}
      </View>
    </View>
  );
};

export const UserMenu = () => {
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();

  const u = api.user.getMe.useQuery();
  useHandleError(u.error);

  if (!u.data) return <></>;

  return (
    <>
      <Link
        asChild
        href={{ pathname: "/modals/me?eventId=[eventId]", params: { eventId } }}
      >
        <Pressable>
          <UserAvatar
            user={u.data}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              resizeMode: "contain",
              display: "flex",
            }}
          />
        </Pressable>
      </Link>
    </>
  );
};

const EventHead = () => {
  const { eventId, taskId } = useLocalSearchParams<{
    eventId: string;
    taskId: string;
  }>();
  const event = api.events.get.useQuery(eventId || "");

  return (
    <View className="flex flex-row items-center">
      <Link href={"/home/main"} asChild>
        <Pressable className="flex h-[44px] items-center justify-center  px-3.5">
          <IconChevronLeft
            width={20}
            height={20}
            fill={"rgba(86, 58, 220, 1)"}
          />
        </Pressable>
      </Link>

      <View
        style={{
          borderWidth: 1,
          padding: 3,
          borderRadius: 12,
          marginRight: 8,
          borderColor: "rgba(86, 58, 220, 1)",
        }}
      >
        <EventAvatar
          image={event.data?.image || ""}
          style={{
            width: 36,
            height: 36,
            resizeMode: "contain",
            display: "flex",
            borderRadius: 10,
          }}
        />
      </View>
      <Text
        className="text-xl font-bold"
        style={{ fontFamily: "NeueMachina-Ultrabold" }}
      >
        {event.data?.name}
      </Text>
    </View>
  );
};

const TitleHead = () => {
  return (
    <View className="flex flex-row items-center gap-2 px-4">
      <Image
        source={Logo}
        style={{
          width: 36,
          height: 36,
          resizeMode: "contain",
          display: "flex",
        }}
      />
      <Text
        className="text-xl font-bold"
        style={{ fontFamily: "NeueMachina-Ultrabold" }}
      >
        Место Встречи
      </Text>
    </View>
  );
};

export const TitleUserHeader = ({
  forceTitle,
  hideUser,
}: {
  hideUser?: boolean;
  forceTitle?: boolean;
}) => {
  const { eventId } = useLocalSearchParams<{
    eventId?: string;
  }>();

  return (
    <SafeAreaView className="bg-surface-secondary">
      <View className="flex w-full py-6">
        <View className="flex flex-row items-center justify-between">
          {!eventId || forceTitle ? <TitleHead /> : <EventHead />}
          <View className="px-4">{!hideUser && <UserMenu />}</View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export const EmptyList = ({
  text,
  subtext,
  image,
  buttonText,
  buttonHref,
  className,
}: {
  text?: string | JSX.Element;
  subtext?: string | JSX.Element;
  image?: string;
  buttonText?: string;
  buttonHref?: ExpoRouter.Href;
  className?: string;
}) => {
  return (
    <View
      className={cn(
        "flex h-full flex-col items-center justify-center",
        className,
      )}
    >
      {image && <Image source={image} style={{ width: 170, height: 170 }} />}
      {text && <Text className="subHeadingL  text-center">{text}</Text>}
      {subtext && <Text className="textL mt-1 text-center">{subtext}</Text>}
      {buttonHref && (
        <Link href={buttonHref} asChild>
          <Button size={"s"} className="mt-4">
            {buttonText}
          </Button>
        </Link>
      )}
    </View>
  );
};
