import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useRouter } from "expo-router";
import * as Updates from "expo-updates";

import type { UserFormData } from "~/app/login/register/[tokenId]";
import { Button } from "~/app/_components/button";
import Spinner from "~/app/_components/spinner";
import { maskDBNumber } from "~/app/event/[eventId]/people";
import { UserDataForm } from "~/app/login/register/[tokenId]";
import { api } from "~/utils/api";
import { clearAuthToken } from "~/utils/auth";

const UpdatesCheck = () => {
  const [isUpdate, setIsUpdate] = useState("unknown");

  const [isWorking, setIsWorking] = useState(false);

  const check = async () => {
    setIsWorking(true);
    const update = await Updates.checkForUpdateAsync();
    if (update) {
      setIsUpdate("available");
    } else {
      setIsUpdate("latest");
    }
    setIsWorking(false);
  };

  async function onFetchUpdateAsync() {
    setIsWorking(true);
    await Updates.fetchUpdateAsync();
    await Updates.reloadAsync();
    setIsWorking(false);
  }

  return (
    <View className="mt-6">
      {isUpdate === "unknown" && (
        <Button variant={"stroke"} loading={isWorking} onPress={check}>
          Проверить наличие обновления
        </Button>
      )}
      {isUpdate === "available" && (
        <Button loading={isWorking} onPress={onFetchUpdateAsync}>
          Загрузить обновление
        </Button>
      )}
      {isUpdate === "latest" && (
        <Button variant={"inverse"} disabled>
          Вы на последней версии
        </Button>
      )}
    </View>
  );
};

export default function Index() {
  const { data, refetch } = api.user.getMe.useQuery();

  const mut = api.user.updateAccount.useMutation();

  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const utils = api.useUtils();

  if (!data) return <Spinner />;

  const handler = async (v: UserFormData) => {
    await mut.mutateAsync(v);

    await utils.user.getMe.invalidate();
    await router.dismiss();
  };

  const logout = async () => {
    setIsLoggingOut(true);
    await clearAuthToken();
    router.replace("/login");
    setIsLoggingOut(false);
  };

  return (
    <View className="pt-7">
      <Text className="headingS px-4 text-center">Учетная запись</Text>
      <Text className="textXXL mb-5 mt-1.5 text-center">
        {maskDBNumber(data.phone || "")}
      </Text>
      <KeyboardAwareScrollView className="px-4">
        <UserDataForm
          initial={{
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            avatar: data.profileImage || "",
            gender: data.gender || "",
          }}
          onCommit={handler}
        />
        <View className="mx-4 mt-5 h-0.5 rounded-lg bg-icons-tertiary opacity-10"></View>
        <Button
          loading={isLoggingOut}
          onPress={logout}
          className="mt-5 w-full "
          variant={"stroke"}
        >
          Выйти
        </Button>

        <UpdatesCheck />
      </KeyboardAwareScrollView>
    </View>
  );
}
