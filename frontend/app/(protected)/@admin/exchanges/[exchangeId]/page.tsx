"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Separator from "@/components/ui/separator";
import { acceptExchangeMoney } from "@/data/exchanges/admin/acceptExchange";
import { changeExchangeRate } from "@/data/exchanges/admin/changeExchangeRate";
import { declineExchangeMoney } from "@/data/exchanges/admin/declineExchange";
import { useSWR } from "@/hooks/useSWR";
import { Currency, startCase } from "@/lib/utils";
import { TransactionData } from "@/types/transaction-data";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { CloseCircle, Edit2, Slash, TickCircle } from "iconsax-react";
import { Check, X } from "lucide-react";
import { useParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const currency = new Currency();

export default function ExchangeDetails() {
  const params = useParams();
  const [isEditMode, setIsEditMode] = React.useState(false);
  const { data, isLoading, mutate } = useSWR(`/exchanges/${params.exchangeId}`);
  const [rate, setRate] = useState("");
  const editableContentRef = React.useRef<HTMLDivElement>(null);

  const { t } = useTranslation();

  const exchange = useMemo(
    () => (data?.data ? new TransactionData(data?.data) : null),
    [data?.data],
  );

  React.useEffect(() => {
    if (exchange?.metaData?.exchangeRate) {
      setRate(exchange?.metaData?.exchangeRate);
    }
  }, [exchange]);

  // handle focus edit exchange rate
  const handleEditFocus = () => {
    setIsEditMode(true);
    editableContentRef.current?.focus();
    const range = document.createRange();
    range.selectNodeContents(editableContentRef.current as Node);
    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  };

  //  handle exchange edit
  const handleChangeExchangeRate = (content: string | null | undefined) => {
    if (!content) return;
    setIsEditMode(false);

    if (Number.isNaN(content)) {
      toast.error(t("Please enter a numeric value."));
      handleEditFocus();
      return;
    }

    if (exchange?.metaData?.exchangeRate?.toString() !== content?.toString()) {
      toast.promise(
        changeExchangeRate(params.exchangeId as string, Number(content)),
        {
          loading: "Processing...",
          success: (res) => {
            if (!res?.status) throw new Error(res.message);
            mutate(data);
            return t(res.message);
          },
          error: (err) => {
            handleEditFocus();
            return t(err.message);
          },
        },
      );
    }
  };

  // return loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  if (!exchange) {
    return (
      <div className="flex items-center justify-center gap-4 py-10">
        <Slash />
        {t("No data found")}
      </div>
    );
  }

  const onApprove = () => {
    toast.promise(acceptExchangeMoney(exchange?.id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        mutate(data);
        return t(res.message);
      },
      error: (err) => t(err.message),
    });
  };

  const onReject = () => {
    toast.promise(declineExchangeMoney(exchange?.id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        mutate(data);
        return t(res.message);
      },
      error: (err) => t(err.message),
    });
  };

  return (
    <div className="p-4">
      <div className="flex w-full max-w-[616px] flex-col gap-4 rounded-xl bg-card px-2 py-14">
        <div className="inline-flex items-center justify-center gap-2.5">
          <TickCircle variant="Bulk" size={32} className="text-success" />
          <h2 className="font-semibold">
            {t("Exchange")} #{exchange?.id}
          </h2>
        </div>

        {/* step */}
        <div className="flex flex-col items-center rounded-full">
          {/* avatar */}
          <Avatar className="mb-1">
            <AvatarImage
              src={exchange?.user?.customer?.avatar}
              alt={exchange?.user?.customer?.name as string}
            />
            <AvatarFallback className="font-bold">
              {getAvatarFallback(exchange?.user?.customer?.name as string)}
            </AvatarFallback>
          </Avatar>

          <h5 className="text-sm font-medium sm:text-base">
            {exchange?.user?.customer?.name}
          </h5>
          <p className="text-xs text-secondary-text sm:text-sm">
            {exchange?.user?.email}
          </p>
          <p className="text-xs text-secondary-text sm:text-sm">
            {exchange?.user?.customer?.phone}
          </p>
        </div>

        <Separator className="mb-1 mt-[5px] bg-border" />

        <div className="flex flex-col">
          <table className="w-full table-auto border-collapse">
            <tbody>
              {/* Exchange from */}
              <tr className="odd:bg-accent">
                <td className="col-span-6 w-48 px-6 py-3 text-sm font-normal sm:text-base">
                  {t("Exchange from")}
                </td>
                <td className="pl-2.5 text-sm font-medium sm:text-base">
                  {currency.formatVC(
                    exchange.amount,
                    exchange.metaData?.currencyFrom as string,
                  )}
                </td>
              </tr>

              {/* Exchanged to */}
              <tr className="odd:bg-accent">
                <td className="col-span-6 w-48 px-6 py-3 text-sm font-normal sm:text-base">
                  {t("Exchanged to")}
                </td>
                <td className="pl-2.5 text-sm font-medium sm:text-base">
                  {currency.formatVC(
                    exchange.total,
                    exchange.metaData?.currencyTo as string,
                  )}
                </td>
              </tr>

              {/* Exchange rate */}
              <tr className="odd:bg-accent">
                <td className="col-span-6 w-48 px-6 py-3 text-sm font-normal sm:text-base">
                  {t("Exchange rate")}
                </td>
                <td className="flex items-center text-sm font-medium sm:text-base">
                  {isEditMode ? (
                    <form
                      onSubmit={() => handleChangeExchangeRate(rate)}
                      className="flex items-center"
                    >
                      <Input
                        value={rate}
                        autoFocus
                        onChange={(e) => setRate(e.target.value)}
                        data-mode={isEditMode ? "edit" : ""}
                        className="h-fit w-52 rounded-md border border-transparent px-1.5 py-1 outline-none data-[mode=edit]:focus:border-foreground/50"
                      />
                      USD
                      <div className="ml-1.5 flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-fit hover:text-green-500"
                          onClick={() => {
                            handleChangeExchangeRate(
                              editableContentRef?.current?.textContent,
                            );
                          }}
                        >
                          <Check size={14} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          type="button"
                          className="w-fit hover:text-red-500"
                          onClick={() => {
                            setIsEditMode(false);
                            setRate(exchange?.metaData?.exchangeRate);
                          }}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center gap-1.5 pl-2.5">
                      {rate}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-8 hover:text-primary"
                        onClick={() => setIsEditMode(true)}
                      >
                        <Edit2 size={14} />
                      </Button>
                    </div>
                  )}
                </td>
              </tr>

              {/* Fee */}
              <tr className="odd:bg-accent">
                <td className="col-span-6 w-48 px-6 py-3 text-sm font-normal sm:text-base">
                  {t("Fee")}
                </td>
                <td className="pl-2.5 text-sm font-medium sm:text-base">
                  {currency.formatVC(
                    exchange.fee,
                    exchange.metaData?.currencyFrom as string,
                  )}
                </td>
              </tr>

              {/* User gets */}
              <tr className="odd:bg-accent">
                <td className="col-span-6 w-48 px-6 py-3 text-sm font-normal sm:text-base">
                  {t("User gets")}
                </td>
                <td className="pl-2.5 text-sm font-semibold sm:text-base">
                  {currency.formatVC(
                    exchange.total,
                    exchange.metaData?.currencyTo as string,
                  )}
                </td>
              </tr>

              {/* Status */}
              <tr className="odd:bg-accent">
                <td className="col-span-6 w-48 px-6 py-3 text-sm font-normal sm:text-base">
                  {t("Status")}
                </td>
                <td className="pl-2.5 text-sm font-semibold sm:text-base">
                  <Case condition={exchange?.status === "complete"}>
                    <Badge variant="success">
                      {startCase(exchange?.status)}
                    </Badge>
                  </Case>
                  <Case condition={exchange?.status === "pending"}>
                    <Badge variant="secondary">
                      {startCase(exchange?.status)}
                    </Badge>
                  </Case>
                  <Case condition={exchange?.status === "failed"}>
                    <Badge variant="destructive">
                      {startCase(exchange?.status)}
                    </Badge>
                  </Case>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Separator className="mb-1 mt-[5px] bg-border" />

        <Case condition={exchange?.status === "pending"}>
          <div className="flex items-center justify-center gap-4">
            <Button
              type="button"
              onClick={onApprove}
              className="gap-1 rounded-lg bg-spacial-green px-4 py-2 font-medium text-background hover:bg-[#219621] hover:text-background"
            >
              <TickCircle />
              {t("Approve")}
            </Button>

            <Button
              type="button"
              onClick={onReject}
              className="gap-1 rounded-lg bg-[#D13438] px-4 py-2 font-medium text-white hover:bg-[#a5272b] hover:text-white"
            >
              <CloseCircle />
              {t("Reject")}
            </Button>
          </div>
        </Case>
      </div>
    </div>
  );
}
