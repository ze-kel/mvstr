import type { Action } from "expo-image-manipulator";
import { useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Image } from "expo-image";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";

import type { INewWish, IWish } from "@acme/api";

import { Button } from "~/app/_components/button";
import { IconPlus } from "~/app/_components/icons";
import { Input } from "~/app/_components/input";
import Spinner from "~/app/_components/spinner";
import { api } from "~/utils/api";

export const ImageUploader = ({
  value,
  onChange,
  actions,
}: {
  value?: string;
  onChange: (v: string) => void;
  actions: Action[];
}) => {
  const [state, setState] = useState(value);
  const [isLoading, setIsLoading] = useState(false);

  const uploadImage = api.images.uploadImage.useMutation();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setIsLoading(true);
      const b = await manipulateAsync(result.assets[0].uri, actions, {
        compress: 0.35,
        format: SaveFormat.JPEG,
        base64: true,
      });

      const res = await uploadImage.mutateAsync({
        file: b.base64!,
        extension: "jpg",
      });
      setState(res);
      setIsLoading(false);
      onChange(res);
    }
  };

  return (
    <View>
      <Pressable onPress={pickImage}>
        <View className="flex flex-row items-center gap-4">
          <View className="flex w-[60px] flex-row items-center justify-between">
            <View className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-3xl border border-dashed border-black ">
              <IconPlus style={{ width: 15, height: 15 }} />
            </View>

            <Image
              source={{
                uri: state,
              }}
              style={{
                borderRadius: 16,
                flex: 0,
                width: 60,
                height: 60,
                aspectRatio: 1,
              }}
            />
            {isLoading && (
              <View className="absolute left-0 top-0 h-full w-full ">
                <View className="absolute left-0 top-0 h-full w-full bg-white opacity-60"></View>
                {true && <Spinner />}
              </View>
            )}
          </View>
          <View>
            <Text className="subHeadingM">
              {state && !state.startsWith("default/")
                ? "Заменить изображение"
                : "Загрузить изображение"}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

interface WishEditorProps {
  initial?: Omit<IWish, "id">;
  handleSave: (v: Omit<Omit<IWish, "id">, "userId">) => Promise<void>;
}

const WishEditor = ({ initial, handleSave }: WishEditorProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const wish = useRef<Partial<IWish>>(
    initial ?? {
      title: "",
      description: "",
    },
  );

  const { wishId } = useGlobalSearchParams<{
    eventId: string;
    wishId: string;
  }>();

  return (
    <KeyboardAwareScrollView className="rounded-[28px] bg-surface-inverse px-4">
      <View className="pb-4 pt-7">
        <Text className="headingS text-center">
          {wishId !== "create" ? "Изменить желание" : "Добавить желание"}
        </Text>

        <Text className="textXXL mb-5 mt-1.5 text-center">
          Вы можете изменить или добавить новую информацию о подарке
        </Text>

        <Text className="subHeadingM">Ссылка на подарок</Text>
        <Input
          defaultValue={wish.current.link ?? ""}
          onChangeText={(v) => (wish.current.link = v)}
          className="mt-3"
          placeholder="Cсылку из интернет-магазина"
        />
        <Text className="subHeadingM mt-3">Картинка</Text>

        <ImageUploader
          value={wish.current.image ?? undefined}
          actions={[{ resize: { width: 750, height: 750 } }]}
          onChange={(v) => (wish.current.image = v)}
        />
        <Text className="subHeadingM mt-4">Название</Text>
        <Input
          defaultValue={wish.current.title ?? ""}
          onChangeText={(v) => (wish.current.title = v)}
          className="mt-3"
          placeholder="Введите название"
        />
        <Text className="subHeadingM mt-4">Цена подарка</Text>
        <Input
          keyboardType="numeric"
          defaultValue={wish.current.price ?? ""}
          onChangeText={(v) => (wish.current.price = v)}
          className="mt-3"
          placeholder="1000 р."
        />
        <Text className="subHeadingM mt-4">Описание подарка</Text>
        <Input
          defaultValue={wish.current.description ?? ""}
          multiline
          onChangeText={(v) => (wish.current.description = v)}
          className="mt-3 h-32"
          placeholder="Какой то дополнительный комментарий"
        />
        <Button
          className="mt-6"
          loading={isLoading}
          onPress={async () => {
            setIsLoading(true);
            await handleSave(wish.current);
            setIsLoading(false);
          }}
        >
          Сохранить
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
};

const EditMode = () => {
  const { eventId, wishId } = useGlobalSearchParams<{
    eventId: string;
    wishId: string;
  }>();

  const { data, isLoading } = api.wish.getAllWishes.useQuery(undefined, {
    refetchOnMount: false,
  });

  const router = useRouter();
  const utils = api.useUtils();

  const currentOne = data?.find((v) => v.id === wishId);

  // Note that Im not revalidating here becuase that will automatically happen
  // when we navigate to other page after saving
  const mutate = api.wish.updateWish.useMutation({
    onSuccess: (updatedWish) => {
      utils.wish.getAllWishes.invalidate();
      if (eventId) {
        utils.events.getWishes.invalidate(eventId);
      }
    },
  });

  const handler = async (v: Partial<IWish>) => {
    if (wishId) {
      await mutate.mutateAsync({ wishId, update: v });
    }

    router.dismiss();
  };

  if (isLoading) {
    return (
      <View>
        <Spinner />
      </View>
    );
  }

  if (!currentOne) {
    if (eventId) {
      return (
        <Redirect
          href={{
            pathname: "/event/[eventId]/wishlist/",
            params: { eventId },
          }}
        ></Redirect>
      );
    }
    return (
      <Redirect
        href={{
          pathname: "/home/main/wishlist/",
          params: { eventId },
        }}
      ></Redirect>
    );
  }

  return <WishEditor initial={currentOne} handleSave={handler}></WishEditor>;
};

const CreateMode = () => {
  const { eventId } = useGlobalSearchParams<{
    eventId: string;
    wishId: string;
  }>();

  const router = useRouter();

  const utils = api.useUtils();

  const mutate = api.wish.addWish.useMutation({});
  const mutateToEvent = api.events.addWish.useMutation({});

  const handler = async (v: INewWish) => {
    const res = await mutate.mutateAsync(v);

    if (eventId) {
      await mutateToEvent.mutateAsync({ event: eventId, wish: res.id });
      await utils.events.getWishes.invalidate(eventId);
      utils.wish.getAllWishes.invalidate();
    } else {
      await utils.wish.getAllWishes.invalidate();
    }
    router.dismiss();
  };

  return (
    <WishEditor initial={{ title: "", description: "" }} handleSave={handler} />
  );
};

const WishlistModal = () => {
  const { wishId } = useGlobalSearchParams<{
    eventId: string;
    wishId: string;
  }>();

  if (wishId === "create") return <CreateMode />;

  return <EditMode />;
};

export default WishlistModal;
