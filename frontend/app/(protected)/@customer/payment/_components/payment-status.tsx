"use client";

import { Case } from "@/components/common/Case";
import { DownloadReceipt } from "@/components/common/DownloadReceipt";
import { ReviewItem, ReviewItemList } from "@/components/common/ReviewItems";
import { TransactionIdRow } from "@/components/common/TransactionIdRow";
import { TransferProfileStep } from "@/components/common/TransferProfileStep";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Separator from "@/components/ui/separator";
import { saveMerchant } from "@/data/save";
import { useWallets } from "@/hooks/useWallets";
import cn, { copyContent, Currency, imageURL } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import {
  ArrowRight2,
  ArrowRotateRight,
  CloseCircle,
  DocumentCopy,
  More,
  Save2,
  TickCircle,
} from "iconsax-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function PaymentStatus({
  formResponse,
  onPaymentAgain,
  merchant,
}: {
  formResponse: any;
  onPaymentAgain: () => void;
  merchant: any;
}) {
  const router = useRouter();

  const { t } = useTranslation();

  const response = formResponse?.data;

  // get wallet information
  const { wallets, getWalletByCurrencyCode } = useWallets();
  const wallet = getWalletByCurrencyCode(wallets, response?.from?.currency);

  const currency = new Currency(response?.metaData?.currency);

  const handleSaveMerchant = () => {
    toast.promise(
      saveMerchant({
        merchantId: String(merchant?.merchantId),
      }),
      {
        loading: t("Loading..."),
        success: (res) => {
          if (!res?.status) {
            throw new Error(res.message);
          }
          return res.message;
        },
        error: (err) => err.message,
      },
    );
  };

  return (
    <div>
      <h2 className="mb-1 flex items-center justify-center gap-2 text-2xl font-semibold text-foreground">
        <Case condition={response?.status === "completed"}>
          <TickCircle size="32" color="#13A10E" variant="Bold" />
        </Case>
        <Case condition={response?.status === "failed"}>
          <CloseCircle size="32" color="#C72400" variant="Bold" />
        </Case>
        <span>
          {t("Payment")} {response?.status}
        </span>
      </h2>

      <Separator orientation="horizontal" className="my-7" />

      <TransferProfileStep
        className="mb-8"
        senderAvatar={imageURL(response?.from?.image)}
        senderName={response?.from?.label}
        receiverAvatar={imageURL(response?.to?.image)}
        receiverName={response?.to?.label}
      />

      {/* Payment details */}
      <ReviewItemList groupName={t("Payment details")}>
        <ReviewItem
          title={`${response?.to?.label} will get`}
          value={currency.formatVC(response?.amount)}
        />

        <ReviewItem
          title={t("Service charge")}
          value={
            <Badge variant="success" className="font-medium">
              {t("Free")}
            </Badge>
          }
        />

        <ReviewItem
          title={t("Total")}
          value={currency.formatVC(response?.amount)}
        />
      </ReviewItemList>

      <Separator orientation="horizontal" className="my-7" />

      <Case condition={response?.status === "completed"}>
        <TransactionIdRow
          id={response?.trxId}
          className="mb-4 text-sm sm:text-base"
        />
      </Case>

      <div className="mb-8 space-y-4 text-sm sm:text-base">
        <h5 className="text-sm font-medium sm:text-base">{t("New balance")}</h5>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={response?.from?.currency} />
              <AvatarFallback className="bg-black text-white">
                {getAvatarFallback(response?.from?.currency)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold">
              {response?.from?.currency}
            </span>
          </div>
          <p className="text-sm font-medium sm:text-base">
            {wallet?.balance} {wallet?.currency?.code}
          </p>
        </div>
      </div>

      {/* Active */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Download Receipt */}
        <DownloadReceipt
          trxId={response?.trxId as string}
          className="w-full md:w-auto"
        />

        <div className="flex w-full flex-wrap gap-4 md:w-auto md:justify-end">
          {/* Download or bookmark receipt  */}
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
                onSelect={() => copyContent(response?.trxId)}
                className="flex items-center gap-2 text-sm font-medium focus:text-primary"
              >
                <DocumentCopy variant="Outline" size="20" />
                {t("Copy transaction ID")}
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={handleSaveMerchant}
                className="flex items-center gap-2 text-sm font-medium focus:text-primary"
              >
                <Save2 size="20" variant="Outline" />
                {t("Add to favorites")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={onPaymentAgain}
                className="flex items-center gap-2 text-sm font-medium focus:text-primary"
              >
                <ArrowRotateRight size="20" variant="Outline" />
                {t("Payment again")}
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
