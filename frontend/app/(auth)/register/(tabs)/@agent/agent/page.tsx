"use client";

import { useRouter } from "next/navigation";
import React, { useTransition } from "react";

import {
  AgentAgreements,
  TAgentAgreement,
} from "@/app/(auth)/register/(tabs)/_components/agent-agreements";
import { AgentInformationForm } from "@/app/(auth)/register/(tabs)/_components/agent-info-form";
import { Case } from "@/components/common/Case";
import { agentRegistration } from "@/data/auth/register";
import { useBranding } from "@/hooks/useBranding";
import {
  TAgentInfoFormSchema,
  TCustomerRegistrationFormSchema,
  TPersonalInfoFormSchema,
} from "@/schema/registration-schema";
import { useTranslation } from "react-i18next";
import PersonalInformationForm from "../../_components/personal-information";
import RegistrationForm from "../../_components/registration-form";

interface TFormData
  extends TCustomerRegistrationFormSchema,
    TPersonalInfoFormSchema {
  accountType: number;
  agent?: TAgentInfoFormSchema & TAgentAgreement;
}

export default function MerchantRegistration() {
  const [isPending, startTransition] = useTransition();
  const [formData, setFormData] = React.useState<Record<string, any>>({
    accountType: 4,
  });
  const [step, setStep] = React.useState("register");
  const router = useRouter();
  const { t } = useTranslation();
  const { siteName } = useBranding();

  // handle form submission
  const handleOnSubmit = (fd: TFormData) => {
    const updatedFd = { ...fd };

    if (updatedFd?.agent?.amount === "custom") {
      updatedFd.agent.amount = updatedFd?.agent?.customAmount ?? "";
      delete updatedFd.agent.customAmount;
    }

    startTransition(async () => {
      const res = await agentRegistration(updatedFd);
      if (res && res.status) {
        router.push(
          `/register/email-verification-message?email=${res.data?.email}`,
        );
      }
    });
  };

  return (
    <div className="container max-w-3xl">
      <Case condition={step === "register"}>
        <RegistrationForm
          subTitle={t("Welcome to {{siteName}}, let's get start", { siteName })}
          title={t("Create an account")}
          onPrev={() => router.push("/register")}
          formData={formData}
          onSubmit={(values: TCustomerRegistrationFormSchema) => {
            setFormData((prev) => ({ ...prev, ...values }));
            setStep("personalInformation");
          }}
        />
      </Case>

      <Case condition={step === "personalInformation"}>
        <PersonalInformationForm
          formData={formData}
          subTitle={t("Welcome to {{siteName}}, let's get start", { siteName })}
          title={t("Add personal information")}
          nextButtonLabel={t("Next")}
          onPrev={() => setStep("register")}
          onSubmit={(values: TPersonalInfoFormSchema) => {
            setStep("agentInfo");
            setFormData((prev) => ({ ...prev, ...values }));
          }}
        />
      </Case>

      <Case condition={step === "agentInfo"}>
        <AgentInformationForm
          formData={formData}
          subTitle={t("Welcome to {{siteName}}, let's get start", { siteName })}
          title={t("Add agent information")}
          nextButtonLabel={t("Next")}
          onPrev={() => setStep("personalInformation")}
          onSubmit={(values: TAgentInfoFormSchema) => {
            setStep("agreements");
            setFormData((prev) => ({ ...prev, agent: values }));
          }}
        />
      </Case>

      <Case condition={step === "agreements"}>
        <AgentAgreements
          formData={formData}
          subTitle={t("Welcome to {{siteName}}, let's get start", { siteName })}
          title={t("Agreements")}
          isLoading={isPending}
          nextButtonLabel={t("Create account")}
          onPrev={() => setStep("agentInfo")}
          onSubmit={(values: TAgentAgreement) => {
            setFormData((prev) => ({
              ...prev,
              agent: { ...prev.agent, ...values },
            }));
            handleOnSubmit({
              ...formData,
              agent: { ...formData.agent, ...values },
            } as TFormData);
          }}
        />
      </Case>
    </div>
  );
}
