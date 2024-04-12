import { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";

import { Button } from "~/app/_components/button";
import { Input } from "~/app/_components/input";
import { Select } from "~/app/_components/select";

const Create = () => {
  const [value, setValue] = useState("");

  return (
    <SafeAreaView className="bg-surface-inverse px-[16px]">
      <View className="px-4">
        <Text className="headingM">Расскажите о вашем мероприятии</Text>
        <Text className="subHeadingL mt-5">
          Введите информацию о мероприятии
        </Text>
        <Input
          placeholder="Название события"
          value={value}
          onChangeText={setValue}
        />
        <Button>
          <Text> ntrcn</Text>
        </Button>
        <Select />
      </View>
    </SafeAreaView>
  );
};

export default Create;
