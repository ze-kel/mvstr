import { useState } from "react";
import { Text, View } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { Input } from "~/app/_components/input";
import { Button } from "~/app/_components/button";

const RegisterWithToken = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [gender, setPlace] = useState("male");
  const [date, setDate] = useState(new Date());

  const changeDate = (_: unknown, selectedDate?: Date) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  return (
    <View className="flex h-full w-full ">
      <View className="mx-4 rounded-[20px] bg-surface-inverse px-5 py-7">
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
        <Text className="subHeadingM mt-5">Дата вашего рождения</Text>
        <DateTimePicker
          display="spinner"
          testID="dateTimePicker"
          value={date}
          mode={"date"}
          locale="ru-RU"
          onChange={changeDate}
        />
        <Text className="subHeadingM mt-5">Ваш пол</Text>


        <Button>Созать аккаунт</Button>
      </View>
    </View>
  );
};

export default RegisterWithToken;
