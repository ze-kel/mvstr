import type { SvgProps } from "react-native-svg";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle, ClipPath, Defs, G, Path } from "react-native-svg";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useGlobalSearchParams } from "expo-router";
import { format, isToday, setDefaultOptions } from "date-fns";
import { ru } from "date-fns/locale";

import type { ITask, IWish } from "@acme/api";

import { Button } from "~/app/_components/button";
import { IconCheck, IconPlus } from "~/app/_components/icons";
import Spinner from "~/app/_components/spinner";
import { api } from "~/utils/api";

setDefaultOptions({ locale: ru });

const WishItem = ({ wish }: { wish: IWish }) => {
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();

  return (
    <Link
      asChild
      href={{
        pathname: "/event/[eventId]/wishlist/modal/[wishId]",
        params: { eventId: eventId, wishId: wish.id },
      }}
    >
      <Pressable
        className="flex w-fit flex-col items-center"
        style={{ width: "48%" }}
      >
        <View className="">
          <View className="flex w-full overflow-hidden rounded-[20px]">
            {wish.image && (
              <Image
                source={{
                  uri: wish.image,
                }}
                style={{
                  flex: 1,
                  minWidth: 100,
                  minHeight: 100,
                  aspectRatio: 1,
                }}
              />
            )}
          </View>

          <Text className="captionXL mt-2 w-full">{wish.title}</Text>
          <Text className="textM mt-0.5 w-full">{wish.price}</Text>
        </View>
      </Pressable>
    </Link>
  );
};

export default function Index() {
  const { eventId } = useGlobalSearchParams<{ eventId: string }>();

  const event = api.events.get.useQuery(eventId);
  const utils = api.useUtils();
  const { data, isFetching, error, isPending } =
    api.wish.getAllWishes.useQuery();

  if (isPending) {
    return <Spinner />;
  }

  return (
    <FlatList
      className="pt-7"
      data={data}
      refreshControl={
        <RefreshControl
          refreshing={isFetching}
          onRefresh={async () => {
            await utils.tasks.getTasksForEvent.refetch({ id: eventId });
          }}
        />
      }
      horizontal={false}
      numColumns={2}
      columnWrapperClassName="justify-between"
      contentContainerClassName="mt-3 flex flex-col gap-2"
      ListHeaderComponent={
        <View className="flex flex-row items-start justify-between" style={{}}>
          <View>
            <Text
              className=""
              style={{
                fontSize: 22,
                fontFamily: "NeueMachina-Ultrabold",
              }}
            >
              Список желаний
            </Text>
          </View>

          <Link
            asChild
            href={{
              pathname: "/event/[eventId]/wishlist/modal/[wishId]",
              params: { eventId, wishId: "create" },
            }}
          >
            <Button size="sIcon" icon>
              <IconPlus width={18} height={18} fill={"white"} />
            </Button>
          </Link>
        </View>
      }
      keyExtractor={(item) => item.id}
      renderItem={(v) => <WishItem wish={v.item} />}
    ></FlatList>
  );
}
