"use client";

import { useWallets } from "@/hooks/useWallets";
import { Currency } from "@/lib/utils";

const currency = new Currency();

export function Balance({ currencyCode }: { currencyCode: string }) {
  const { wallets, getWalletByCurrencyCode } = useWallets();

  const wallet = getWalletByCurrencyCode(wallets, currencyCode);

  return (
    <p className="font-medium">
      {currency.formatVC(Number(wallet?.balance || 0), currencyCode)}
    </p>
  );
}
