"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { TransferProfileStep } from "@/components/common/TransferProfileStep";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { useSWR } from "@/hooks/useSWR";
import { copyContent, Currency, imageURL } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { format } from "date-fns";
import {
  ArrowLeft,
  CloseCircle,
  DocumentCopy,
  InfoCircle,
  Slash,
  TickCircle,
} from "iconsax-react";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export const runtime = "edge";

export default function TransactionDetails() {
  const { t } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const { data, isLoading } = useSWR(`/transactions/trx/${params.trxId}`);

  // return loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const transaction = data?.data ? new TransactionData(data?.data) : null;
  const currency = new Currency();

  if (!transaction) {
    return (
      <div className="flex items-center justify-center gap-4 py-10">
        <Slash />
        {t("No data found")}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Left section */}
        <div className="col-span-12 lg:col-span-7">
          <div className="relative flex flex-col gap-4 rounded-xl bg-card px-2 py-8 sm:py-14">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={router.back}
              className="absolute left-4 top-4"
            >
              <ArrowLeft />
            </Button>
            <div className="inline-flex items-center justify-center gap-2.5">
              <Case condition={transaction.status === "completed"}>
                <TickCircle variant="Bulk" size={32} className="text-success" />
              </Case>
              <Case condition={transaction.status === "failed"}>
                <CloseCircle
                  variant="Bulk"
                  size={32}
                  className="text-destructive"
                />
              </Case>
              <Case condition={transaction.status === "pending"}>
                <InfoCircle variant="Bulk" size={32} className="text-primary" />
              </Case>
              <h2 className="font-semibold">
                {t("Transaction")} #{params.trxId}
              </h2>
            </div>

            {/* step */}
            <TransferProfileStep
              {...{
                senderAvatar: imageURL(transaction.from.image),
                senderName: transaction.from.label,
                senderInfo: [transaction.from?.email, transaction?.from?.phone],

                receiverAvatar: imageURL(transaction?.to?.image),
                receiverName: transaction?.to?.label,
                receiverInfo: [transaction?.to?.email, transaction?.to?.phone],
              }}
              className="px-3 sm:gap-4 sm:px-8"
            />

            <Separator className="mb-1 mt-[5px] bg-border" />

            <div className="flex flex-col">
              {/* row */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  Date
                </div>
                <div className="col-span-6 text-sm font-medium sm:text-base">
                  {transaction?.createdAt
                    ? format(transaction.createdAt, "dd MMM yyyy; hh:mm a")
                    : ""}
                </div>
              </div>

              {/* row */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  Amount
                </div>
                <div className="col-span-6 text-sm font-medium sm:text-base">
                  {currency.formatVC(
                    transaction.amount,
                    transaction.metaData.currency,
                  )}
                </div>
              </div>

              {/* row */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("Service charge")}
                </div>
                <div className="col-span-6 text-sm font-medium sm:text-base">
                  {currency.formatVC(
                    transaction.fee,
                    transaction.metaData.currency,
                  )}
                </div>
              </div>

              {/* row */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("User gets")}
                </div>
                <div className="col-span-6 text-sm font-semibold sm:text-base">
                  {currency.formatVC(
                    transaction.total,
                    transaction.metaData.currency,
                  )}
                </div>
              </div>
            </div>

            <Separator className="mb-1 mt-[5px] bg-border" />

            <div className="flex flex-col">
              {/* row */}
              <div className="grid grid-cols-12 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("Transaction ID")}
                </div>
                <div className="col-span-6 flex items-center gap-2 text-sm font-medium sm:text-base">
                  {transaction.trxId}
                  <Button
                    type="button"
                    onClick={() => copyContent(transaction.trxId)}
                    variant="outline"
                    size="sm"
                    className="bg-background hover:bg-background"
                  >
                    <DocumentCopy size="20" />
                  </Button>
                </div>
              </div>
            </div>

            <Separator className="mb-1 mt-[5px] bg-border" />
          </div>
        </div>
      </div>
    </div>
  );
}
