"use client";

import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

import { Case } from "@/components/common/Case";
import { customerRegistration } from "@/data/auth/register";
import { useBranding } from "@/hooks/useBranding";
import type {
  TCustomerRegistrationFormSchema,
  TPersonalInfoFormSchema,
} from "@/schema/registration-schema";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import PersonalInformationForm from "../../_components/personal-information";
import RegistrationForm from "../../_components/registration-form";

interface TFormData
  extends TCustomerRegistrationFormSchema,
    TPersonalInfoFormSchema {
  accountType: number;
}

export default function CustomerRegistration() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = React.useState<{ [key: string]: unknown }>({
    accountType: 2,
  });
  const [step, setStep] = React.useState("register");
  const router = useRouter();
  const { t } = useTranslation();
  const { siteName } = useBranding();

  // handle form submission
  const handleOnSubmit = (fd: TFormData) => {
    startTransition(async () => {
      const res = await customerRegistration(fd);
      if (res && res.status) {
        router.push(
          `/register/email-verification-message?email=${res.data?.email}`,
        );
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <div className="container max-w-3xl">
      <Case condition={step === "register"}>
        <RegistrationForm
          formData={formData}
          subTitle={t("Welcome to {{siteName}}, let's get start", { siteName })}
          title={t("Create an account")}
          onPrev={() => router.push("/register")}
          onSubmit={(values: TCustomerRegistrationFormSchema) => {
            setFormData((prev) => ({ ...prev, ...values }));
            setStep("personalInformation");
          }}
        />
      </Case>

      <Case condition={step === "personalInformation"}>
        <PersonalInformationForm
          isLoading={isPending}
          formData={formData}
          subTitle={t("Welcome to {{siteName}}, let's get start", { siteName })}
          title={t("Before we start...")}
          nextButtonLabel={t("Create account")}
          onPrev={() => setStep("register")}
          onSubmit={(values: TPersonalInfoFormSchema) => {
            setFormData((prev) => ({ ...prev, ...values }));
            handleOnSubmit({
              ...formData,
              ...values,
            } as TFormData);
          }}
        />
      </Case>
    </div>
  );
}
