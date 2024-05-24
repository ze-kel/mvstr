import { useState } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import { TRPCClientError } from "@trpc/client";

import { Button } from "~/app/_components/button";
import { defaultUserPicsArray } from "~/app/_components/imageWithDefaults";
import { Input } from "~/app/_components/input";
import { RadioTabs } from "~/app/_components/radioTabs";
import { UploadOrSelectImage } from "~/app/home/create";
import { api } from "~/utils/api";
import { setAuthToken } from "~/utils/auth";

export interface UserFormData {
  firstName: string;
  lastName: string;
  gender: string;
  avatar: string;
}

export const UserDataForm = ({
  initial,
  onCommit,
}: {
  initial?: UserFormData;
  onCommit: (v: UserFormData) => Promise<void>;
}) => {
  const [firstName, setFirstName] = useState(initial?.firstName || "");
  const [lastName, setLastName] = useState(initial?.lastName || "");
  const [gender, setGender] = useState(initial?.gender || "male");
  const [avatar, setAvatar] = useState(
    initial?.avatar || defaultUserPicsArray[0] || "",
  );
  const [isLoading, setIsLoading] = useState(false);

  return (
    <>
      <Text className="subHeadingM mt-5">Пол</Text>
      <RadioTabs
        value={gender}
        onChange={setGender}
        className="mt-2"
        values={[
          { value: "male", label: "Мужчина" },
          { value: "female", label: "Женщина" },
        ]}
      />
      <Text className="subHeadingM mt-5">Имя</Text>
      <Input
        className="mt-3"
        placeholder="Введите имя"
        value={firstName}
        onChangeText={setFirstName}
      />
      <Text className="subHeadingM mt-5">Фамилия</Text>
      <Input
        className="mt-3"
        placeholder="Введите фамилию"
        value={lastName}
        onChangeText={setLastName}
      />
      <Text className="subHeadingM mt-5">Аватар</Text>
      <View className="mt-2">
        <UploadOrSelectImage
          value={avatar}
          setValue={setAvatar}
          defaults={defaultUserPicsArray}
        />
      </View>

      <Button
        loading={isLoading}
        onPress={async () => {
          setIsLoading(true);
          await onCommit({ firstName, lastName, gender, avatar });
          setIsLoading(false);
        }}
        disabled={!(firstName.length && lastName.length)}
        className="mt-4"
      >
        {initial ? "Сохранить" : "Создать аккаунт"}
      </Button>
    </>
  );
};

const RegisterWithToken = () => {
  const router = useRouter();

  const { tokenId } = useGlobalSearchParams<{
    tokenId: string;
  }>();

  const m = api.user.createAccount.useMutation();

  const registerHandler = async (v: UserFormData) => {
    if (!tokenId) return;

    try {
      const res = await m.mutateAsync({
        ...v,
        registrationToken: tokenId,
      });

      await setAuthToken(res);

      router.push("/home");
    } catch (e) {
      if (e instanceof TRPCClientError) {
        if (
          e.message === "Wrong registration token" ||
          e.message === "Expired registration token"
        ) {
          router.push("/login");
        }
      }
    }
  };

  if (!tokenId) return <Redirect href={"/login"} />;

  return (
    <View className="flex h-full w-full ">
      <View className="mx-4 rounded-[20px] bg-surface-inverse ">
        <KeyboardAwareScrollView className="px-5 py-7">
          <Text className="headingL text-center text-[24px] leading-[28px]">
            Регистрация
          </Text>
          <UserDataForm onCommit={registerHandler} />
        </KeyboardAwareScrollView>
      </View>
    </View>
  );
};

export default RegisterWithToken;
