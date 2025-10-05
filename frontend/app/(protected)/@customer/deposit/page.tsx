"use client";

/* eslint-disable react-hooks/exhaustive-deps */
import { Case } from "@/components/common/Case";
import { PageDisabledAlert } from "@/components/common/PageDisabledAlert";
import { Steps, StepsContent } from "@/components/common/Steps";
import { Form } from "@/components/ui/form";
import { makeAgentDepositRequest } from "@/data/deposit/makeAgentDepositRequest";
import { makeDepositRequest } from "@/data/deposit/makeDepositRequest";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { DepositConfirmationStage } from "./_components/DepositConfirmationStage";
import { DepositDetails } from "./_components/DepositDetails";
import { PaymentMethod } from "./_components/PaymentMethod";
import { Review } from "./_components/Review";

// form schema
const depositFormSchema = z.object({
  wallet: z.string().min(1, "Wallet is required."),
  amount: z.string().min(1, "Amount is required."),
  agent: z.string().optional(),
  country: z.string().optional(),
  method: z.string().optional(),
  isAgent: z.boolean().default(false),
});

// form data type
export type TDepositFormData = z.infer<typeof depositFormSchema>;

export default function Deposit() {
  const { auth, deviceLocation } = useAuth();
  const { t } = useTranslation();
  const [isPending, startTransition] = React.useTransition();
  const [res, setRes] = React.useState<Record<string, any> | null>(null);
  const [activeTab, setActiveTab] = React.useState("amount");

  // initial tabs
  const [tabs, setTabs] = React.useState([
    { value: "amount", title: t("Amount"), complete: false },
    { value: "payment_method", title: t("Payment method"), complete: false },
    { value: "review", title: t("Review"), complete: false },
  ]);

  const router = useRouter();

  // form instance
  const form = useForm<TDepositFormData>({
    resolver: zodResolver(depositFormSchema),
    mode: "all",
    defaultValues: {
      wallet: "",
      amount: "",
      agent: "",
      country: deviceLocation?.countryCode,
      method: "",
      isAgent: false,
    },
  });

  // reset form if active tab is change backward
  React.useEffect(() => {
    if (activeTab === "amount") {
      form.reset({
        wallet: form.getValues("wallet"),
        amount: form.getValues("amount"),
        agent: "",
        country: deviceLocation?.countryCode,
        method: "",
        isAgent: false,
      });
    }
  }, [activeTab]);

  React.useEffect(() => {
    if (deviceLocation && activeTab === "amount") {
      form.reset({
        wallet: form.getValues("wallet"),
        amount: form.getValues("amount"),
        agent: "",
        country: deviceLocation?.countryCode,
        method: "",
        isAgent: false,
      });
    }
  }, [deviceLocation]);

  // reset form on mount
  React.useEffect(() => {
    return () => {
      form.reset({
        wallet: "",
        amount: "",
        agent: "",
        country: deviceLocation?.countryCode,
        method: "",
        isAgent: false,
      });
    };
  }, []);

  // update to complete
  const updateToComplete = (value: string) => {
    const tabList = [...tabs];
    const newTabList = tabList?.map((tab) =>
      tab.value === value ? { ...tab, complete: true } : tab,
    );
    setTabs(newTabList);
  };

  // handle form submission
  const onSubmit = (values: TDepositFormData) => {
    startTransition(async () => {
      if (values.isAgent) {
        const res = await makeAgentDepositRequest({
          agentId: values.agent ? values.agent.toString() : "",
          method: values.method ? values.method?.toString() : "",
          inputValue: "",
          amount: Number(values.amount),
          currencyCode: values.wallet,
          countryCode: values.country as string,
        });

        if (res?.status) {
          toast.success(res?.message);
          router.push(`/deposit/transaction-status?trxId=${res.data.trxId}`);
          setRes({ res });
        } else {
          toast.error(res?.message);
        }
      }

      // if not agent
      if (!values.isAgent && values.method) {
        const res = await makeDepositRequest({
          method: values.method ? values.method?.toString() : "",
          amount: Number(values.amount),
          currencyCode: values.wallet,
          country: values.country as string,
        });

        if (res?.status) {
          toast.success(res?.message);
          router.push(`/deposit/transaction-status?trxId=${res.data.trxId}`);

          setActiveTab("confirm");
          setRes(res);
        } else {
          toast.error(res?.message);
        }
      }
    });

    updateToComplete("review");
  };

  // if user has no access this feature
  if (!auth?.canMakeDeposit()) {
    return <PageDisabledAlert className="flex-1 p-10" />;
  }

  return (
    <Form {...form}>
      <form>
        <div className="w-full p-4 pb-10 md:p-12">
          <div className="mx-auto max-w-3xl">
            <Steps
              tabs={tabs}
              value={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
            >
              <div className="p-4">
                <StepsContent value="amount">
                  <DepositDetails
                    form={form}
                    onNext={form.handleSubmit((_, event: any) => {
                      event?.preventDefault();
                      setActiveTab("payment_method");
                      updateToComplete("amount");
                    })}
                  />
                </StepsContent>
                <StepsContent value="payment_method">
                  <PaymentMethod
                    form={form}
                    updateTab={() => {
                      if (!form.getValues("method")) {
                        form.setError("method", {
                          message: t("Select a method to continue."),
                          type: "required",
                        });
                        return;
                      }

                      setActiveTab("review");
                      updateToComplete("payment_method");
                    }}
                    onBack={() => setActiveTab("amount")}
                  />
                </StepsContent>
                <StepsContent value="review">
                  <Review
                    formData={form.getValues()}
                    isLoading={isPending}
                    onBack={() => setActiveTab("payment_method")}
                    onNext={form.handleSubmit(onSubmit)}
                  />
                </StepsContent>
              </div>
            </Steps>

            <Case condition={activeTab === "confirm"}>
              <DepositConfirmationStage res={res} />
            </Case>
          </div>
        </div>
      </form>
    </Form>
  );
}
