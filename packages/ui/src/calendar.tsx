"use client";

import * as React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { ru } from "date-fns/locale";
import { DayPicker } from "react-day-picker";

import { cn } from "./";
import { buttonVariants } from "./button.jsx";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      locale={ru}
      showOutsideDays={showOutsideDays}
      className={cn("", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "pb-4",
        caption:
          "flex  justify-center relative items-center w-full border-b p-4",
        caption_label: cn("subHeadingL flex h-9 items-center capitalize"),
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "secondary", size: "s" }),
          "h-9 w-9 p-0 ",
        ),
        nav_button_previous: "absolute left-2",
        nav_button_next: "absolute right-2",

        table: "w-full border-collapse mx-4 my-3",
        head_row: "flex",
        head_cell: cn(
          "text-text-tertiary flex h-10 w-10 items-center justify-center rounded-md capitalize text-neutral-500",
        ),
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-neutral-100 dark:[&:has([aria-selected])]:bg-neutral-800 [&:has([aria-selected].day-outside)]:bg-neutral-100/50 dark:[&:has([aria-selected].day-outside)]:bg-neutral-800/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
          props.mode === "range"
            ? "[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
            : "[&:has([aria-selected])]:rounded-md",
        ),
        day: cn(buttonVariants({ variant: "inverse" }), "textXL h-10 w-10 p-0"),
        day_selected: "bg-buttons-primary text-white hover:bg-buttons-primary",
        day_today: "text-text-accent",
        day_outside: "text-text-tertiary ",
        day_disabled: "text-neutral-500 opacity-50 dark:text-neutral-400",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
