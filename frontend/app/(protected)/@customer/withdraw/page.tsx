"use client";

import { PageDisabledAlert } from "@/components/common/PageDisabledAlert";
import { Steps, StepsContent } from "@/components/common/Steps";
import { Form } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import { WithdrawMethod } from "@/types/withdraw-method";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import { WithdrawByAgent } from "./_components/withdraw-agents";
import { WithdrawDetails } from "./_components/withdraw-details";
import { WithdrawReview } from "./_components/withdraw-review";

const formSchema = z.object({
  walletId: z.string().min(1, "Wallet ID is required."),
  withdrawAmount: z.string().min(1, "Withdraw amount is required."),
  method: z.string(),
  country: z.string(),
  phone: z.string().optional(),
  inputValue: z.string().optional(), // this field for only agent payment
});

export type TWithdrawFormSchema = z.infer<typeof formSchema>;

export default function Withdraw() {
  const { auth, deviceLocation } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState("withdraw_details"); // active tab
  const [withdrawType, setWithdrawType] = React.useState<"regular" | "agent">(
    "regular",
  );

  const [agent, setAgent] = React.useState<any>(null);
  const [method, setMethod] = React.useState<WithdrawMethod>();
  const [tabs, setTabs] = React.useState([
    {
      value: "withdraw_details",
      title: t("Withdraw Details"),
      complete: false,
    },
    {
      value: "agent_selection",
      title: t("Agent Selection"),
      isVisible: false,
      complete: false,
    },
    { value: "review", title: t("Payment & Review"), complete: false },
  ]);

  const form = useForm<TWithdrawFormSchema>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      walletId: "",
      withdrawAmount: "",
      method: "",
      country: "",
    },
  });

  // tab change
  React.useEffect(() => {
    if (activeTab === "withdraw_details") {
      form.reset({
        walletId: form.getValues("walletId"),
        withdrawAmount: form.getValues("withdrawAmount"),
        method: "",
        country: deviceLocation?.countryCode,
        phone: "",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // visible agent tab
  React.useEffect(() => {
    setTabs((tabs) =>
      tabs.map((t) =>
        t.value === "agent_selection"
          ? { ...t, isVisible: withdrawType === "agent" }
          : t,
      ),
    );
  }, [withdrawType]);

  React.useEffect(() => {
    if (deviceLocation && activeTab === "amount") {
      form.reset({
        walletId: form.getValues("walletId"),
        withdrawAmount: form.getValues("withdrawAmount"),
        method: "",
        country: deviceLocation?.countryCode,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceLocation]);

  // reset form on mount
  React.useEffect(() => {
    return () => {
      form.reset({
        walletId: "",
        withdrawAmount: "",
        method: "",
        country: deviceLocation?.countryCode,
        phone: "",
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update state to complete
  const updateStateToComplete = React.useCallback(
    (id: string) => {
      const updatedTabs = tabs.map((t) =>
        t.value === id ? { ...t, complete: true } : t,
      );
      setTabs(updatedTabs);
    },
    [tabs],
  );

  // if user has no access this feature
  if (!auth?.canMakeWithdraw()) {
    return <PageDisabledAlert className="flex-1 p-10" />;
  }

  return (
    <Form {...form}>
      <form className="md:h-full">
        <div className="w-full p-4 pb-10 md:h-full md:p-12">
          <div className="mx-auto max-w-3xl">
            <Steps
              tabs={tabs}
              onTabChange={(tab: string) => setActiveTab(tab)}
              value={activeTab}
            >
              <div className="p-4">
                <StepsContent value="withdraw_details">
                  <WithdrawDetails
                    form={form}
                    toggleTab={(tab: string) => {
                      setActiveTab(tab);
                      updateStateToComplete("withdraw_details");
                    }}
                    toggleWithdrawType={(type: "regular" | "agent") =>
                      setWithdrawType(type)
                    }
                  />
                </StepsContent>

                <StepsContent value="agent_selection">
                  <WithdrawByAgent
                    form={form}
                    setAgent={setAgent}
                    onBack={() => setActiveTab("withdraw_details")}
                    onNext={() => {
                      if (
                        withdrawType === "agent" &&
                        !form.getValues("method")
                      ) {
                        form.setError("method", {
                          message: t("Select a method to continue."),
                          type: "required",
                        });
                        return;
                      }
                      setActiveTab("review");
                      updateStateToComplete("agent_selection");
                    }}
                  />
                </StepsContent>

                <StepsContent value="review">
                  <WithdrawReview
                    form={form}
                    agent={agent}
                    methodData={method}
                    selectMethod={setMethod}
                    setActiveTab={setActiveTab}
                    updateStateToComplete={updateStateToComplete}
                    withdrawType={withdrawType}
                    onBack={() =>
                      setActiveTab(
                        withdrawType === "agent"
                          ? "agent_selection"
                          : "withdraw_details",
                      )
                    }
                  />
                </StepsContent>
              </div>
            </Steps>
          </div>
        </div>
      </form>
    </Form>
  );
}
