"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Separator from "@/components/ui/separator";
import Switch from "@/components/ui/switch";
import { deleteCard } from "@/data/cards/deleteCard";
import { updateCardStatus } from "@/data/cards/updateCardStatus";
import { useAuth } from "@/hooks/useAuth";
import { useBranding } from "@/hooks/useBranding";
import { copyContent, imageURL } from "@/lib/utils";
import { ICard } from "@/types/card";
import { Add, CardSlash, Copy, More } from "iconsax-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface IProps {
  currency: string;
  balance: string;
  card: ICard;
  onMutate?: () => void;
}

export default function CardView({
  card,
  balance,
  currency,
  onMutate,
}: IProps) {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const { cardBg } = useBranding();

  return (
    <div
      style={{ backgroundImage: `url(${imageURL(cardBg)})` }}
      className="mb-5 flex min-h-[280px] w-full max-w-[450px] flex-col justify-end rounded-3xl bg-cover p-5"
    >
      <div className="mb-2 flex items-center gap-2">
        {card.status === "active" ? (
          <div className="h-3 w-3 rounded-full bg-success" />
        ) : (
          <div className="h-3 w-3 rounded-full bg-danger" />
        )}
        <p className="text-sm capitalize text-white">{card.status}</p>
      </div>
      <p className="mb-5 text-2xl font-semibold text-white">
        {card?.number.replace(/(\d{4})(?=\d)/g, "$1 ")}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <div className="text-white">
            <p className="text-sm">{t("Card holder name")}</p>
            <p className="text-base font-semibold">{auth?.customer?.name}</p>
          </div>
          <div className="text-white">
            <p className="text-sm">{t("Expiry date")}</p>
            <p className="text-base font-semibold">
              {card.expMonth.toString().padStart(2, "0")}/
              {card.expYear.toString().length === 4
                ? card.expYear.toString().slice(2)
                : card.expYear.toString()}
            </p>
          </div>
          <div className="text-white">
            <p className="text-sm">{t("CVV")}</p>
            <p className="text-base font-semibold">{card.cvc}</p>
          </div>
        </div>
        <ViewCard
          card={card}
          balance={balance}
          currency={currency}
          onMutate={onMutate}
        />
      </div>
    </div>
  );
}

function ViewCard({
  card,
  balance,
  currency,
  onMutate = () => {},
}: {
  card: ICard;
  balance: string;
  currency: string;
  onMutate?: () => void;
}) {
  const { t } = useTranslation();
  const { auth } = useAuth();
  const { cardBg } = useBranding();

  const handleCardStatus = (status: string) => {
    toast.promise(
      updateCardStatus({
        cardId: card.id,
        dataList: { status },
      }),
      {
        loading: t("Loading..."),
        success: (res) => {
          if (!res.status) throw new Error(res.message);
          onMutate();
          return res.message;
        },
        error: (err) => err.message,
      },
    );
  };

  const handleCardDelete = () => {
    toast.promise(deleteCard({ cardId: card.id }), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        onMutate();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          type="button"
          className="rounded-md"
        >
          <More size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogTitle>{t("Card Details")}</DialogTitle>
        <div className="flex flex-col items-center">
          <div
            style={{ backgroundImage: `url(${imageURL(cardBg)})` }}
            className="mb-5 flex min-h-[280px] w-full max-w-[450px] flex-col justify-end gap-7 rounded-3xl bg-cover p-7"
          >
            <p className="text-[28px] font-semibold text-white">
              {card.number.replace(/(\d{4})(?=\d)/g, "$1 ")}
            </p>

            <div className="flex items-center gap-8">
              <div className="text-white">
                <p className="text-sm">{t("Card holder name")}</p>
                <p className="text-xl font-semibold">{auth?.customer?.name}</p>
              </div>
              <div className="text-white">
                <p className="text-sm">{t("Expiry date")}</p>
                <p className="text-xl font-semibold">
                  {card.expMonth.toString().padStart(2, "0")}/
                  {card.expYear.toString().length === 4
                    ? card.expYear.toString().slice(2)
                    : card.expYear.toString()}
                </p>
              </div>
              <div className="text-white">
                <p className="text-sm">{t("CVV")}</p>
                <p className="text-xl font-semibold">{card.cvc}</p>
              </div>
            </div>
          </div>

          <div className="mb-5 flex gap-8">
            <button
              type="button"
              onClick={() => copyContent(card.number)}
              className="flex flex-col items-center justify-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center gap-2 rounded-2xl bg-secondary transition duration-300 ease-in-out hover:bg-secondary-500">
                <Copy size="24" color="#000" />
              </div>
              <span className="text-xs font-semibold">{t("Copy Number")}</span>
            </button>
            <Link
              href="/deposit"
              className="flex flex-col items-center justify-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center gap-2 rounded-2xl bg-secondary transition duration-300 ease-in-out hover:bg-secondary-500">
                <Add size="24" color="#000" />
              </div>
              <span className="text-xs font-semibold">
                {t("Deposit Money")}
              </span>
            </Link>
            <button
              type="button"
              onClick={() => handleCardDelete()}
              className="flex flex-col items-center justify-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center gap-2 rounded-2xl bg-secondary text-black transition duration-300 ease-in-out hover:bg-spacial-red-foreground hover:text-danger">
                <CardSlash size="24" />
              </div>
              <span className="text-xs font-semibold">{t("Close Card")}</span>
            </button>
          </div>
          <Separator className="mb-5 border-b bg-transparent" />
          <div className="w-full space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t("Status")}</span>
              <Switch
                defaultChecked={card.status === "active"}
                onCheckedChange={(checked) => {
                  handleCardStatus(checked ? "active" : "inactive");
                }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t("Balance")}</span>
              <span className="text-sm font-semibold">
                {balance} {currency}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t("Card Type")}</span>
              <span className="text-sm font-semibold">{card?.brand}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">{t("Expiry Date")}</span>
              <span className="text-sm font-semibold">
                {card.expMonth.toString().padStart(2, "0")}/
                {card.expYear.toString().length === 4
                  ? card.expYear.toString().slice(2)
                  : card.expYear.toString()}
              </span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
