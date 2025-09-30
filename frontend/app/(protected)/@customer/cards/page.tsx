"use client";

import CardView from "@/app/(protected)/@customer/cards/_components/card-view";
import { Loader } from "@/components/common/Loader";
import { useSWR } from "@/hooks/useSWR";
import { Card, ICard } from "@/types/card";
import { Warning2 } from "iconsax-react";
import { useTranslation } from "react-i18next";

export default function Cards() {
  const { data, isLoading, mutate } = useSWR("/cards");
  const { t } = useTranslation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const cards = data?.data?.map((d: any) => new Card(d));

  if (!isLoading && cards.length === 0) {
    return (
      <div className="h-full w-full bg-background p-4">
        <div className="flex h-32 w-full flex-col items-center justify-center gap-4">
          <Warning2 size="38" variant="Bulk" className="text-primary-400" />
          {t("No cards found!")}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-background p-4">
      <div className="flex flex-wrap gap-4">
        {cards.map((card: ICard) => (
          <CardView
            key={card.id}
            {...{
              balance: card.wallet.balance,
              currency: card.brand,
              card,
              onMutate: mutate,
            }}
          />
        ))}
      </div>
    </div>
  );
}
