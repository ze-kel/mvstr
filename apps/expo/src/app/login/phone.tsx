import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";
import { TRPCClientError } from "@trpc/client";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { differenceInSeconds } from "date-fns";

import { Button } from "~/app/_components/button";
import { Input } from "~/app/_components/input";
import { api } from "~/utils/api";
import { setAuthToken } from "~/utils/auth";
import { declOfNum } from "~/utils/declOfNum";

const prefix = "+7";
const mask = "+7 (###) ###-##-##";

export const regexNonNumbers = /[^0-9.]/g;

export const transformNumber = (raw: string) => {
  const noPrefix = raw.replace(prefix, "");
  const numbers = noPrefix.replaceAll(regexNonNumbers, "").split("");

  if (numbers.length > 10) {
    numbers.splice(0, numbers.length - 10);
  }

  const masked: string[] = [];

  for (const letter of mask) {
    if (letter === "#") {
      const next = numbers.shift();
      masked.push(next!);

      if (!numbers.length) {
        return masked.join("");
      }
    } else {
      masked.push(letter);
    }
  }
  return masked.join("");
};

export const PhoneNumberInput = ({
  value,
  onChange,
  className,
}: {
  className?: string;
  value: string;
  onChange: (v: string) => void;
}) => {
  const [raw, setRaw] = useState(transformNumber(value || ""));

  const handler = (v: string) => {
    const t = transformNumber(v);

    setRaw(t);
    onChange(t.replaceAll(regexNonNumbers, ""));
  };

  return (
    <Input
      placeholder={mask.replaceAll("#", "_")}
      maxLength={mask.length}
      keyboardType="number-pad"
      className={className}
      value={raw}
      onChangeText={handler}
    />
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
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const [requestExpiration, setRequestExpiration] = useState<Date | null>(null);

  const requestCode = api.user.requestPhoneCode.useMutation();
  const validateCode = api.user.verifyPhoneCode.useMutation();

  const handleRequestCode = async () => {
    if (phone.length !== 11) return;

    if (!requestCode.isPending) {
      const res = await requestCode.mutateAsync(phone);
      setRequestExpiration(res);
    }
  };

  const handleValidateCode = async (code: string) => {
    try {
      const res = await validateCode.mutateAsync({ phone, code });

      if (res.action === "register") {
        router.replace({
          pathname: "/login/register/[tokenId]",
          params: {
            tokenId: res.token,
          },
        });
      } else {
        await setAuthToken(res.token);
        router.replace("/home");
      }
    } catch (e) {
      if (e instanceof TRPCClientError) {
        if (e.message === "Wrong code") {
          console.log("aaa");
          setError("Неверный код");
        }
      }
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
            <Text className="text-text-accent">{transformNumber(phone)}</Text>
          </Text>

          <View className="mt-5">
            <OTPInputView
              autoFocusOnLoad
              style={{ height: 100 }}
              pinCount={6}
              keyboardType="default"
              codeInputFieldStyle={{
                borderWidth: 2,
                borderRadius: 10,
                color: "rgba(61, 56, 73, 1)",
                fontSize: 20,
                fontFamily: "NeueMachina-Ultrabold",
                borderColor: "rgba(185, 184, 188, 1)",
              }}
              codeInputHighlightStyle={{ borderColor: "rgba(61, 56, 73, 1)" }}
              onCodeFilled={(text) => void handleValidateCode(text)}
            />

            {error && (
              <Text className="textXL mt-2 text-center text-text-error">
                Неверный код
              </Text>
            )}

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

        <PhoneNumberInput className="mt-6" value={phone} onChange={setPhone} />
        <Button
          loading={requestCode.isPending}
          disabled={phone.length !== 11}
          variant={"stroke"}
          onPress={handleRequestCode}
          className="mt-4"
        >
          Получить код
        </Button>
      </View>
    </View>
  );
};

export default PhoneLogin;
