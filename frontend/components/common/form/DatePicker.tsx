"use client";

/* eslint-disable react/display-name */
import { Calendar, type CalendarProps } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import cn from "@/lib/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "iconsax-react";
import React from "react";
import { useTranslation } from "react-i18next";

// The component should be passed as the second argument to React.forwardRef
export const DatePicker = React.forwardRef<
  HTMLDivElement,
  {
    value?: Date;
    className?: string;
    onChange: (...event: any[]) => void;
    placeholderClassName?: string;
    options?: Partial<CalendarProps>;
  }
>(({ value, onChange, className, placeholderClassName, options }, ref) => {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={!!options?.disabled}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-md border-none border-input bg-accent px-3",
          className,
        )}
      >
        <div ref={ref} className="flex flex-1 items-center">
          <div className="flex flex-1 items-center gap-2 text-left">
            {value ? (
              format(value, "dd/MM/yyyy")
            ) : (
              <span className={cn("text-placeholder", placeholderClassName)}>
                {t("Pick a Date")}
              </span>
            )}
          </div>
        </div>

        <CalendarIcon className="ml-auto h-4 w-4 text-primary opacity-100" />
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          {...options}
          mode="single"
          initialFocus
          selected={value ?? undefined}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
});
