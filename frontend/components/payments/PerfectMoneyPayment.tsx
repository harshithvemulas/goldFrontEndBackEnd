"use client";

import { Loader } from "@/components/common/Loader";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";

type PerfectMoneyData = {
  PAYEE_ACCOUNT: string;
  PAYEE_NAME: string;
  PAYMENT_AMOUNT: string;
  PAYMENT_UNITS: string;
  PAYMENT_ID: string;
  PAYMENT_URL: string;
  NOPAYMENT_URL: string;
  STATUS_URL: string;
};

export function PerfectMoneyPayment({ res }: { res: any }) {
  const { t } = useTranslation();
  // create submission form
  const autoSubmitPerfectMoneyForm = (perfectMoneyData: PerfectMoneyData) => {
    if (!perfectMoneyData) return;

    const form = document.createElement("form");
    form.method = "POST";
    form.action = "https://perfectmoney.is/api/step1.asp";

    Object.entries(perfectMoneyData).forEach(([key, value]) => {
      if (value) {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      }
    });
    document.body.appendChild(form);
    form.submit();
  };

  // create dynamic form and submission
  React.useEffect(() => {
    if (res.postData) {
      autoSubmitPerfectMoneyForm(res.postData);
    }
  }, [res]);

  return (
    <div className="md:px-auto flex flex-col items-center justify-center px-4 md:py-10">
      <Image
        src="/phone.svg"
        alt="Phone"
        width={168}
        height={168}
        priority
        quality={70}
      />
      <h3 className="my-4 flex flex-col items-center text-center">
        {t("Request is processing...")}
        <Loader title={t("Please wait")} className="mt-2.5" />
      </h3>
    </div>
  );
}
