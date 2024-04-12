import type { TextInputProps } from "react-native";
import * as React from "react";
import { TextInput } from "react-native";

import { cn } from "~/utils/cn";

const Input = React.forwardRef<TextInput, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        className={cn(
          "placeholderM flex w-full  rounded-xl border border-stroke-secondary bg-buttons-secondary  px-4 py-3 text-lg outline-transparent  placeholder:text-text-tertiary focus:outline-text-secondary",
          className,
        )}
        autoCorrect={false}
        style={{}}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
