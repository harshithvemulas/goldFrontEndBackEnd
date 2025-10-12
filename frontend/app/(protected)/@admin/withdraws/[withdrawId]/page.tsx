"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { changeWithdrawAdmin } from "@/data/withdraw/changeWithdrawAdmin";
import { useSWR } from "@/hooks/useSWR";
import { copyContent, Currency, imageURL } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { format } from "date-fns";
import {
  CloseCircle,
  DocumentCopy,
  InfoCircle,
  Slash,
  TickCircle,
} from "iconsax-react";
import { useParams } from "next/navigation";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const runtime = "edge";

export default function WithdrawDetails() {
  const { t } = useTranslation();
  const params = useParams();
  const { data, isLoading, mutate } = useSWR(
    `/admin/withdraws/${params.withdrawId}`,
  );

  // return loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const withdraw = data?.data ? new TransactionData(data?.data) : null;
  const currency = new Currency();

  if (!withdraw) {
    return (
      <div className="flex items-center justify-center gap-4 py-10">
        <Slash />
        {t("No data found")}
      </div>
    );
  }

  const metaDataArray = withdraw?.metaData?.params
    ? Object.entries(withdraw.metaData?.params)
        .filter(([key]) => key !== "trxSecret")
        .map(([key, value]) => ({ key, value }))
    : [];

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const handleWithdrawApprove = () => {
    toast.promise(changeWithdrawAdmin(data?.data?.id, "accept"), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res?.status) throw new Error(res.message);
        mutate(data);
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  const handleWithdrawDecline = () => {
    toast.promise(changeWithdrawAdmin(data?.data?.id, "decline"), {
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
        <div className="col-span-12 lg:col-span-7">
          <div className="mb-4 flex flex-col gap-4 rounded-xl bg-card px-2 py-8 sm:py-14">
            <div className="inline-flex items-center justify-center gap-2.5">
              <Case condition={withdraw.status === "completed"}>
                <TickCircle variant="Bulk" size={32} className="text-success" />
              </Case>
              <Case condition={withdraw.status === "failed"}>
                <CloseCircle
                  variant="Bulk"
                  size={32}
                  className="text-destructive"
                />
              </Case>
              <Case condition={withdraw.status === "pending"}>
                <InfoCircle variant="Bulk" size={32} className="text-primary" />
              </Case>
              <h2 className="font-semibold">
                {t("Withdraw")} #{params.withdrawId}
              </h2>
            </div>


            <Separator className="mb-1 mt-[5px] bg-border" />

            <div className="flex flex-col">
              {/* row */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("Date")}
                </div>
                <div className="col-span-6 text-sm font-medium sm:text-base">
                  {withdraw?.createdAt
                    ? format(withdraw.createdAt, "dd MMM yyyy; hh:mm a")
                    : ""}
                </div>
              </div>

              {/* row */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("Amount")}
                </div>
                <div className="col-span-6 text-sm font-medium sm:text-base">
                  {currency.formatVC(
                    withdraw.amount,
                    withdraw.metaData.currency,
                  )}
                </div>
              </div>

              {/* row */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("Service charge")}
                </div>
                <div className="col-span-6 text-sm font-medium sm:text-base">
                  {currency.formatVC(withdraw.fee, withdraw.metaData.currency)}
                </div>
              </div>

              {/* row */}
              <div className="grid grid-cols-12 gap-4 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("User gets")}
                </div>
                <div className="col-span-6 text-sm font-semibold sm:text-base">
                  {currency.formatVC(
                    withdraw.total,
                    withdraw.metaData.currency,
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
                  {withdraw.trxId}
                  <Button
                    type="button"
                    onClick={() => copyContent(withdraw.trxId)}
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
            <h4>{t("Withdraw request")}</h4>
            <Case condition={withdraw?.status === "completed"}>
              <p>{t("Withdraw approved")}</p>
            </Case>

            <Case condition={withdraw?.status === "failed"}>
              <p>{t("Withdraw failed")}</p>
            </Case>

            <Case condition={withdraw?.status === "pending"}>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  className="bg-[#0B6A0B] text-white hover:bg-[#149014]"
                  onClick={handleWithdrawApprove}
                >
                  <TickCircle />
                  {t("Accept withdraw")}
                </Button>

                <Button
                  type="button"
                  className="bg-[#D13438] text-white hover:bg-[#b42328]"
                  onClick={handleWithdrawDecline}
                >
                  <CloseCircle />
                  {t("Reject withdraw")}
                </Button>
              </div>
            </Case>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-span-12 lg:col-span-5">
          <div className="mb-4 flex flex-col gap-8 rounded-xl bg-card px-2 py-6">
            <div className="flex items-center justify-center">
              <h2>{t("Method info")}</h2>
            </div>

            <Separator className="mb-1 mt-[5px] bg-border" />

            <div className="flex flex-col">
              <div className="grid grid-cols-12 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("Method used")}
                </div>
                <div className="col-span-6 text-sm font-medium sm:text-base">
                  {withdraw?.method}
                </div>
              </div>

              {/* Row */}
              <div className="grid grid-cols-12 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("Currency")}
                </div>
                <div className="col-span-6 text-sm font-medium sm:text-base">
                  {withdraw?.metaData?.currency ?? "N/A"}
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
                      {meta.value as string}
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
