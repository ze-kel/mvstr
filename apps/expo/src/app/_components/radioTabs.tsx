import { Pressable, Text, View } from "react-native";

import { cn } from "~/utils/cn";

export const RadioTabs = ({
  value,
  onChange,
  values,
  className,
}: {
  className?: string;
  value: string;
  values: { value: string; label: string }[];
  onChange: (v: string) => void;
}) => {
  return (
    <View
      className={cn(
        "flex flex-row justify-around rounded-xl bg-surface-secondary p-1",
        className,
      )}
    >
      {values.map((v) => {
        return (
          <Pressable
            key={v.value}
            className={cn(
              "flex-1 rounded-lg py-2.5 text-center",
              value === v.value && "bg-surface-inverse",
            )}
            onPress={() => {
              if (value !== v.value) {
                onChange(v.value);
              }
            }}
          >
            <Text className="captionL w-full text-center">{v.label} </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
