"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

interface IWalletCard {
  walletId: string;
  name: string;
  logo?: string;
  balance: string;
  selectedWallet: string;
  onSelect: (selectedCard: string) => void;
  id?: string | number;
}

export function WalletCardSelection({
  walletId,
  logo,
  name,
  balance,
  selectedWallet,
  onSelect,
  id,
}: IWalletCard) {
  const { t } = useTranslation();

  return (
    <label
      htmlFor={`wallet-${walletId}-${id}`}
      data-active={walletId === selectedWallet}
      className="relative flex w-full cursor-pointer flex-col gap-2.5 rounded-xl border-[3px] border-transparent bg-secondary-500 px-6 py-4 transition-all duration-300 ease-linear hover:border-transparent hover:bg-background hover:shadow-light-8 data-[active=true]:border-primary data-[active=true]:bg-primary-selected"
    >
      <input
        type="radio"
        id={`wallet-${walletId}-${id}`}
        checked={walletId === selectedWallet}
        onChange={() => onSelect(walletId)}
        className="absolute inset-0 left-0 top-0 z-10 cursor-pointer opacity-0"
      />
      <div className="flex items-center gap-2">
        {logo && (
          <Image
            src={logo}
            alt={name}
            width={100}
            height={100}
            className="size-8"
          />
        )}
        <h6 className="text-sm font-bold leading-5">{name}</h6>
      </div>
      <div className="mt-2.5">
        <p className="text-xs font-normal leading-4 text-foreground">
          {t("Your Balance")}
        </p>
        <p className="text-base font-medium leading-[22px]">
          {Number(balance).toFixed(2)}
        </p>
      </div>
    </label>
  );
}
