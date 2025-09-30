"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { TransferProfileStep } from "@/components/common/TransferProfileStep";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { changeDepositAdmin } from "@/data/deposit/changeDepositAdmin";
import { useSWR } from "@/hooks/useSWR";
import { copyContent, Currency, imageURL } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import {
  CloseCircle,
  DocumentCopy,
  MinusCirlce,
  Slash,
  TickCircle,
} from "iconsax-react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const runtime = "edge";

export default function DepositDetails() {
  const params = useParams();
  const { data, isLoading, mutate } = useSWR(
    `/admin/deposits/${params.depositId}`,
  );

  const { t } = useTranslation();

  // return loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const deposit = data?.data ? new TransactionData(data?.data) : null;
  const currency = new Currency();

  if (!deposit) {
    return (
      <div className="flex items-center justify-center gap-4 py-10">
        <Slash />
        {t("No data found")}
      </div>
    );
  }

  const metaDataArray = deposit?.metaData
    ? Object.entries(deposit.metaData)
        .filter(([key]) => key !== "trxSecret")
        .map(([key, value]) => ({ key, value }))
    : [];

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const handleDepositApprove = () => {
    toast.promise(changeDepositAdmin(data?.data?.id, "accept"), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res?.status) throw new Error(res.message);
        mutate(data);
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  const handleDepositDecline = () => {
    toast.promise(changeDepositAdmin(data?.data?.id, "decline"), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res?.status) throw new Error(res.message);
        mutate(data);
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Left section */}
        <div className="col-span-12 md:col-span-7">
          <div className="mb-4 flex flex-col gap-4 rounded-xl bg-card px-2 py-8 sm:py-14">
            <div className="inline-flex items-center justify-center gap-2.5">
              <MinusCirlce variant="Bulk" size={32} className="text-primary" />
              <h2 className="font-semibold">
                {" "}
                {t("Deposit")} #{params.depositId}
              </h2>
            </div>

            {/* step */}
            <TransferProfileStep
              {...{
                senderAvatar: imageURL(deposit.from.image),
                senderName: deposit.from.label,
                senderInfo: [deposit.from?.email, deposit?.from?.phone],

                receiverAvatar: imageURL(deposit?.to?.image),
                receiverName: deposit?.to?.label,
                receiverInfo: [deposit?.to?.email, deposit?.to?.phone],
              }}
              className="px-3 sm:gap-4 sm:px-8"
            />

            <Separator className="mb-1 mt-[5px] bg-border" />

            <div className="flex flex-col">
              {/* row */}
              <div className="grid grid-cols-12 px-3 py-3 odd:bg-accent sm:px-6">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("Amount")}
                </div>
                <div className="col-span-6 pl-2.5 text-sm font-medium sm:text-base">
                  {currency.formatVC(deposit.amount, deposit.metaData.currency)}
                </div>
              </div>

              {/* row */}
              <div className="grid grid-cols-12 gap-4 px-3 py-3 odd:bg-accent sm:px-6">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("Service charge")}
                </div>
                <div className="col-span-6 pl-2.5 text-sm font-medium sm:text-base">
                  {currency.formatVC(deposit.fee, deposit.metaData.currency)}
                </div>
              </div>

              {/* row */}
              <div className="grid grid-cols-12 gap-4 px-3 py-3 odd:bg-accent sm:px-6">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("User gets")}
                </div>
                <div className="col-span-6 pl-2.5 text-sm font-semibold sm:text-base">
                  {currency.formatVC(deposit.total, deposit.metaData.currency)}
                </div>
              </div>
            </div>

            <Separator className="mb-1 mt-[5px] bg-border" />

            <div className="flex flex-col">
              {/* row */}
              <div className="grid grid-cols-12 px-3 py-3 odd:bg-accent sm:px-6">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("Transaction ID")}
                </div>
                <div className="col-span-6 flex items-center gap-2 text-sm font-medium sm:text-base">
                  {deposit.trxId}
                  <Button
                    type="button"
                    onClick={() => copyContent(deposit.trxId)}
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
          <div className="flex flex-col gap-4 rounded-xl bg-card px-4 py-6">
            <h4>{t("Deposit request")}</h4>
            <Case condition={deposit?.status === "completed"}>
              <p>{t("Deposit approved")}</p>
            </Case>
            <Case condition={deposit?.status === "failed"}>
              <p>{t("Deposit failed")}</p>
            </Case>

            <Case condition={deposit?.status === "pending"}>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  className="bg-[#0B6A0B] text-white hover:bg-[#149014]"
                  onClick={handleDepositApprove}
                >
                  <TickCircle />
                  {t("Accept deposit")}
                </Button>

                <Button
                  type="button"
                  className="bg-[#D13438] text-white hover:bg-[#b42328]"
                  onClick={handleDepositDecline}
                >
                  <CloseCircle />
                  {t("Reject deposit")}
                </Button>
              </div>
            </Case>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-12 md:col-span-5">
          <div className="mb-4 flex flex-col gap-8 rounded-xl bg-card px-2 py-6">
            <div className="flex items-center justify-center">
              <h2>{t("Method info")}</h2>
            </div>

            <Separator className="mb-1 mt-[5px] bg-border" />

            <div className="flex flex-col">
              {/* Row */}
              <div className="grid grid-cols-12 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-base font-normal">
                  {t("Method used")}
                </div>
                <div className="col-span-6 text-base font-medium">
                  {deposit?.method}
                </div>
              </div>

              {/* Row */}
              <div className="grid grid-cols-12 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-base font-normal">
                  {t("Wallet")}
                </div>
                <div className="col-span-6 text-base font-medium">
                  {deposit?.currency}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex flex-col gap-8 rounded-xl bg-card px-2 py-6">
            <div className="flex items-center justify-center">
              <h2>{t("Additional info")}</h2>
            </div>

            <Separator className="mb-1 mt-[5px] bg-border" />

            <div className="flex flex-col">
              {
                // Meta data
                metaDataArray.map((meta, i) => (
                  <div
                    key={meta.key}
                    className={`grid grid-cols-12 px-6 py-3 ${
                      i % 2 === 0 ? "bg-accent" : ""
                    }`}
                  >
                    <div className="col-span-6 text-sm font-normal sm:text-base">
                      {formatKey(meta.key)}
                    </div>
                    <div className="col-span-6 text-sm font-medium sm:text-base">
                      {meta.value || "N/A"}
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
