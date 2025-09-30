"use client";

import { Loader } from "@/components/common/Loader";
import { TransferProfileStep } from "@/components/common/TransferProfileStep";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { useSWR } from "@/hooks/useSWR";
import { copyContent, Currency, imageURL } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { DocumentCopy, Slash, TickCircle } from "iconsax-react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function TransferDetails() {
  const { t } = useTranslation();
  const params = useParams();
  const { data, isLoading } = useSWR(`/admin/transfers/${params.transferId}`);

  // return loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const transfer = data?.data ? new TransactionData(data?.data) : null;
  const currency = new Currency();

  if (!transfer) {
    return (
      <div className="flex items-center justify-center gap-4 py-10">
        <Slash />
        {t("No data found")}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex w-full max-w-[616px] flex-col gap-4 rounded-xl bg-card px-2 py-8 sm:py-14">
        <div className="inline-flex items-center justify-center gap-2.5">
          <TickCircle variant="Bulk" size={32} className="text-success" />
          <h2 className="font-semibold">
            {t("Transfer")} #{params.transferId}
          </h2>
        </div>

        {/* step */}
        <TransferProfileStep
          {...{
            senderAvatar: imageURL(transfer.from.image),
            senderName: transfer.from.label,
            senderInfo: [transfer.from?.email, transfer?.from?.phone],

            receiverAvatar: imageURL(transfer?.to?.image),
            receiverName: transfer?.to?.label,
            receiverInfo: [transfer?.to?.email, transfer?.to?.phone],
          }}
          className="px-3 sm:gap-4 sm:px-8"
        />

        <Separator className="mb-1 mt-[5px] bg-border" />

        <div className="flex flex-col">
          {/* row */}
          <div className="grid grid-cols-12 px-6 py-3 odd:bg-accent">
            <div className="col-span-6 text-sm font-normal sm:text-base">
              {t("Amount Sent")}
            </div>
            <div className="col-span-6 text-sm font-medium sm:text-base">
              {currency.formatVC(transfer.amount, transfer.metaData.currency)}
            </div>
          </div>

          {/* row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 odd:bg-accent">
            <div className="col-span-6 text-sm font-normal sm:text-base">
              {t("Service charge")}
            </div>
            <div className="col-span-6 text-sm font-medium sm:text-base">
              {currency.formatVC(transfer.fee, transfer.metaData.currency)}
            </div>
          </div>

          {/* row */}
          <div className="grid grid-cols-12 gap-4 px-6 py-3 odd:bg-accent">
            <div className="col-span-6 text-sm font-normal sm:text-base">
              {t("User gets")}
            </div>
            <div className="col-span-6 text-sm font-semibold sm:text-base">
              {currency.formatVC(transfer.total, transfer.metaData.currency)}
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
              {transfer.trxId}
              <Button
                type="button"
                onClick={() => copyContent(transfer.trxId)}
                variant="outline"
                size="sm"
                className="bg-background hover:bg-background"
              >
                <DocumentCopy size="20" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
