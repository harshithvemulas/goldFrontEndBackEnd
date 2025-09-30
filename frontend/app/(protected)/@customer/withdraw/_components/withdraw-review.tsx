"use client";

import { TWithdrawFormSchema } from "@/app/(protected)/@customer/withdraw/page";
import { Case } from "@/components/common/Case";
import { InputTelNumber } from "@/components/common/form/InputTel";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Separator from "@/components/ui/separator";
import {
  makeWithdrawRequest,
  makeWithdrawRequestByAgent,
} from "@/data/withdraw";
import { WithdrawAgentMethod, WithdrawMethod } from "@/types/withdraw-method";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import parsePhoneNumberFromString, * as libPhoneNumberJS from "libphonenumber-js";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { match } from "ts-pattern";
import { ReviewList } from "./reveiw-data";
import { SelectedMethodPreview } from "./selected-method";
import { WithdrawMethods } from "./withdraw-by-method";

export function WithdrawReview({
  form,
  setActiveTab,
  agent,
  methodData,
  selectMethod,
  updateStateToComplete,
  withdrawType,
  onBack,
}: {
  form: UseFormReturn<TWithdrawFormSchema>;
  setActiveTab: (tab: string) => void;
  agent: any;
  methodData: WithdrawMethod | undefined;
  selectMethod: React.Dispatch<
    React.SetStateAction<WithdrawMethod | undefined>
  >;
  updateStateToComplete: (id: string) => void;
  withdrawType: string;
  onBack: () => void;
}) {
  const [isPending, startTransition] = React.useTransition();
  const [method, setMethod] = React.useState(form.getValues("method"));
  const { t } = useTranslation();

  const router = useRouter();
  const [dynamicField, setDynamicField] =
    React.useState<Record<string, string>>();

  const countryValidation = () => {
    if (!form.getValues("country")) {
      toast.error("Country is required");
      return false;
    }
    return true;
  };

  // handle Agent Submission
  const handleAgentSubmission = async (values: TWithdrawFormSchema) => {
    startTransition(async () => {
      const data = {
        agentId: agent?.agentId ? (agent?.agentId as string) : "",
        method: values.method,
        inputValue: values.inputValue ?? "",
        amount: Number(values.withdrawAmount),
        currencyCode: values.walletId,
        countryCode: values.country,
      };

      const res = await makeWithdrawRequestByAgent(data);
      if (res.status) {
        updateStateToComplete("review");
        router.push(`/withdraw/transaction-status?trxId=${res.data?.trxId}`);
      } else {
        toast.error(res.message);
      }
    });
  };

  // handle regular withdraws
  const handleRegularSubmission = async (values: TWithdrawFormSchema) => {
    startTransition(async () => {
      // initial fields
      const initialFieldsData = {
        method,
        amount: Number(values.withdrawAmount ?? 0),
        currencyCode: values.walletId,
        country: values.country,
      };

      const data = {
        ...initialFieldsData,
        inputParams: dynamicField,
      };

      const res = await makeWithdrawRequest(data as any);
      if (res.status) {
        updateStateToComplete("review");
        router.push(`/withdraw/transaction-status?trxId=${res.data?.trxId}`);
      } else {
        toast.error(res.message);
      }
    });
  };

  // handle submission
  const handleSubmission = (values: TWithdrawFormSchema) => {
    if (withdrawType === "agent") {
      handleAgentSubmission(values);
    } else {
      handleRegularSubmission(values);
    }
  };

  useEffect(() => {
    setDynamicField(undefined);
  }, [method]);

  return (
    <>
      {/* Withdraw method */}
      <Case condition={withdrawType === "regular"}>
        <WithdrawMethods
          form={form}
          selectMethod={selectMethod}
          method={method}
          setMethod={setMethod}
        />
      </Case>

      {/* Withdraw agent */}
      <Case condition={withdrawType === "agent"}>
        <SelectedMethodPreview
          method={{ name: agent?.method?.name, logo: "" }}
          onEdit={() => setActiveTab("agent_selection")}
        />
      </Case>

      <Separator className="my-8" />

      <ReviewList
        form={form}
        setActiveTab={setActiveTab}
        method={method}
        type={withdrawType}
        agentId={agent?.agentId ? (agent.agentId as string) : ""}
        currencyCode={form.getValues("walletId")}
        amount={Number(form.getValues("withdrawAmount") ?? 0)}
      />

      {/* Additional fields */}
      <Case condition={withdrawType === "agent"}>
        <Separator className="my-8" />
        {match(agent?.method as WithdrawAgentMethod)
          .with({ inputType: "phone" }, () => (
            <div className="mt-8 flex w-full flex-col">
              <h2>{t("Enter phone number")}?</h2>
              <p className="mb-4">
                {t("(Enter your number without country indicator)")}
              </p>
              <FormField
                name="inputValue"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <InputTelNumber
                          onChange={(phone) => {
                            if (!phone) {
                              const parse = parsePhoneNumberFromString(phone);
                              field.onChange(parse?.number);
                            }
                          }}
                          options={{
                            initialCountry: form.getValues(
                              "country",
                            ) as libPhoneNumberJS.CountryCode,
                          }}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          ))
          .with({ inputType: "email" }, () => (
            <div className="mt-8 flex w-full flex-col">
              <h2>{t("Enter email address")}?</h2>
              <Input
                type="email"
                name="email"
                placeholder={t("Enter email address")}
                value={form.getValues("inputValue")}
                onChange={(e) => form.setValue("inputValue", e.target.value)}
              />
            </div>
          ))
          .with({ inputType: "other" }, () => (
            <div className="mt-8 flex w-full flex-col">
              <h2>{t(`Enter email ${agent?.method?.otherName}`)}?</h2>
              <Input
                type="text"
                name={agent?.method?.otherName}
                value={form.getValues("inputValue")}
                onChange={(e) => form.setValue("inputValue", e.target.value)}
              />
            </div>
          ))
          .otherwise(() => null)}
      </Case>

      {/* Regular withdraw */}
      <Case condition={withdrawType === "regular"}>
        <AdditionalField
          params={methodData?.params ? JSON.parse(methodData.params) : null}
          dynamicField={dynamicField}
          setDynamicField={setDynamicField}
        />
      </Case>

      <Separator className="my-8" />

      {/* actions */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={onBack}>
          <ArrowLeft2 />
          {t("Back")}
        </Button>

        <Button
          type="button"
          disabled={isPending}
          onClick={() => {
            if (countryValidation()) {
              form.handleSubmit(handleSubmission)();
            }
          }}
        >
          {isPending ? (
            <Loader
              title={t("Processing...")}
              className="text-primary-foreground"
            />
          ) : (
            t("Withdraw")
          )}
          <ArrowRight2 />
        </Button>
      </div>
    </>
  );
}

function AdditionalField({
  params,
  dynamicField,
  setDynamicField,
}: {
  params: any;
  dynamicField: Record<string, string> | undefined;
  setDynamicField: React.Dispatch<
    React.SetStateAction<Record<string, string> | undefined>
  >;
}) {
  const { t } = useTranslation();
  if (!params) return null;

  return (
    <>
      <Separator className="mt-6" />

      <div className="mt-8 flex flex-col gap-4">
        {params?.map((p: any, index: number) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className="flex w-full flex-col">
            <h3 className="mb-3">{t(p.label)}</h3>
            <Input
              type={p.type}
              name={p.name}
              value={dynamicField?.[p.name]}
              placeholder={`Enter ${p.label}`}
              onChange={(e) => {
                setDynamicField((prev: any) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }));
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
}
