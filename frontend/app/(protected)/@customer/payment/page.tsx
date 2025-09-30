"use client";

import React, { useEffect, useTransition } from "react";

import { Case } from "@/components/common/Case";
import { PageDisabledAlert } from "@/components/common/PageDisabledAlert";
import {
  PageLayout,
  RightSidebar,
  RightSidebarToggler,
} from "@/components/common/PageLayout";
import { Steps, StepsContent } from "@/components/common/Steps";
import { SavedMerchant } from "@/components/page-components/saved-items/saved-merchant";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { makePayment } from "@/data/payments/makePayment";
import { useAuth } from "@/hooks/useAuth";
import { useSWR } from "@/hooks/useSWR";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import PaymentDetails from "./_components/payment-details";
import PaymentReview from "./_components/payment-review";
import PaymentStatus from "./_components/payment-status";

const formSchema = z.object({
  sender_wallet_id: z.string().min(1, "Select a wallet"),
  receiver_merchant_id: z
    .string()
    .min(1, "Receiver merchant account is required."),
  amount: z
    .string()
    .min(1, "Payment amount is required.")
    .refine((val) => Number(val) > 0, {
      message: "Payment amount must be greater than 0.",
    }),
});

export type TPaymentRequestFormData = z.infer<typeof formSchema>;

export default function PaymentPage() {
  const { auth } = useAuth();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = React.useState("payment_details");
  const [formRes, setFormRes] = React.useState<Record<string, any>>();
  const [merchant, setMerchant] = React.useState<Record<string, any>>();
  const [tabs, setTabs] = React.useState([
    { value: "payment_details", title: t("Payment Details"), complete: false },
    { value: "review", title: t("Payment & Review"), complete: false },
    { value: "finish", title: t("Finish"), complete: false },
  ]);

  const [isPending, startTransition] = useTransition();
  const [merchantIdInputMode, setMerchantIdInputMode] = React.useState(true);

  const { data, isLoading } = useSWR(
    `/merchants/global?search=${searchParams.get("email")}`,
  );

  const form = useForm<TPaymentRequestFormData>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      sender_wallet_id: "",
      receiver_merchant_id: "",
      amount: "",
    },
  });

  // reset all
  const resetAll = () => {
    setActiveTab("payment_details");
    setFormRes(undefined);
    form.reset();
    setTabs([
      {
        value: "payment_details",
        title: t("Payment Details"),
        complete: false,
      },
      { value: "review", title: t("Payment & Review"), complete: false },
      { value: "finish", title: t("Finish"), complete: false },
    ]);
  };

  React.useEffect(() => {
    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // handle payment
  const handleMakePayment = (values: TPaymentRequestFormData) => {
    startTransition(async () => {
      const res = await makePayment<TPaymentRequestFormData>(values);
      if (res && res.status) {
        toast.success(res.message);
        setActiveTab("finish");
        makeComplete("finish");
        makeComplete("review");
        setFormRes(res);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  useEffect(() => {
    if (searchParams.get("email") && !isLoading) {
      setMerchant({
        email: data?.data[0]?.email,
        gender: "",
        merchantId: data?.data[0]?.merchantId,
        name: data?.data[0]?.name,
        profileImage: null,
        roleId: null,
      });
      setMerchantIdInputMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, isLoading]);

  // make complete
  const makeComplete = (id: string) => {
    const newTabs = tabs.map((t) =>
      t.value === id ? { ...t, complete: true } : t,
    );
    setTabs(newTabs);
  };

  // if user has no access this feature
  if (!auth?.canMakePayment()) {
    return <PageDisabledAlert className="flex-1 p-10" />;
  }

  return (
    <PageLayout>
      <Form {...form}>
        <form className="md:h-full">
          <div className="relative flex md:h-full">
            <div className="w-full p-4 pb-10 md:h-full md:p-12">
              <div className="mx-auto max-w-3xl">
                <Case condition={activeTab === "payment_details"}>
                  <RightSidebarToggler />
                </Case>

                <Steps
                  tabs={tabs}
                  onTabChange={(tab: string) => setActiveTab(tab)}
                  value={activeTab}
                >
                  <div className="p-4">
                    <StepsContent value="payment_details">
                      <PaymentDetails
                        form={form}
                        onNext={form.handleSubmit(() => {
                          setActiveTab("review");
                          makeComplete("payment_details");
                        })}
                        merchantIdInputMode={merchantIdInputMode}
                        setMerchantIdInputMode={setMerchantIdInputMode}
                        merchant={merchant}
                        selectedMerchant={(merchant: any) =>
                          setMerchant(merchant)
                        }
                      />
                    </StepsContent>

                    <StepsContent value="review">
                      <PaymentReview
                        onBack={() => setActiveTab("payment_details")}
                        onNext={form.handleSubmit(handleMakePayment)}
                        formData={form.getValues()}
                        merchant={merchant}
                        isLoading={isPending}
                      />
                    </StepsContent>
                    <StepsContent value="finish">
                      <PaymentStatus
                        merchant={merchant}
                        formResponse={formRes}
                        onPaymentAgain={resetAll}
                      />
                    </StepsContent>
                  </div>
                </Steps>
              </div>
            </div>

            <Case condition={activeTab === "payment_details"}>
              <RightSidebar>
                <div className="mb-4 rounded-xl bg-background p-6 shadow-default">
                  <div className="mb-2 border-b border-divider-secondary pb-6">
                    <p className="mb-2 font-medium text-foreground">
                      {t("Favorite merchants")}
                    </p>
                    <p className="text-xs text-secondary-text">
                      {t("Click to autofill merchant")}
                    </p>
                  </div>
                  <div className="flex h-full max-h-72 flex-col overflow-y-auto">
                    <FormField
                      control={form.control}
                      name="receiver_merchant_id"
                      render={({ field }) => (
                        <FormItem className="max-h-[calc(100vh-250px)] overflow-y-auto">
                          <FormControl>
                            <SavedMerchant
                              value={field.value}
                              onSelect={(value, data) => {
                                field.onChange(value);
                                setMerchant({
                                  email: data?.info?.email,
                                  gender: "",
                                  merchantId: data?.value,
                                  name: data?.info?.label,
                                  profileImage: null,
                                  roleId: null,
                                });
                                setMerchantIdInputMode(false);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </RightSidebar>
            </Case>
          </div>
        </form>
      </Form>
    </PageLayout>
  );
}
