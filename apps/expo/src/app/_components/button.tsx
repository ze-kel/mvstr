import type { VariantProps } from "class-variance-authority";
import type { PressableProps } from "react-native";
import * as React from "react";
import { Pressable, Text } from "react-native";
import { cva } from "class-variance-authority";

import { cn } from "~/utils/cn";

const textVariants = cva("", {
  variants: {
    variant: {
      primary: " text-text-inverse",
      secondary: "",
      inverse: "",
      stroke: "",
    },
    size: {
      l: "captionXXL",
      m: "captionXL",
      s: "captionL",
      xs: "captionM",
    },
  },
  defaultVariants: {
    variant: "primary",
    size: "m",
  },
});

const buttonVariants = cva(
  "flex flex-row justify-center gap-2 whitespace-nowrap rounded-md border border-transparent disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        primary:
          "stroke bg-buttons-primary stroke-buttons-primary text-text-inverse hover:border-buttons-hover-primary hover:bg-buttons-hover-primary",
        secondary:
          "border-buttons-secondary bg-buttons-secondary hover:border-buttons-hover-secondary hover:bg-buttons-hover-secondary",
        inverse:
          "border-buttons-inverse bg-buttons-inverse hover:border-buttons-hover-inverse hover:bg-buttons-hover-inverse",
        stroke: "border-stroke-secondary hover:bg-button-hover-stroke",
      },
      size: {
        l: "captionXXL rounded-[16px] px-[30px] py-[15px]",
        m: "captionXL rounded-[12px] px-6 py-3",
        s: "captionL rounded-[10px] px-[18px] py-[9px]",
        xs: "captionM rounded-[8px] px-3 py-1.5",
        sIcon: "h-[36px] w-[36px] rounded-[10px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "m",
    },
  },
);

interface ButtonProps
  extends PressableProps,
    VariantProps<typeof buttonVariants> {
  icon?: boolean;
  leftIcon?: React.ReactNode;
}

const Button = React.forwardRef<Pressable, ButtonProps>(
  ({ className, variant, size, children, icon, leftIcon, ...props }, ref) => {
    return (
      <Pressable
        className={cn(buttonVariants({ variant, size, className }), className)}
        style={{}}
        ref={ref}
        {...props}
      >
        {leftIcon ? leftIcon : <></>}
        {icon ? (
          children
        ) : (
          <Text className={textVariants({ variant, size })}>{children}</Text>
        )}
      </Pressable>
    );
  },
);
Button.displayName = "Button";

export { Button };
