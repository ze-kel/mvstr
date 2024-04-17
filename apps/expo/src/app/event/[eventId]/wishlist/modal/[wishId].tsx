import { useRef } from "react";
import { ScrollView, Text, View } from "react-native";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";

import type { INewWish, IWish } from "@acme/api";

import { Button } from "~/app/_components/button";
import { Input } from "~/app/_components/input";
import { api } from "~/utils/api";

const WishEditor = ({
  initial,
  handleSave,
}: {
  initial?: Partial<IWish>;
  handleSave: (v: Partial<IWish>) => Promise<void>;
}) => {
  const wish = useRef<Partial<IWish>>(
    initial || {
      title: "",
      description: "",
    },
  );

  const m = api.wish.getUrlInfo.useMutation();

  const metaHandler = async () => {};

  return (
    <ScrollView className="rounded-[28px] bg-surface-inverse px-4 pb-32 pt-6">
      <Text className="subHeadingM">Ссылка на подарок</Text>
      <Input
        defaultValue={wish.current.link || ""}
        onChangeText={(v) => (wish.current.link = v)}
        className="mt-3"
        placeholder="Cсылку из интернет-магазина"
        autoFocus
      />
      <Text className="subHeadingM mt-3">Картинка</Text>
      <Input
        defaultValue={wish.current.image || ""}
        onChangeText={(v) => (wish.current.image = v)}
        className="mt-3"
        placeholder="урл"
        autoFocus
      />
      <Text className="subHeadingM mt-4">Название</Text>
      <Input
        defaultValue={wish.current.title || ""}
        onChangeText={(v) => (wish.current.title = v)}
        className="mt-3"
        placeholder="Введите название"
        autoFocus
      />
      <Text className="subHeadingM mt-4">Цена подарка</Text>
      <Input
        defaultValue={wish.current.price || ""}
        onChangeText={(v) => (wish.current.price = v)}
        className="mt-3"
        placeholder="1000 р."
      />
      <Text className="subHeadingM mt-4">Описание подарка</Text>
      <Input
        defaultValue={wish.current.description || ""}
        multiline
        onChangeText={(v) => (wish.current.description = v)}
        className="mt-3 h-32"
        placeholder="Какой то дополнительный комментарий"
      />
      <Button
        className="mt-6"
        onPress={() => {
          void handleSave(wish.current);
        }}
      >
        Сохранить
      </Button>
    </ScrollView>
  );
};

const EditMode = () => {
  const { eventId, wishId } = useGlobalSearchParams<{
    eventId: string;
    wishId: string;
  }>();

  const { data, isLoading, error } = api.wish.getAllWishes.useQuery();

  const router = useRouter();
  const utils = api.useUtils();

  const currentOne = data?.find((v) => v.id === wishId);

  // Note that Im not revalidating here becuase that will automatically happen
  // when we navigate to other page after saving
  const mutate = api.wish.updateWish.useMutation({
    onMutate: (updatedWish) => {
      console.log("MUTATING", updatedWish);

      utils.wish.getAllWishes.setData(undefined, (data) => {
        if (!data) return data;

        const u = data.map((t) => {
          if (t.id !== updatedWish.wishId) return t;

          return { ...t, ...updatedWish.update };
        });

        return u;
      });
    },
  });

  const handler = async (v: Partial<IWish>) => {
    mutate.mutateAsync({ wishId, update: v });
    router.navigate({
      pathname: "/event/[eventId]/wishlist/",
      params: { eventId },
    });
  };

  if (isLoading) {
    return (
      <View>
        <Text>loading</Text>
      </View>
    );
  }

  if (!currentOne)
    return (
      <Redirect
        href={{ pathname: "/event/[eventId]/wishlist", params: { eventId } }}
      ></Redirect>
    );

  return (
    <View>
      <WishEditor initial={currentOne} handleSave={handler}></WishEditor>
    </View>
  );
};

const CreateMode = () => {
  const { eventId } = useGlobalSearchParams<{
    eventId: string;
    wishId: string;
  }>();

  const router = useRouter();

  const mutate = api.wish.addWish.useMutation({});

  const handler = async (v: INewWish) => {
    await mutate.mutateAsync(v);
    router.replace({
      pathname: "/event/[eventId]/wishlist/",
      params: { eventId },
    });
  };

  return (
    <WishEditor
      initial={{ title: "", description: "" }}
      handleSave={handler}
    ></WishEditor>
  );
};

const CreationModal = () => {
  const { wishId } = useGlobalSearchParams<{
    eventId: string;
    wishId: string;
  }>();

  if (wishId === "create") return <CreateMode />;

  return <EditMode />;
};

export default CreationModal;
