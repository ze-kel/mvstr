import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@acme/ui";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent transition-colors disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:ring-neutral-300",
  {
    variants: {
      variant: {
        primary:
          "bg-buttons-primary text-text-inverse hover:bg-buttons-hover-primary stroke stroke-buttons-primary hover:border-buttons-hover-primary",
        secondary:
          "bg-buttons-secondary hover:bg-buttons-hover-secondary border-buttons-secondary hover:border-buttons-hover-secondary",
        inverse:
          "bg-buttons-inverse hover:bg-buttons-hover-inverse border-buttons-inverse hover:border-buttons-hover-inverse",
        stroke: "border-stroke-secondary hover:bg-button-hover-stroke",
      },
      size: {
        l: "captionXXL rounded-2xl px-[30px] py-[15px]",
        m: "captionXL rounded-xl px-6 py-3",
        s: "captionL rounded-[10px] px-[18px] py-[9px]",
        xs: "captionM rounded-lg px-3 py-1.5",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "m",
    },
  },
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
