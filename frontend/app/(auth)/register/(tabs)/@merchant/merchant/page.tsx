"use client";

import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

import { MerchantInformationForm } from "@/app/(auth)/register/(tabs)/_components/merchant-information";
import { Case } from "@/components/common/Case";
import { merchantRegistration } from "@/data/auth/register";
import { useBranding } from "@/hooks/useBranding";
import {
  TCustomerRegistrationFormSchema,
  TMerchantInfoFormSchema,
  TPersonalInfoFormSchema,
} from "@/schema/registration-schema";
import { useTranslation } from "react-i18next";
import PersonalInformationForm from "../../_components/personal-information";
import RegistrationForm from "../../_components/registration-form";

interface TFormData
  extends TCustomerRegistrationFormSchema,
    TPersonalInfoFormSchema {
  accountType: number;
  merchant: TMerchantInfoFormSchema;
}

export default function MerchantRegistration() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = React.useState<{ [key: string]: unknown }>({
    accountType: 3,
  });
  const [step, setStep] = React.useState("register");
  const router = useRouter();
  const { t } = useTranslation();
  const { siteName } = useBranding();

  // handle form submission
  const handleOnSubmit = (fd: TFormData) => {
    startTransition(async () => {
      const res = await merchantRegistration(fd);
      if (res && res.status) {
        router.push(
          `/register/email-verification-message?email=${res.data?.email}`,
        );
      }
    });
  };

  return (
    <div className="container mb-10 max-w-3xl">
      <Case condition={step === "register"}>
        <RegistrationForm
          formData={formData}
          title={t("Create an account")}
          subTitle={t("Welcome to {{siteName}}, let's get start", { siteName })}
          onPrev={() => router.push("/register")}
          onSubmit={(values: TCustomerRegistrationFormSchema) => {
            setFormData((prev) => ({ ...prev, ...values }));
            setStep("personalInformation");
          }}
        />
      </Case>

      <Case condition={step === "personalInformation"}>
        <PersonalInformationForm
          formData={formData}
          title={t("Add personal information")}
          subTitle={t("Welcome to {{siteName}}, let's get start", { siteName })}
          nextButtonLabel={t("Next")}
          onPrev={() => setStep("register")}
          onSubmit={(values: TPersonalInfoFormSchema) => {
            setFormData((prev) => ({ ...prev, ...values }));
            setStep("merchantInformation");
          }}
        />
      </Case>

      <Case condition={step === "merchantInformation"}>
        <MerchantInformationForm
          formData={formData}
          title={t("Add merchant information")}
          subTitle={t("Welcome to {{siteName}}, let's get start", { siteName })}
          nextButtonLabel={t("Create account")}
          onPrev={() => setStep("personalInformation")}
          isLoading={isPending}
          onSubmit={(values: TMerchantInfoFormSchema) => {
            setFormData((prev) => ({ ...prev, merchant: values }));
            handleOnSubmit({ ...formData, merchant: values } as TFormData);
          }}
        />
      </Case>
    </div>
  );
}
