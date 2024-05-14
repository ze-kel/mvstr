import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import { useRouter } from "expo-router";
import { differenceInSeconds } from "date-fns";
import { el } from "date-fns/locale";

import { Button } from "~/app/_components/button";
import { Input } from "~/app/_components/input";
import { TitleUserHeader } from "~/app/_components/layoutElements";
import { api } from "~/utils/api";
import { setAuthToken } from "~/utils/auth";
import { declOfNum } from "~/utils/declOfNum";

const prefix = "+7";
const mask = "+7 (###) ###-##-##";

const PhoneNumberInput = () => {
  const [raw, setRaw] = useState("");

  const transform = (raw: string) => {
    const noPrefix = raw.replace(prefix, "");
    const numbers = noPrefix.replaceAll(/[^0-9.]/g, "").split("");

    const masked: string[] = [];

    for (const letter of mask) {
      if (letter === "#") {
        const next = numbers.shift();
        masked.push(next);

        if (!numbers.length) {
          setRaw(masked.join(""));
          return;
        }
      } else {
        masked.push(letter);
      }
    }
  };

  return (
    <View>
      <Text>{raw}</Text>
      <Input
        placeholder={mask.replaceAll("#", "_")}
        maxLength={mask.length}
        keyboardType="number-pad"
        className="mt-6"
        value={raw}
        onChangeText={(v) => transform(v)}
      />
    </View>
  );
};

const Timer = ({
  date,
  getNewCode,
}: {
  date: Date;
  getNewCode: () => void;
}) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const c = setInterval(() => {
      setNow(new Date());
    });

    return () => {
      clearInterval(c);
    };
  });

  const diff = differenceInSeconds(date, new Date());

  return (
    <Button
      onPress={() => {
        if (diff <= 0) {
          getNewCode();
        }
      }}
      className="mt-2"
      variant={diff <= 0 ? "stroke" : "inverse"}
    >
      {diff <= 0
        ? "Получить новый код"
        : `Новый код через ${diff} ${declOfNum(diff, ["секунду", "секунды", "секунд"])}`}
    </Button>
  );
};

const PhoneLogin = () => {
  const [phone, setPhone] = useState("79253181117");
  const [code, setCode] = useState("");

  const router = useRouter();

  const [requestExpiration, setRequestExpiration] = useState<Date | null>(null);

  const requestCode = api.user.requestPhoneCode.useMutation();
  const validateCode = api.user.verifyPhoneCode.useMutation();

  const handleRequestCode = async () => {
    const res = await requestCode.mutateAsync(phone);
    setRequestExpiration(res);
  };

  const [result, setResult] = useState<any>();

  const handleValidateCode = async (code: string) => {
    const res = await validateCode.mutateAsync({ phone, code });
    setResult(res);

    if (res.action === "register") {
      router.navigate({
        pathname: "/login/register/[tokenId]",
        params: {
          tokenId: res.token,
        },
      });
    } else {
      setAuthToken(res.token);
      router.navigate("/home");
    }
  };

  if (phone && requestExpiration) {
    return (
      <View className="flex h-full w-full ">
        <View className="mx-4 rounded-[20px] bg-surface-inverse px-5 py-7">
          <Text className="headingL text-center text-[24px] leading-[28px]">
            Код подтверждения
          </Text>
          <Text className="textXL mt-2 text-center">
            Отправили код на номер{" "}
            <Text className="text-text-accent">{phone}</Text>
          </Text>

          <View className="mt-5">
            <OtpInput
              numberOfDigits={6}
              focusStickBlinkingDuration={1000}
              onFilled={(text) => void handleValidateCode(text)}
              theme={{
                pinCodeContainerStyle: {
                  borderWidth: 2,
                  borderColor: "rgba(185, 184, 188, 1)",
                },
                pinCodeTextStyle: {
                  fontFamily: "NeueMachina-Ultrabold",
                  fontSize: 30,
                  marginTop: 6,
                },
              }}
              focusColor="rgba(61, 56, 73, 1)"
            />

            <Timer
              date={requestExpiration}
              getNewCode={() => handleRequestCode()}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="flex h-full w-full ">
      <View className="mx-4 rounded-[20px] bg-surface-inverse px-5 py-7">
        <Text className="headingL text-center text-[24px] leading-[28px]">
          Введите номер телефона
        </Text>
        <Input
          className="mt-6"
          value={phone}
          onChangeText={(v) => setPhone(v)}
        />
        <PhoneNumberInput />
        <Button variant={"stroke"} onPress={handleRequestCode} className="mt-4">
          Получить код
        </Button>
      </View>
    </View>
  );
};

export default PhoneLogin;
