"use client";

import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { acceptWithdrawRequest } from "@/data/withdraw/acceptWithdrawRequest";
import { declineWithdrawRequest } from "@/data/withdraw/declineWithdrawRequest";
import { useSWR } from "@/hooks/useSWR";
import { copyContent, Currency, imageURL } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { format } from "date-fns";
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

export default function WithdrawDetails() {
  const { t } = useTranslation();
  const params = useParams();
  const { data, isLoading, mutate } = useSWR(
    `/transactions/trx/${params.trxId}`,
  );

  // return loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  // handle deposit request
  const handleAcceptWithdrawRequest = (id: number | string) => {
    toast.promise(acceptWithdrawRequest(id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        mutate(data);
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  const rejectWithdrawRequest = (id: number | string) => {
    toast.promise(declineWithdrawRequest(id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        mutate(data);
        return res.message;
      },
      error: (err) => err.message,
    });
  };

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

  return (
    <div className="mb-10 p-2 sm:mb-0 sm:p-4">
      <div className="grid grid-cols-12 gap-4">
        {/* Left section */}
        <div className="col-span-12 lg:col-span-7">
          <div className="flex flex-col gap-4 rounded-xl bg-card px-2 py-8 sm:py-14">
            <div className="inline-flex items-center justify-center gap-2.5">
              <MinusCirlce variant="Bulk" size={32} className="text-primary" />
              <h2 className="font-semibold">
                {t("Withdraw")}#{params.withdrawId}
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

            {withdraw.status === "pending" ? (
              <div className="flex items-center justify-center gap-4">
                <Button
                  type="button"
                  onClick={() => handleAcceptWithdrawRequest(withdraw?.id)}
                  className="gap-1 rounded-lg bg-spacial-green px-4 py-2 font-medium text-background hover:bg-[#219621] hover:text-background"
                >
                  <TickCircle />
                  {t("Approve")}
                </Button>

                <Button
                  type="button"
                  onClick={() => rejectWithdrawRequest(withdraw?.id)}
                  className="gap-1 rounded-lg bg-[#D13438] px-4 py-2 font-medium text-white hover:bg-[#a5272b] hover:text-white"
                >
                  <CloseCircle />
                  {t("Reject")}
                </Button>
              </div>
            ) : null}
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
              {/* Row */}
              <div className="grid grid-cols-12 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("Method used")}
                </div>
                <div className="col-span-6 text-sm font-medium sm:text-base">
                  {withdraw?.metaData?.agentMethod ?? "--"}
                </div>
              </div>

              {/* Row */}
              <div className="grid grid-cols-12 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("Number")}
                </div>
                <div className="col-span-6 text-sm font-medium sm:text-base">
                  {withdraw?.metaData?.value ?? "--"}
                </div>
              </div>

              {/* Row */}
              <div className="grid grid-cols-12 px-6 py-3 odd:bg-accent">
                <div className="col-span-6 text-sm font-normal sm:text-base">
                  {t("Wallet")}
                </div>
                <div className="col-span-6 text-sm font-medium sm:text-base">
                  {withdraw?.metaData?.currency ?? "undefine"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
