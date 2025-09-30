"use client";

import * as React from "react";

import { DatePicker } from "@/components/common/form/DatePicker";
import { Button } from "@/components/ui/button";
import Label from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format, parse } from "date-fns";
import { FilterSearch } from "iconsax-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export function FilterButton() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // state
  const [filter, setFilter] = React.useState<Record<string, string>>({});
  const [open, setOpen] = React.useState(false);

  // handle filter
  const onFilter = (key: string, value: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) {
      sp.set(key, value);
      setFilter((p) => ({ ...p, [key]: value }));
    } else {
      sp.delete(key);
      setFilter((p) => ({ ...p, [key]: "" }));
    }

    router.replace(`${pathname}?${sp.toString()}`);
  };

  React.useEffect(() => {
    const sp = Object.fromEntries(searchParams.entries());
    if (sp) {
      setFilter(sp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFilter = () => {
    const sp = new URLSearchParams();
    const keys = Object.keys(filter);

    keys.forEach((key) => sp.delete(key));
    setFilter({});
    router.replace(`${pathname}?${sp.toString()}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <FilterSearch size={20} />
          {t("Filter")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[300px] max-w-[400px]">
        <div className="flex flex-col space-y-4">
          {/* Status */}
          <div className="flex w-full flex-col space-y-2">
            <Label className="text-sm font-normal text-secondary-text">
              {t("Status")}
            </Label>
            <Select
              value={filter?.status}
              onValueChange={(value) => onFilter("status", value)}
            >
              <SelectTrigger className="h-10 w-full text-base data-[placeholder]:text-secondary-text">
                <SelectValue placeholder={t("Status")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="pending">{t("Pending")}</SelectItem>
                <SelectItem value="completed">{t("Complete")}</SelectItem>
                <SelectItem value="failed">{t("Failed")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date */}
          <div className="flex w-full flex-col space-y-2">
            <Label className="text-sm font-normal text-secondary-text">
              {t("Date")}
            </Label>
            <DatePicker
              value={
                Object.prototype.hasOwnProperty.call(filter, "date")
                  ? parse(filter.date, "yyyy-MM-dd", new Date())
                  : undefined
              }
              onChange={(date) => {
                onFilter("date", format(date, "yyyy-MM-dd"));
              }}
              className="h-10"
              placeholderClassName="text-secondary-text"
            />
          </div>

          <div className="flex flex-col items-stretch space-y-2">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="h-10"
            >
              {t("Done")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearFilter}
              className="h-10"
            >
              {t("Clear Filter")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
