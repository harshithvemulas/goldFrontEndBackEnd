import { TWithdrawFormSchema } from "@/app/(protected)/@customer/withdraw/page";
import { ReviewItem, ReviewItemList } from "@/components/common/ReviewItems";
import axios from "@/lib/axios";
import { Currency } from "@/lib/utils";
import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function ReviewList({
  form,
  setActiveTab,
  method,
  type,
  currencyCode,
  agentId,
  amount,
}: {
  form: UseFormReturn<TWithdrawFormSchema>;
  setActiveTab: (tab: string) => void;
  method: string;
  type: string;
  currencyCode: string;
  agentId: string;
  amount: number;
}) {
  const { t } = useTranslation();
  const currency = new Currency(currencyCode);
  const [preview, setPreview] = useState<any>();

  useEffect(() => {
    (async () => {
      if (type === "regular") {
        if (method) {
          await axios
            .get(`/withdraws/preview/create?method=${method}&amount=${amount}`)
            .then((res) => {
              setPreview(res.data);
            })
            .catch((err) => {
              if (isAxiosError(err)) {
                setActiveTab("withdraw_details");
                form.setError("withdrawAmount", {
                  message: err?.response?.data?.message,
                });
                toast.error(err?.response?.data?.message);
              }
            });
        }
      } else if (method) {
        await axios
          .get(
            `/withdraw-requests/preview/create?agentId=${agentId}&amount=${amount}`,
          )
          .then((res) => setPreview(res.data))
          .catch((err) => {
            if (isAxiosError(err)) {
              setActiveTab("withdraw_details");
              form.setError("withdrawAmount", {
                message: err?.response?.data?.message,
              });
              toast.error(err?.response?.data?.message);
            }
          });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [method]);

  return (
    <ReviewItemList groupName={t("Withdraw details")}>
      <ReviewItem
        title={t("Amount")}
        value={currency.formatVC(preview?.chargedAmount ?? 0)}
      />
      <ReviewItem
        title={t("Service charge")}
        value={currency.formatVC(preview?.fee ?? 0)}
      />
      <ReviewItem
        title={t("You get")}
        value={currency.formatVC(preview?.recievedAmount ?? 0)}
        valueClassName="text-xl sm:text-2xl font-semibold"
      />
    </ReviewItemList>
  );
}
