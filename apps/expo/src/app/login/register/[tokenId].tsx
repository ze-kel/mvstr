import { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Redirect, useGlobalSearchParams, useRouter } from "expo-router";
import DefaultBoy from "@assets/defaultBoy.png";
import DefaultGirl from "@assets/defaultGirl.png";
import { TRPCClientError } from "@trpc/client";

import { Button } from "~/app/_components/button";
import { Input } from "~/app/_components/input";
import { api } from "~/utils/api";
import { setAuthToken, setAuthTokenSync } from "~/utils/auth";

/*
import DateTimePicker from "@react-native-community/datetimepicker";  
  const changeDate = (_: unknown, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };      
          <Text className="subHeadingM mt-5">Дата вашего рождения</Text>
          <DateTimePicker
            display="spinner"
            testID="dateTimePicker"
            value={date}
            mode={"date"}
            locale="ru-RU"
            onChange={changeDate}
          />
*/

const RegisterWithToken = () => {
  const router = useRouter();

  const { tokenId } = useGlobalSearchParams<{
    tokenId: string;
  }>();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setGender] = useState("male");

  const m = api.user.createAccount.useMutation();

  const registerHandler = async () => {
    if (!firstName.length || !lastName.length || !tokenId) return;

    try {
      const res = await m.mutateAsync({
        firstName,
        lastName,
        gender,
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
        <ScrollView className="px-5 py-7">
          <Text className="headingL text-center text-[24px] leading-[28px]">
            Регистрация
          </Text>
          <Text className="subHeadingM mt-5">Ваше имя</Text>
          <Input
            className="mt-3"
            placeholder="Введите имя"
            value={firstName}
            onChangeText={setFirstName}
          />
          <Text className="subHeadingM mt-5">Ваша фамилия</Text>
          <Input
            className="mt-3"
            placeholder="Введите фамилию"
            value={lastName}
            onChangeText={setLastName}
          />
          <Text className="subHeadingM mt-5">Ваш пол</Text>
          <View className="mt-2 flex flex-row gap-2">
            <Pressable onPress={() => setGender("female")}>
              <Image
                source={DefaultGirl}
                style={{
                  borderWidth: 2,
                  borderColor:
                    gender === "female" ? "rgba(61, 56, 73, 1)" : "transparent",
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  resizeMode: "contain",
                  display: "flex",
                }}
              />
            </Pressable>

            <Pressable onPress={() => setGender("male")}>
              <Image
                source={DefaultBoy}
                style={{
                  borderWidth: 2,
                  borderColor:
                    gender === "male" ? "rgba(61, 56, 73, 1)" : "transparent",
                  width: 64,
                  height: 64,
                  borderRadius: 12,
                  resizeMode: "contain",
                  display: "flex",
                }}
              />
            </Pressable>
          </View>

          <Button
            onPress={registerHandler}
            disabled={!(firstName.length && lastName.length)}
            className="mt-4"
          >
            Создать аккаунт
          </Button>
          <SafeAreaView />
        </ScrollView>
      </View>
    </View>
  );
};

export default RegisterWithToken;
