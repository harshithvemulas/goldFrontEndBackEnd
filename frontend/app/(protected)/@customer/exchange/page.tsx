"use client";

import * as React from "react";

import { PageDisabledAlert } from "@/components/common/PageDisabledAlert";
import { Steps, StepsContent } from "@/components/common/Steps";
import { Form } from "@/components/ui/form";
import { exchangeMoney } from "@/data/exchanges/exchangeMoney";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { ExchangeAmount } from "./_components/exchange-amount";
import { ExchangeFinish } from "./_components/exchange-finish";
import { ExchangeReview } from "./_components/exchange-review";

const formSchema = z.object({
  amount: z.string().min(1, "Amount is required."),
  currencyFrom: z.string().min(1, "Currency is required."),
  currencyTo: z.string().min(1, "Currency is required."),
});

export type TExchangeFormData = z.infer<typeof formSchema>;

export default function Exchange() {
  const { auth } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = React.useState("amount");
  const [exchangeResponse, setExchangeResponse] = React.useState<Record<
    string,
    any
  > | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const [tabs, setTabs] = React.useState([
    { value: "amount", title: t("Amount"), complete: false },
    { value: "review", title: t("Payment & Review"), complete: false },
    { value: "finish", title: t("Finish"), complete: false },
  ]);

  const form = useForm<TExchangeFormData>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      amount: "",
      currencyFrom: "",
      currencyTo: "",
    },
  });

  // reset all state
  const resetAll = () => {
    setActiveTab("amount");
    setTabs([
      { value: "amount", title: t("Amount"), complete: false },
      { value: "review", title: t("Payment & Review"), complete: false },
      { value: "finish", title: t("Finish"), complete: false },
    ]);
    setExchangeResponse(null);
    form.reset();
  };

  // update tab status
  const updateToConfirm = (tabId: string) => {
    setTabs((tabs) =>
      tabs.map((tab) =>
        tab.value === tabId ? { ...tab, complete: true } : tab,
      ),
    );
  };

  const handleExchange = (values: TExchangeFormData) => {
    if (exchangeResponse) {
      setActiveTab("finish");
      updateToConfirm("review");
      updateToConfirm("finish");
    } else {
      startTransition(async () => {
        const res = await exchangeMoney(values);
        if (res && res.status) {
          toast.success(res.message);
          setExchangeResponse(res);
          setActiveTab("finish");
          updateToConfirm("review");
          updateToConfirm("finish");
        } else {
          toast.error(t(res.message));
        }
      });
    }
  };

  // reset all state data on unmount
  React.useEffect(() => {
    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if user has no access this feature
  if (!auth?.canMakeExchange()) {
    return <PageDisabledAlert className="flex-1 p-10" />;
  }

  return (
    <Form {...form}>
      <form className="md:h-full">
        <div className="w-full p-4 pb-10 md:h-full md:p-12">
          <div className="mx-auto max-w-3xl">
            <Steps
              tabs={tabs}
              value={activeTab}
              onTabChange={(tab) => setActiveTab(tab)}
            >
              <div className="p-4">
                <StepsContent value="amount">
                  <ExchangeAmount
                    form={form}
                    onNext={form.handleSubmit(() => {
                      const values = form.getValues();
                      if (values?.currencyFrom === values?.currencyTo) {
                        form.setError("currencyTo", {
                          type: "manual",
                          message: t("Currency must be different."),
                        });
                        return;
                      }
                      setActiveTab("review");
                      updateToConfirm("amount");
                    })}
                  />
                </StepsContent>
                <StepsContent value="review">
                  <ExchangeReview
                    values={form.getValues()}
                    onNext={form.handleSubmit(handleExchange)}
                    onPrev={() => setActiveTab("amount")}
                    isLoading={isPending}
                  />
                </StepsContent>
                <StepsContent value="finish">
                  <ExchangeFinish
                    res={exchangeResponse}
                    values={form.getValues()}
                    onAgainExchange={resetAll}
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
