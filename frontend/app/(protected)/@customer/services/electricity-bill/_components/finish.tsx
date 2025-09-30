"use client";

import { TElectricityBillFormData } from "@/app/(protected)/@customer/services/electricity-bill/page";
import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { ReviewItem, ReviewItemList } from "@/components/common/ReviewItems";
import { TransactionIdRow } from "@/components/common/TransactionIdRow";
import { Flag } from "@/components/icons/Flag";
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
import { toggleBookmark } from "@/data/transaction-history/toggleBookmark";
import { useSWR } from "@/hooks/useSWR";
import { useWallets } from "@/hooks/useWallets";
import cn, { copyContent, Currency, shapePhoneNumber } from "@/lib/utils";
import {
  ArrowRotateRight,
  Danger,
  DocumentCopy,
  DocumentDownload,
  Information,
  More,
  Save2,
  TickCircle,
} from "iconsax-react";
import { parsePhoneNumber } from "libphonenumber-js";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function Finish({
  formData,
}: {
  formData: TElectricityBillFormData;
}) {
  const { t } = useTranslation();
  const sp = useSearchParams();
  const router = useRouter();
  const { wallets, getWalletByCurrencyCode } = useWallets();

  // fetch data by trxId
  const { data, isLoading } = useSWR(`/transactions/trx/${sp.get("trxId")}`);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

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

  // transaction data
  const transaction = data?.data;
  const STATUS = transaction?.status;
  const sender = transaction?.from ? JSON.parse(transaction.from) : null;
  const metaData = transaction?.metaData
    ? JSON.parse(transaction.metaData)
    : null;

  const wallet = getWalletByCurrencyCode(wallets, sender.currency);
  const currency = new Currency(sender?.currency);

  const phone = parsePhoneNumber(shapePhoneNumber(formData.phone_number ?? ""));

  return (
    <div className="mx-auto max-w-3xl">
      <h2 className="mb-1 flex items-center justify-center gap-2 text-2xl font-semibold text-foreground">
        <Case condition={STATUS === "pending"}>
          <Information variant="Bold" className="size-8 text-warning" />
          <span>{t("Payment pending")}</span>
        </Case>
        <Case condition={STATUS === "completed"}>
          <TickCircle size="32" color="#13A10E" variant="Bold" />
          <span>{t("Payment successful")}</span>
        </Case>
        <Case condition={STATUS === "failed"}>
          <Danger variant="Bold" className="size-8 text-destructive" />
          <span>{t("Payment failed")}</span>
        </Case>
      </h2>
      <Separator orientation="horizontal" className="my-7" />
      {/* Meter details */}

      <ReviewItemList groupName={t("Meter details")}>
        <ReviewItem
          title={t("Phone number")}
          value={
            <div className="flex items-center gap-2">
              <Flag countryCode={phone.country} />
              {phone.formatInternational()}
            </div>
          }
        />

        <ReviewItem title={t("Electricity name")} value="Electricity 1" />
        <ReviewItem
          title={t("Meter type")}
          value={
            <Badge className="bg-primary text-primary-foreground">
              {formData.meter_type}
            </Badge>
          }
        />
        <ReviewItem title={t("Meter number")} value={formData.meter_number} />
      </ReviewItemList>

      <Separator className="my-8" />

      {/* Payment details */}
      <ReviewItemList groupName={t("Payment details")}>
        <ReviewItem
          title={`${metaData?.billerName} ${t("will get")}`}
          value={currency.formatVC(transaction?.amount)}
        />
        <ReviewItem
          title={t("Service charge")}
          value={
            <>
              <Case condition={transaction?.fee === 0}>
                <Badge className="bg-success text-success-foreground">
                  {t("Free")}
                </Badge>
              </Case>

              <Case condition={transaction?.fee !== 0}>
                {currency.formatVC(transaction?.fee)}
              </Case>
            </>
          }
        />
        <ReviewItem
          title={t("Total")}
          value={currency.formatVC(transaction?.total)}
        />
      </ReviewItemList>

      <Separator orientation="horizontal" className="my-7" />

      <TransactionIdRow
        id={metaData?.transactionId}
        className="mb-4 text-sm sm:text-base"
      />
      <div className="mb-8 space-y-4">
        <h5 className="text-sm font-medium sm:text-base">{t("New balance")}</h5>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Avatar>
              <AvatarImage src={wallet?.logo} />
              <AvatarFallback className="bg-important font-bold text-important-foreground">
                {wallet?.currency?.code}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-bold">{wallet?.currency?.code}</span>
          </div>
          <p className="font-medium">
            {currency.formatVC(Number(wallet?.balance ?? 0))}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Button variant="outline" type="button" className="w-full md:w-auto">
          <DocumentDownload size={16} />
          <span>{t("Download Receipt")}</span>
        </Button>
        <div className="flex w-full flex-wrap gap-4 sm:flex-nowrap md:w-auto md:justify-end">
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
                onSelect={() => copyContent(metaData?.transactionId)}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <DocumentCopy
                  size="20"
                  className="text-primary"
                  variant="Outline"
                />
                {t("Copy transaction ID")}
              </DropdownMenuItem>

              {/* Bookmark */}
              <DropdownMenuItem
                onSelect={() =>
                  handleBookmarkRequest(transaction?.id as number)
                }
                className="flex items-center gap-2 text-sm font-medium focus:text-primary"
              >
                <Save2 size="20" variant="Outline" />
                {t("Bookmark receipt")}
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onSelect={() => router.push("/services/electricity-bill")}
                className="flex items-center gap-2 text-sm font-medium"
              >
                <ArrowRotateRight size="20" variant="Outline" />
                {t("Pay bill again")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button type="button" className="w-full md:max-w-48" asChild>
            <Link href="/services">{t("Go to dashboard")}</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
