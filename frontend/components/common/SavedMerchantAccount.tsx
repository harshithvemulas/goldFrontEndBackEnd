"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { imageURL } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { useTranslation } from "react-i18next";

export default function SavedMerchantAccount({
  avatar,
  name,
  accountNumber,
  checked,
  onChange,
}: {
  avatar: string;
  name: string;
  accountNumber: string;
  checked: boolean;
  onChange: (value: string, data?: any) => void;
}) {
  const { t } = useTranslation();

  return (
    <div
      data-checked={checked}
      className="relative flex items-center gap-2 border-b border-dashed p-2 last:border-b-0 hover:bg-accent data-[checked=true]:border-solid data-[checked=true]:border-accent"
    >
      <input
        type="radio"
        checked={checked}
        onChange={() => onChange && onChange(accountNumber)}
        className="absolute inset-0 left-0 top-0 z-10 opacity-0 hover:cursor-pointer"
      />
      <div className="h-8 min-w-8 rounded-full">
        <Avatar className="h-8 w-8">
          <AvatarImage src={imageURL(avatar)} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {getAvatarFallback(name)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="flex-1">
        <p>{name}</p>
        <p className="text-sm text-secondary-text">
          {t("MerchantID")}: {accountNumber}
        </p>
      </div>
    </div>
  );
}
