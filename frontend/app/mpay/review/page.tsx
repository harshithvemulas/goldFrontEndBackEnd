"use client";

import MpayFooter from "@/app/mpay/_components/mpay-footer";
import MpayHead from "@/app/mpay/_components/mpay-head";
import GlobalLoader from "@/components/common/GlobalLoader";
import { useTransactionDetails } from "@/data/mpay/getTransactionDetails";
import { CloseCircle, TickCircle } from "iconsax-react";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

function MpayReview() {
  const searchParams = useSearchParams();
  const trxId = searchParams.get("trxId");
  const status = searchParams.get("status");
  const { data, isLoading } = useTransactionDetails({ trxId: trxId! });
  const { t } = useTranslation();

  useEffect(() => {
    if (status) {
      if (status === "completed") {
        setTimeout(() => {
          window.location.href = data?.successUrl;
        }, 3000);
      } else if (status === "failed") {
        setTimeout(() => {
          window.location.href = data?.cancelUrl;
        }, 3000);
      }
    }
    if (!data) return;
    if (!status && data?.status === "completed") {
      setTimeout(() => {
        window.location.href = data?.successUrl;
      }, 3000);
    } else if (!status && data?.status !== "completed") {
      setTimeout(() => {
        window.location.href = data?.cancelUrl;
      }, 3000);
    }
  }, [data, status]);

  const successRender = () => {
    return (
      <div className="flex flex-col items-center gap-6 py-2 text-center">
        <TickCircle className="text-green-500" size={64} />
        <p className="text-lg font-semibold">{t("Payment Successful")}</p>
      </div>
    );
  };

  const failedRender = () => {
    return (
      <div className="flex flex-col items-center gap-6 py-2 text-center">
        <CloseCircle className="text-red-500" size={64} />
        <p className="text-lg font-semibold">{t("Payment Failed")}</p>
      </div>
    );
  };

  if (isLoading) return <GlobalLoader />;

  return (
    <div>
      <MpayHead data={data} />
      <div className="mt-3">
        {status && status === "completed" && successRender()}
        {status && status === "failed" && failedRender()}
        {!status && data?.status === "completed" && successRender()}
        {!status && data?.status !== "completed" && failedRender()}
      </div>
      <MpayFooter data={data} />
    </div>
  );
}

export default MpayReview;
