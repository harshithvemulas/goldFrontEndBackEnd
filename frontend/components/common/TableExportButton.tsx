"use client";

/* eslint-disable no-nested-ternary */
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import Separator from "@/components/ui/separator";
import { configs } from "@/lib/configs";
import cn from "@/lib/utils";
import { format } from "date-fns";
import { CalendarEdit, ExportCircle } from "iconsax-react";
import Link from "next/link";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { useTranslation } from "react-i18next";

export function TableExportButton({
  url,
  className,
  align = "center",
}: {
  url: string;
  className?: string;
  align?: "start" | "center" | "end";
}) {
  const { t } = useTranslation();
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });

  // format date
  const getUrl = () => {
    if (!url) {
      return ""; // Return an empty string or a default URL
    }

    let start = new Date();
    let end = new Date();

    // Ensure the date object is defined and has the necessary properties
    if (date?.from) {
      start = new Date(date.from);
      end = date.to ? new Date(date.to) : start;
    }

    const location = url.split("?");

    const sp = new URLSearchParams(location[1] || ""); // Handle cases with no query string
    sp.set("fromDate", format(start, "yyyy-MM-dd"));
    sp.set("toDate", format(end, "yyyy-MM-dd"));

    return `${location[0]}?${sp.toString()}`;
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="flex-1 sm:flex-initial">
            <ExportCircle size={20} />
            {t("Export")}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align={align}>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />

          <Separator />
          <div
            className={cn(
              "flex items-center justify-between px-4 py-2 text-left text-sm font-normal text-secondary-text",
              !date && "text-muted-foreground",
            )}
          >
            <div className="flex items-center space-x-1">
              <CalendarEdit className="mr-2 h-5 w-5" />
              {date?.from ? (
                date.to ? (
                  <>
                    {format(date.from, "LLL dd, y")} -{" "}
                    {format(date.to, "LLL dd, y")}
                  </>
                ) : (
                  format(date.from, "LLL dd, y")
                )
              ) : (
                <span>{t("Pick a date")}</span>
              )}
            </div>

            <Button
              size="sm"
              className="flex-1 text-sm sm:flex-initial"
              asChild
            >
              <Link href={`${configs.API_URL}${getUrl()}`}>
                <ExportCircle size={17} />
                {t("Export")}
              </Link>
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
