"use client";

import { Case } from "@/components/common/Case";
import { DownloadReceipt } from "@/components/common/DownloadReceipt";
import { Loader } from "@/components/common/Loader";
import { ReviewItem, ReviewItemList } from "@/components/common/ReviewItems";
import { TransactionIdRow } from "@/components/common/TransactionIdRow";
import { TransferProfileStep } from "@/components/common/TransferProfileStep";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Separator from "@/components/ui/separator";
import { toggleBookmark } from "@/data/transaction-history/toggleBookmark";
import axios from "@/lib/axios";
import cn, { copyContent, Currency, imageURL } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import {
  ArrowRight2,
  ArrowRotateRight,
  Danger,
  DocumentCopy,
  Information,
  More,
  Save2,
  TickCircle,
} from "iconsax-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import useSWR from "swr";
import { Balance } from "./Balance";

export default function Finish() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();

  // fetch data by trxId
  const { data, isLoading } = useSWR(
    `/transactions/trx/${searchParams.get("trxId")}`,
    (u: string) => axios(u),
  );

  // transaction bookmark handler
  const handleBookmarkRequest = (id: number) => {
    toast.promise(toggleBookmark(`${id}`), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res?.status) {
          throw new Error(res.message);
        }
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  // return loading state on fetching api
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  // transaction data
  const transaction = data?.data;
  const STATUS = searchParams.get("status") || transaction?.status;
  const sender = transaction?.from ? JSON.parse(transaction.from) : null;
  const receiver = transaction?.to ? JSON.parse(transaction.to) : null;
  const metaData = transaction?.metaData
    ? JSON.parse(transaction.metaData)
    : null;

  const currency = new Currency(metaData?.currency);

  return (
    <div className="mx-auto h-full w-full max-w-3xl px-8 py-10">
      <h2 className="mb-1 flex items-center justify-center gap-2 text-2xl font-semibold text-foreground">
        <Case condition={STATUS === "pending"}>
          <Information variant="Bold" className="size-8 text-warning" />
          <span>{t("Deposit pending")}</span>
        </Case>
        <Case condition={STATUS === "completed"}>
          <TickCircle size="32" color="#13A10E" variant="Bold" />
          <span>{t("Deposit successful")}</span>
        </Case>
        <Case condition={STATUS === "failed"}>
          <Danger variant="Bold" className="size-8 text-destructive" />
          <span>{t("Deposit failed")}</span>
        </Case>
      </h2>
      <Separator orientation="horizontal" className="my-7" />

      <TransferProfileStep
        className="mb-8"
        {...{
          senderName: sender?.label,
          senderAvatar: imageURL(sender?.image),
          receiverName: receiver?.label,
          receiverAvatar: imageURL(receiver?.image),
        }}
      />

      {/* Deposit details */}
      <ReviewItemList groupName={t("Deposit details")}>
        <ReviewItem
          title={t("Amount")}
          value={currency.formatVC(
            Number(transaction?.amount) + Number(transaction?.fee),
          )}
        />
        <ReviewItem
          title={t("Fee")}
          value={`-${currency.formatVC(transaction?.fee)}`}
        />
        <ReviewItem
          title={t("You get")}
          value={currency.formatVC(transaction?.total)}
        />
      </ReviewItemList>

      <Separator orientation="horizontal" className="my-7" />

      <TransactionIdRow
        className="mb-4 text-sm sm:text-base"
        id={transaction?.trxId}
      />

      <div className="mb-8 space-y-4">
        <Case condition={STATUS === "completed"}>
          <>
            <h4 className="font-medium">{t("New balance")}</h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={metaData?.currency} />
                  <AvatarFallback className="bg-black text-white">
                    {getAvatarFallback(metaData?.currency)}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-bold">{metaData?.currency}</span>
              </div>
              <Balance currencyCode={metaData?.currency} />
            </div>
          </>
        </Case>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Download recept */}
        <DownloadReceipt trxId={transaction?.trxId as string} />

        {/* Download or bookmark receipt  */}
        <div className="flex w-full flex-wrap gap-4 md:w-auto md:justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "flex w-full items-center space-x-1.5 md:w-fit",
                buttonVariants({ variant: "outline" }),
              )}
            >
              <span>{t("Menu")}</span>
              <More size={16} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="m-0">
              <DropdownMenuItem
                onSelect={() => copyContent(transaction?.trxId)}
                className="flex items-center gap-2 text-sm font-medium focus:text-primary"
              >
                <DocumentCopy size="20" />
                {t("Copy transaction ID")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => handleBookmarkRequest(transaction?.id)}
                className="flex items-center gap-2 text-sm font-medium focus:text-primary"
              >
                <Save2 size="20" variant="Outline" />
                {t("Bookmark receipt")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => router.push("/deposit")}
                className="flex items-center gap-2 text-sm font-medium focus:text-primary"
              >
                <ArrowRotateRight size="20" variant="Outline" />
                {t("Deposit again")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            type="button"
            onClick={() => router.push("/")}
            className="w-full md:max-w-48"
          >
            <span>{t("Go to dashboard")}</span>
            <ArrowRight2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}
