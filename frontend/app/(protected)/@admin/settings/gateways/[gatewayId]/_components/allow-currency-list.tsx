"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrencies } from "@/data/useCurrencies";
import { Currency } from "@/types/currency";

export function AllowCurrencyList() {
  const { currencies, isLoading } = useCurrencies();

  if (isLoading) {
    <>
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
      <Skeleton />
    </>;
  }

  // Filter allow currencies
  const allowCurrencies = (currencies: Currency[]) =>
    currencies.filter((c: Currency) => c.active);

  // render allow currencies
  return allowCurrencies(currencies).map((currency: Currency) => (
    <div
      key={currency.id}
      className="flex w-full items-center gap-2.5 rounded-lg bg-accent px-2 py-1.5"
    >
      <Avatar className="size-8 font-bold">
        <AvatarImage src={currency?.logo} />
        <AvatarFallback className="bg-important text-xs text-important-foreground">
          {currency.code}
        </AvatarFallback>
      </Avatar>

      <p className="line-clamp-1 inline-block flex-1 overflow-ellipsis whitespace-nowrap font-medium">
        {currency.name}
      </p>
    </div>
  ));
}
