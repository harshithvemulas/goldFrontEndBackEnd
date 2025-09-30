"use client";

import { Loader } from "@/components/common/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useSWR } from "@/hooks/useSWR";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import React from "react";
import { useTranslation } from "react-i18next";

export function MerchantAccountSelection({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (value: string, data?: any) => void;
}) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(selected);

  const { data, isLoading } = useSWR(`/merchants/global?search=${value}`);

  React.useEffect(() => {
    setValue(selected);
  }, [selected]);

  // handle change
  const handleMerchantChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const inputValue = e.target.value;
    setValue(inputValue);
    onSelect(inputValue);

    if (inputValue && !open) {
      setTimeout(() => {
        setOpen(true);
      }, 600);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full">
        <Input
          placeholder={t("Enter merchant account")}
          value={value}
          onChange={handleMerchantChange}
        />
      </PopoverTrigger>
      <PopoverContent
        onOpenAutoFocus={(e: any) => e.preventDefault()}
        className="w-[var(--radix-popover-trigger-width)] p-0"
      >
        <Command autoFocus={false}>
          <CommandList>
            <CommandEmpty>{t("No results found.")}</CommandEmpty>
            <CommandGroup>
              {isLoading && (
                <CommandItem>
                  <Loader />
                </CommandItem>
              )}

              {data?.data.length
                ? data?.data.map((merchant: any) => (
                    <CommandItem
                      key={merchant.merchantId}
                      value={merchant?.merchantId}
                      onSelect={() => {
                        onSelect(merchant?.merchantId, merchant);
                      }}
                    >
                      <MerchantAccount
                        name={merchant?.name}
                        avatar={merchant?.profileImage}
                        email={merchant?.email}
                      />
                    </CommandItem>
                  ))
                : null}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function MerchantAccount({
  avatar,
  name,
  email,
}: {
  avatar: string;
  name: string;
  email: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <Avatar>
        <AvatarImage src={avatar} className="border-2 border-border" />
        <AvatarFallback className="border-2 border-border">
          {getAvatarFallback(name)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p>{name}</p>
        <p className="text-sm text-gray">{email}</p>
      </div>
    </div>
  );
}
