"use client";

import { PageDisabledAlert } from "@/components/common/PageDisabledAlert";
import { Steps, StepsContent } from "@/components/common/Steps";
import { Form } from "@/components/ui/form";
import { directDeposit } from "@/data/deposit/directDeposit";
import { useAuth } from "@/hooks/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { TransferDetails } from "./_components/transfer-details";
import { TransferFinish } from "./_components/transfer-finish";
import { TransferReview } from "./_components/transfer-review";

const formSchema = z.object({
  email: z.string().min(1, "Email is required"),
  transferAmount: z.string().min(1, "Transfer amount is required."),
  transferWalletId: z.string().min(1, "Select transfer wallet is required."),
  country: z.string().optional(),
});

export type TTransferFormData = z.infer<typeof formSchema>;

// Render transfer page

export default function TransferPage() {
  const { auth } = useAuth();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("e55ee3c2");
  const [response, setResponse] = useState<Record<string, any> | null>(null);
  const [isPending, startTransition] = useTransition();

  // tabs
  const [tabs, setTabs] = useState([
    {
      id: "e55ee3c2",
      value: "e55ee3c2",
      title: t("Deposit details"),
      complete: false,
    },
    {
      id: "b024c411",
      value: "b024c411",
      title: t("Review"),
      complete: false,
    },
    {
      id: "1ce183ee",
      value: "1ce183ee",
      title: t("Finish"),
      complete: false,
    },
  ]);

  // form instance
  const form = useForm<TTransferFormData>({
    resolver: zodResolver(formSchema),
    mode: "all",
    defaultValues: {
      email: "",
      transferAmount: "",
      transferWalletId: "",
      country: "",
    },
  });

  // reset all
  const resetAll = () => {
    form.reset();
    setResponse(null);
    setActiveTab("e55ee3c2");
    setTabs([
      {
        id: "e55ee3c2",
        value: "e55ee3c2",
        title: t("Deposit details"),
        complete: false,
      },
      {
        id: "b024c411",
        value: "b024c411",
        title: t("Review"),
        complete: false,
      },
      {
        id: "1ce183ee",
        value: "1ce183ee",
        title: t("Finish"),
        complete: false,
      },
    ]);
  };

  React.useEffect(() => {
    return () => {
      resetAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // update tab status
  const updateToConfirm = (tabId: string) => {
    setTabs((tabs) =>
      tabs.map((tab) => (tab.id === tabId ? { ...tab, complete: true } : tab)),
    );
  };

  // handle form submit
  const handleTransfer = (values: TTransferFormData) => {
    startTransition(async () => {
      const res = await directDeposit(values);
      if (res && res.status) {
        setActiveTab("1ce183ee");
        updateToConfirm("b024c411");
        updateToConfirm("1ce183ee");
        setResponse(res);
        toast.success(res.message);
      } else {
        toast.error(t(res.message));
      }
    });
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
                <StepsContent value="e55ee3c2">
                  <TransferDetails
                    form={form}
                    onNext={form.handleSubmit((_, event: any) => {
                      event?.preventDefault();
                      setActiveTab("b024c411");
                      updateToConfirm("e55ee3c2");
                    })}
                  />
                </StepsContent>
                <StepsContent value="b024c411">
                  <TransferReview
                    onPrev={() => setActiveTab("e55ee3c2")}
                    onNext={form.handleSubmit(handleTransfer)}
                    nextButtonLabel={t("Deposit")}
                    isLoading={isPending}
                    formData={form.getValues()}
                  />
                </StepsContent>
                <StepsContent value="1ce183ee">
                  <TransferFinish res={response} onAgainTransfer={resetAll} />
                </StepsContent>
              </div>
            </Steps>
          </div>
        </div>
      </form>
    </Form>
  );
}
