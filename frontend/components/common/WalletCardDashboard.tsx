"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Separator from "@/components/ui/separator";
import Switch from "@/components/ui/switch";
import { deleteCard } from "@/data/cards/deleteCard";
import { generateCard } from "@/data/cards/generateCard";
import { updateCardStatus } from "@/data/cards/updateCardStatus";
import { useAuth } from "@/hooks/useAuth";
import { useBranding } from "@/hooks/useBranding";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";
import { copyContent, imageURL } from "@/lib/utils";
import { ICard } from "@/types/card";
import { Add, CardAdd, Card as CardIcon, CardSlash, Copy } from "iconsax-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface IProps {
  title: string;
  balance: string;
  currency: string;
  walletId: number;
  card?: ICard;
  onMutate?: () => void;
}

export function WalletCardDashboard({
  card,
  title,
  balance,
  currency,
  walletId,
  onMutate,
}: IProps) {
  const { t } = useTranslation();
  const { settings } = useGlobalSettings();

  return (
    currency && (
      <Card className="w-full overflow-hidden rounded-2xl border-primary bg-gradient-to-b from-[#48E1D8] to-primary md:w-[350px]">
        <CardContent className="relative overflow-hidden px-6 py-4">
          <h2 className="text-shadow pointer-events-none absolute bottom-3 right-0 text-[104px] font-bold text-primary opacity-30">
            {currency}
          </h2>

          <div className="relative z-20 mb-4 flex items-center gap-2.5">
            <h6 className="font-bold text-primary-foreground">{title}</h6>
          </div>

          <div className="relative z-20 text-primary-foreground">
            <span className="text-xs font-normal">{t("Balance")}</span>
            <h1 className="flex items-center gap-1 align-baseline text-[32px] font-semibold leading-10">
              {Number(balance).toFixed(2)}
              <span className="text-sm font-normal leading-5">{currency}</span>
            </h1>
          </div>
        </CardContent>
        {settings?.virtual_card?.status === "on" && (
          <CardFooter className="justify-end bg-primary px-6 py-2 text-primary-foreground">
            {card?.lastFour ? (
              <>
                <div className="flex-1 text-sm font-normal leading-5">
                  **** **** **** {card?.lastFour}
                </div>
                <ViewCard
                  card={card}
                  balance={balance}
                  currency={currency}
                  onMutate={onMutate}
                />
              </>
            ) : (
              <IssueCard
                walletId={walletId}
                currency={currency}
                onMutate={onMutate}
              />
            )}
          </CardFooter>
        )}
      </Card>
    )
  );
}

function IssueCard({
  walletId,
  currency,
  onMutate = () => {},
}: {
  walletId: number;
  currency: string;
  onMutate?: () => void;
}) {
  const { t } = useTranslation();

  const handleIssueCard = () => {
    toast.promise(generateCard(walletId), {
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          disabled={
            currency?.toUpperCase() !== "USD" &&
            currency?.toUpperCase() !== "NGN"
          }
          className="text-sm font-semibold leading-5 opacity-100 hover:opacity-90"
        >
          <CardAdd size="20" />
          <span>
            {currency?.toUpperCase() === "USD" ||
            currency?.toUpperCase() === "NGN"
              ? t("Issue Card")
              : t("Card Not Available")}
          </span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("Confirm Your Card")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("Are you sure you want to issue a card for this wallet?")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
          <AlertDialogAction onClick={handleIssueCard}>
            {t("Issue Card")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
  const { cardBg } = useBranding();
  const { t } = useTranslation();
  const { auth } = useAuth();

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
          size="sm"
          className="text-sm font-semibold leading-5 opacity-100 hover:opacity-90"
        >
          <CardIcon size="20" />
          <span>{t("View Card")}</span>
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
