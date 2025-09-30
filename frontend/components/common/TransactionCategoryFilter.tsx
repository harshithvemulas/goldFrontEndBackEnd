"use client";

import * as React from "react";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { startCase } from "@/lib/utils";
import {
  Add,
  ArrowDown2,
  ArrowRight,
  FlashCircle,
  Receive,
  Repeat,
  Share,
  ShoppingBag,
  Tree,
} from "iconsax-react";
import { Menu } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function TransactionCategoryFilter({
  filter,
}: {
  filter: (type: string, value: string, callback: () => void) => void;
}) {
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="flex h-10 w-full items-center gap-2 rounded-sm bg-background px-3 text-foreground shadow-defaultLite sm:w-72">
        <span className="line-clamp-1 flex-1 text-left font-medium leading-[22px] text-foreground">
          {searchParams.get("type")
            ? startCase(searchParams.get("type") as string)
            : t("All Transactions")}
        </span>
        <ArrowDown2
          size="24"
          strokeWidth={1.5}
          className="text-secondary-text"
        />
      </PopoverTrigger>

      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command className="p-1">
          <CommandList className="max-h-[450px]">
            <CommandGroup className="p-0">
              <div className="px-2 py-1.5">
                <p className="text-[10px] font-normal leading-4 text-secondary-text">
                  {t("Select what you want to see")}
                </p>
              </div>

              <CommandSeparator className="mb-1 mt-[5px]" />

              <CommandItem
                onSelect={() => filter("type", "", () => setOpen(false))}
                className="mx-0 flex items-center gap-2 rounded-none px-4 py-2 text-base font-medium leading-[22px]"
              >
                <Menu size={24} />
                {t("All Transactions")}
              </CommandItem>

              <CommandSeparator className="mb-1 mt-[5px]" />

              <CommandItem
                onSelect={() => filter("type", "deposit", () => setOpen(false))}
                className="mx-0 flex items-center gap-2 rounded-none px-4 py-2 text-base font-medium leading-[22px]"
              >
                <Add size={24} />
                {t("Deposits")}
              </CommandItem>

              <CommandSeparator className="mb-1 mt-[5px]" />

              <CommandItem
                onSelect={() =>
                  filter("type", "transfer", () => setOpen(false))
                }
                className="mx-0 flex items-center gap-2 rounded-none px-4 py-2 text-base font-medium leading-[22px]"
              >
                <ArrowRight size={24} />
                {t("Transfer")}
              </CommandItem>

              <CommandSeparator className="mb-1 mt-[5px]" />

              <CommandItem
                onSelect={() =>
                  filter("type", "withdraw", () => setOpen(false))
                }
                className="mx-0 flex items-center gap-2 rounded-none px-4 py-2 text-base font-medium leading-[22px]"
              >
                <Receive size="24" />
                {t("Withdraws")}
              </CommandItem>

              <CommandSeparator className="mb-1 mt-[5px]" />

              <CommandItem
                onSelect={() =>
                  filter("type", "exchange", () => setOpen(false))
                }
                className="mx-0 flex items-center gap-2 rounded-none px-4 py-2 text-base font-medium leading-[22px]"
              >
                <Repeat size="24" />
                {t("Exchange")}
              </CommandItem>

              <CommandSeparator className="mb-1 mt-[5px]" />

              <CommandItem
                onSelect={() => filter("type", "payment", () => setOpen(false))}
                className="mx-0 flex items-center gap-2 rounded-none px-4 py-2 text-base font-medium leading-[22px]"
              >
                <ShoppingBag size="24" />
                {t("Payment")}
              </CommandItem>

              <CommandSeparator className="mb-1 mt-[5px]" />

              <CommandItem
                onSelect={() => filter("type", "service", () => setOpen(false))}
                className="mx-0 flex items-center gap-2 rounded-none px-4 py-2 text-base font-medium leading-[22px]"
              >
                <FlashCircle size="24" />
                {t("Services")}
              </CommandItem>
              <CommandSeparator className="mb-1 mt-[5px]" />

              <CommandItem
                onSelect={() =>
                  filter("type", "investment", () => setOpen(false))
                }
                className="mx-0 flex items-center gap-2 rounded-none px-4 py-2 text-base font-medium leading-[22px]"
              >
                <Tree size="24" />
                {t("Investments")}
              </CommandItem>
              <CommandSeparator className="mb-1 mt-[5px]" />

              <CommandItem
                onSelect={() =>
                  filter("type", "investment_return", () => setOpen(false))
                }
                className="mx-0 flex items-center gap-2 rounded-none px-4 py-2 text-base font-medium leading-[22px]"
              >
                <Tree size="24" />
                {t("Investment return")}
              </CommandItem>
              <CommandSeparator className="mb-1 mt-[5px]" />

              <CommandItem
                onSelect={() =>
                  filter("type", "referral_bonus", () => setOpen(false))
                }
                className="mx-0 flex items-center gap-2 rounded-none px-4 py-2 text-base font-medium leading-[22px]"
              >
                <Share size="24" />
                {t("Referral bonus")}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
