import * as React from "react";

import { cn } from "@acme/ui";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "placeholderM  bg-buttons-secondary placeholder:text-text-tertiary focus:outline-text-secondary flex min-h-[60px]  w-full rounded-xl border border-neutral-200 px-4 py-3 text-lg outline-transparent transition-colors",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
