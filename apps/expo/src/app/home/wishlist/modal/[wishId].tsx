import { useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";

import type { INewWish, IWish } from "@acme/api";

import { Button } from "~/app/_components/button";
import { Input } from "~/app/_components/input";
import Spinner from "~/app/_components/spinner";
import { api } from "~/utils/api";

const ImageUploader = ({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
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
      const b = await manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 750, height: 750 } }],
        {
          compress: 0.35,
          format: SaveFormat.JPEG,
          base64: true,
        },
      );

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
    <View className="mt-2">
      <Pressable onPress={pickImage}>
        <View className="flex w-[200px] flex-row">
          <View className="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-3xl border border-dashed border-black ">
            <Text className="subHeadingM">Загрузить фото</Text>
          </View>

          <Image
            source={{
              uri: state,
            }}
            style={{
              borderRadius: 16,
              flex: 0,
              width: 200,
              height: 200,
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
      </Pressable>
    </View>
  );
};

interface WishEditorProps {
  initial?: Omit<IWish, "id">;
  handleSave: (v: Omit<Omit<IWish, "id">, "userId">) => Promise<void>;
}

const WishEditor = ({ initial, handleSave }: WishEditorProps) => {
  const wish = useRef<Partial<IWish>>(
    initial ?? {
      title: "",
      description: "",
    },
  );

  return (
    <ScrollView className="rounded-[28px] bg-surface-inverse px-4 pb-32 pt-7">
      <Text className="headingS text-center">Изменить желание</Text>

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
        onPress={() => {
          void handleSave(wish.current);
        }}
      >
        Сохранить
      </Button>
      <SafeAreaView />
    </ScrollView>
  );
};

const EditMode = () => {
  const { eventId, wishId } = useGlobalSearchParams<{
    eventId: string;
    wishId: string;
  }>();

  const { data, isLoading } = api.wish.getAllWishes.useQuery();

  const router = useRouter();
  const utils = api.useUtils();

  const currentOne = data?.find((v) => v.id === wishId);

  // Note that Im not revalidating here becuase that will automatically happen
  // when we navigate to other page after saving
  const mutate = api.wish.updateWish.useMutation({
    onMutate: (updatedWish) => {
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
    if (wishId) {
      await mutate.mutateAsync({ wishId, update: v });
    }

    if (eventId) {
      router.navigate({
        pathname: "/event/[eventId]/wishlist/",
        params: { eventId },
      });
    } else {
      router.navigate({
        pathname: "/home/wishlist/",
      });
    }
  };

  if (isLoading) {
    return (
      <View>
        <Text>loading</Text>
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
          pathname: "/home/wishlist/",
          params: { eventId },
        }}
      ></Redirect>
    );
  }

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

    if (eventId) {
      router.replace({
        pathname: "/event/[eventId]/wishlist/",
        params: { eventId },
      });
    } else {
      router.replace({
        pathname: "/home/wishlist",
      });
    }
  };

  return (
    <View>
      <WishEditor
        initial={{ title: "", description: "" }}
        handleSave={handler}
      />
    </View>
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
