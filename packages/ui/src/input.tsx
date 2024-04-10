import * as React from "react";

import { cn } from "@acme/ui";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "placeholderM bg-buttons-secondary placeholder:text-text-tertiary  focus:outline-text-secondary flex w-full rounded-xl  border border-neutral-200 px-4 py-3 text-lg outline-transparent transition-colors",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
