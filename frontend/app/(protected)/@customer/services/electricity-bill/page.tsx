"use client";

import Finish from "@/app/(protected)/@customer/services/electricity-bill/_components/finish";
import MeterDetails from "@/app/(protected)/@customer/services/electricity-bill/_components/meter-details";
import Review from "@/app/(protected)/@customer/services/electricity-bill/_components/review";
import { PageLayout } from "@/components/common/PageLayout";
import { Steps, StepsContent } from "@/components/common/Steps";
import { Form } from "@/components/ui/form";
import { createElectricityBill } from "@/data/services/electricity-bill";
import {
  ElectricityBillSchema,
  TElectricityBillFormData,
} from "@/schema/electricity-bill-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function ElectricityBillPayment() {
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = React.useState("meter_details");
  const [meterProvider, setMeterProvider] = React.useState<Record<
    string,
    any
  > | null>(null);
  const [isPending, startTransition] = React.useTransition();

  // tabs
  const [tabs, setTabs] = React.useState([
    {
      id: "meter_details",
      value: "meter_details",
      title: t("Meter Details"),
      complete: false,
    },
    {
      id: "review",
      value: "review",
      title: t("Review"),
      complete: false,
    },
    {
      id: "finish",
      value: "finish",
      title: t("Finish"),
      complete: false,
    },
  ]);

  const form = useForm<TElectricityBillFormData>({
    resolver: zodResolver(ElectricityBillSchema),
    mode: "all",
    defaultValues: {
      meter_provider: "",
      meter_number: "",
      sender_wallet_id: "",
      bill_amount: "",
    },
  });

  // reset form if active tab is change backward
  React.useEffect(() => {
    if (activeTab === "meter_details") {
      form.reset({
        meter_provider: form.getValues("meter_provider"),
        meter_number: form.getValues("meter_number"),
        sender_wallet_id: form.getValues("sender_wallet_id"),
        bill_amount: form.getValues("bill_amount"),
      });
    }
  }, [activeTab, form]);

  // update tab status
  const updateToConfirm = (tabId: string) => {
    setTabs((tabs) =>
      tabs.map((tab) => (tab.id === tabId ? { ...tab, complete: true } : tab)),
    );
  };

  const onSubmit = () => {
    const formData = form.getValues();

    startTransition(async () => {
      const data = {
        meterNumber: formData.meter_number,
        amount: Number(formData.bill_amount) as number,
        currencyCode: formData.sender_wallet_id as string,
        billerId: Number(formData.meter_provider),
      };

      const res = await createElectricityBill(data);
      if (res.status) {
        toast.success(t(res.message));
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <PageLayout>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="w-full p-4 pb-10 md:p-12">
            <div className="mx-auto max-w-3xl">
              <Steps
                tabs={tabs}
                value={activeTab}
                onTabChange={(tab) => setActiveTab(tab)}
              >
                <div className="p-4">
                  <StepsContent value="meter_details">
                    <MeterDetails
                      form={form}
                      meterProvider={meterProvider}
                      setMeterProvider={(provider) =>
                        setMeterProvider(provider)
                      }
                      onNext={form.handleSubmit((_, event: any) => {
                        event?.preventDefault();
                        setActiveTab("review");
                        updateToConfirm("meter_details");
                      })}
                    />
                  </StepsContent>
                  <StepsContent value="review">
                    <Review
                      formData={form.getValues()}
                      isLoading={isPending}
                      meterProvider={meterProvider}
                      onBack={() => setActiveTab("payment_details")}
                      onNext={form.handleSubmit(onSubmit)}
                    />
                  </StepsContent>
                  <StepsContent value="finish">
                    <Finish />
                  </StepsContent>
                </div>
              </Steps>
            </div>
          </div>
        </form>
      </Form>
    </PageLayout>
  );
}
