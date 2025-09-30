"use client";

import Finish from "@/app/(protected)/@customer/services/electricity-bill/_components/finish";
import MeterDetails from "@/app/(protected)/@customer/services/electricity-bill/_components/meter-details";
import PaymentDetails from "@/app/(protected)/@customer/services/electricity-bill/_components/payment-details";
import Review from "@/app/(protected)/@customer/services/electricity-bill/_components/review";
import { PageLayout } from "@/components/common/PageLayout";
import { Steps, StepsContent } from "@/components/common/Steps";
import { Form } from "@/components/ui/form";
import { createElectricityBill } from "@/data/services/electricity-bill";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  meter_type: z.enum(["prepaid", "postpaid"]).default("prepaid"),
  meter_provider: z.string().min(1, "Provider is required."),
  meter_number: z.string().min(1, "Meter number is required."),
  sender_wallet_id: z.string().optional(),
  bill_amount: z.string().optional(),
  phone_number: z.string().optional(),
});

export type TElectricityBillFormData = z.infer<typeof formSchema>;

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
      id: "payment_details",
      value: "payment_details",
      title: t("Payment Details"),
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
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      meter_provider: "",
      meter_type: "prepaid",
      meter_number: "",
      sender_wallet_id: "",
      bill_amount: "",
      phone_number: "",
    },
  });

  // reset form if active tab is change backward
  React.useEffect(() => {
    if (activeTab === "meter_details") {
      form.reset({
        meter_provider: form.getValues("meter_provider"),
        meter_type: form.getValues("meter_type"),
        meter_number: form.getValues("meter_number"),
        sender_wallet_id: form.getValues("sender_wallet_id"),
        bill_amount: form.getValues("bill_amount"),
        phone_number: form.getValues("phone_number"),
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

  const onError = () => {
    toast.error(t("An error occurred. Please try again."));
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
                        setActiveTab("payment_details");
                        updateToConfirm("meter_details");
                      })}
                    />
                  </StepsContent>
                  <StepsContent value="payment_details">
                    <PaymentDetails
                      form={form}
                      onNext={form.handleSubmit((_, event: any) => {
                        event?.preventDefault();
                        setActiveTab("review");
                        updateToConfirm("payment_details");
                      })}
                      onBack={() => setActiveTab("meter_details")}
                    />
                  </StepsContent>
                  <StepsContent value="review">
                    <Review
                      formData={form.getValues()}
                      isLoading={isPending}
                      meterProvider={meterProvider}
                      onBack={() => setActiveTab("payment_details")}
                      onNext={form.handleSubmit(onSubmit, onError)}
                    />
                  </StepsContent>
                  <StepsContent value="finish">
                    <Finish formData={form.getValues()} />
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
