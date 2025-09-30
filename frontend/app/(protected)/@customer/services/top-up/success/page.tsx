"use client";

import { DownloadReceipt } from "@/components/common/DownloadReceipt";
import { Loader } from "@/components/common/Loader";
import { ReviewItem, ReviewItemList } from "@/components/common/ReviewItems";
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

import { Case } from "@/components/common/Case";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import Separator from "@/components/ui/separator";
import { savePhone } from "@/data/save";
import { toggleBookmark } from "@/data/transaction-history/toggleBookmark";
import { useSWR } from "@/hooks/useSWR";
import { useWallets } from "@/hooks/useWallets";
import cn, { copyContent, Currency } from "@/lib/utils";
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
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function TopupSuccess() {
  const { t } = useTranslation();
  const sp = useSearchParams();
  const router = useRouter();
  const { wallets, getWalletByCurrencyCode } = useWallets();
  const [contactName, setContactName] = React.useState("");
  const [showContactSaveForm, setShowContactSaveForm] = React.useState(false);

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
  const receiver = transaction?.to ? JSON.parse(transaction.to) : null;
  const metaData = transaction?.metaData
    ? JSON.parse(transaction.metaData)
    : null;

  const wallet = getWalletByCurrencyCode(wallets, sender.currency);
  const currency = new Currency(sender?.currency);

  const onSavePhone = (fd: { name: string; number: string }) => {
    toast.promise(savePhone(fd), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        setShowContactSaveForm(false);
        setContactName("");
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <div className="mx-auto h-full w-full max-w-3xl px-8 py-10">
      <h2 className="mb-1 flex items-center justify-center gap-2 text-2xl font-semibold">
        <Case condition={STATUS === "pending"}>
          <Information variant="Bold" className="size-8 text-warning" />
          <span>{t("Top-up pending")}</span>
        </Case>
        <Case condition={STATUS === "completed"}>
          <TickCircle size="32" color="#13A10E" variant="Bold" />
          <span>{t("Top-up successful")}</span>
        </Case>
        <Case condition={STATUS === "failed"}>
          <Danger variant="Bold" className="size-8 text-destructive" />
          <span>{t("Top-up failed")}</span>
        </Case>
      </h2>
      <Separator orientation="horizontal" className="my-7" />

      <ReviewItemList groupName={t("Top-up details")}>
        <ReviewItem
          title={t("Phone number")}
          value={
            <div className="flex items-center gap-1.5 font-medium">
              <Flag countryCode={metaData?.countryCode} className="w-6" />
              <span>{receiver?.label}</span>
            </div>
          }
          isLoading={isLoading}
        />
        <ReviewItem
          title={t("Recharge amount")}
          value={currency.formatVC(transaction?.amount)}
          isLoading={isLoading}
        />
        <ReviewItem
          title={t("Service charge")}
          value={
            transaction?.fee ? (
              currency.formatVC(transaction.fee)
            ) : (
              <Badge variant="success" className="font-medium">
                {t("Free")}
              </Badge>
            )
          }
          isLoading={isLoading}
        />
      </ReviewItemList>
      <ReviewItem
        title={t("Total")}
        value={currency.formatVC(transaction?.total)}
        isLoading={isLoading}
      />

      <Separator orientation="horizontal" className="my-7" />

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
        <DownloadReceipt trxId={metaData?.transactionId} />

        <div className="flex w-full flex-wrap gap-4 md:w-auto md:justify-end">
          {/* Download or bookmark receipt  */}
          <Dialog
            open={showContactSaveForm}
            onOpenChange={setShowContactSaveForm}
          >
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
                {/* copy transaction id */}
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
                  onSelect={() => router.push("/services/top-up")}
                  className="flex items-center gap-2 text-sm font-medium focus:text-primary"
                >
                  <ArrowRotateRight size="20" variant="Outline" />
                  {t("Top-up again")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DialogContent>
              <DialogHeader>
                <DialogTitle className="hidden" />
                <DialogDescription className="hidden" />
              </DialogHeader>

              <div>
                <Input
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-end">
                <Button
                  onClick={() => {
                    onSavePhone({
                      name: contactName,
                      number: receiver?.label as string,
                    });
                  }}
                  type="button"
                >
                  Save
                </Button>
              </div>
            </DialogContent>

            {/* write contact name */}
          </Dialog>
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
