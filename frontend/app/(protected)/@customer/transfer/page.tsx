"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { PageDisabledAlert } from "@/components/common/PageDisabledAlert";
import {
  PageLayout,
  RightSidebar,
  RightSidebarToggler,
} from "@/components/common/PageLayout";
import { Steps, StepsContent } from "@/components/common/Steps";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Form } from "@/components/ui/form";
import Separator from "@/components/ui/separator";
import { transferCredit } from "@/data/customers/transfers/transferCredit";
import { useContactList } from "@/data/useContactList";
import { useAuth } from "@/hooks/useAuth";
import axios from "@/lib/axios";
import { imageURL, shapePhoneNumber } from "@/lib/utils";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { zodResolver } from "@hookform/resolvers/zod";
import { parsePhoneNumber } from "libphonenumber-js";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";
import { TransferDetails } from "./_components/transfer-details";
import { TransferFinish } from "./_components/transfer-finish";
import { TransferReview } from "./_components/transfer-review";

const formSchema = z.object({
  email: z.string().min(1, "Recipient email is required."),
  amount: z.string().min(1, "Transfer amount is required."),
  currencyCode: z.string().min(1, "Wallet is required."),
});

export type TTransferFormData = z.infer<typeof formSchema>;

export default function Transfer() {
  const { auth } = useAuth();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState("transfer_details");
  const [response, setResponse] = useState<Record<string, any> | null>(null);
  const [isPending, startTransition] = useTransition();
  const [user, setUser] = useState<Record<string, any> | null>(null);
  const [isCheckingUser, setIsCheckingUser] = useState(false);
  const { contacts, isLoading: isContactLoading } = useContactList();

  const quickSendContact = searchParams.get("email");

  // tabs
  const [tabs, setTabs] = useState([
    {
      id: "transfer_details",
      value: "transfer_details",
      title: t("Transfer details"),
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

  const form = useForm<TTransferFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      amount: "",
      currencyCode: "",
    },
    mode: "all",
  });

  useEffect(() => {
    if (quickSendContact) {
      setUser({
        id: "",
        avatar: "",
        name: "",
        email: quickSendContact,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickSendContact]);

  useEffect(() => {
    form.setValue("email", user?.email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  // update tab status
  const updateToConfirm = (tabId: string) => {
    setTabs((tabs) =>
      tabs.map((tab) => (tab.id === tabId ? { ...tab, complete: true } : tab)),
    );
  };

  // handle form submit
  const handleTransfer = (values: TTransferFormData) => {
    if (response) {
      setActiveTab("finish");
      return;
    }

    startTransition(async () => {
      const res = await transferCredit(values);
      if (res && res.status) {
        setActiveTab("finish");
        updateToConfirm("review");
        updateToConfirm("finish");
        setResponse(res);
        toast.success(res.message);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  // if user has no access this feature
  if (!auth?.canMakeTransfer()) {
    return <PageDisabledAlert className="flex-1 p-10" />;
  }

  // reset all
  const onResetAll = () => {
    setTabs([
      {
        id: "transfer_details",
        value: "transfer_details",
        title: t("Transfer details"),
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

    // reset form
    form.reset();
    setActiveTab("transfer_details");
    setResponse(null);
    setUser(null);
  };

  // fetch user information
  const fetchUserByEmail = async () => {
    const email = form.getValues("email");
    setIsCheckingUser(true);

    try {
      const res = await axios.get(`/users/check/?email=${email}`);
      if (res && res.status) {
        setIsCheckingUser(false);
        const user = res?.data;

        setUser({
          id: user?.id,
          avatar: user?.profileImage,
          name: user?.name,
          email: user?.email,
        });

        setActiveTab("review");
        updateToConfirm("transfer_details");
      }
    } catch (error) {
      setIsCheckingUser(false);
      toast.error(t("User not found."));
      form.setError("email", {
        message: t("User not found."),
        type: "required",
      });
    }
  };

  return (
    <PageLayout>
      <Form {...form}>
        <form className="md:h-full">
          <div className="relative flex md:h-full">
            <div className="w-full p-4 pb-10 md:h-full md:p-12">
              <div className="mx-auto max-w-3xl">
                <Case condition={activeTab === "transfer_details"}>
                  <RightSidebarToggler />
                </Case>

                <Steps
                  tabs={tabs}
                  value={activeTab}
                  onTabChange={(tab) => setActiveTab(tab)}
                >
                  <div className="p-4">
                    <StepsContent value="transfer_details">
                      <TransferDetails
                        form={form}
                        isCheckingUser={isCheckingUser}
                        onNext={form.handleSubmit((_, event: any) => {
                          event?.preventDefault();
                          fetchUserByEmail();
                        })}
                      />
                    </StepsContent>
                    <StepsContent value="review">
                      <TransferReview
                        onPrev={() => setActiveTab("transfer_details")}
                        onNext={form.handleSubmit(handleTransfer)}
                        nextButtonLabel={t("Transfer")}
                        isLoading={isPending}
                        formData={form.getValues()}
                        user={user}
                      />
                    </StepsContent>
                    <StepsContent value="finish">
                      <TransferFinish
                        res={response}
                        user={user}
                        onTransferAgain={onResetAll}
                      />
                    </StepsContent>
                  </div>
                </Steps>
              </div>
            </div>

            <Case condition={activeTab === "transfer_details"}>
              <RightSidebar>
                <div className="mb-4 rounded-xl bg-background p-6 shadow-default">
                  <div className="mb-6 border-b border-divider-secondary pb-6">
                    <p className="mb-2 font-medium text-foreground">
                      {t("Contacts")}
                    </p>
                    <p className="text-xs text-secondary-text">
                      {t("Click to autofill recipient")}
                    </p>
                  </div>
                  <div className="flex h-full max-h-72 flex-col overflow-y-auto">
                    {!isContactLoading &&
                      (!contacts || contacts?.length === 0) && (
                        <p className="text-sm font-medium text-foreground/50">
                          {t("No data found")}
                        </p>
                      )}
                    {!isContactLoading ? (
                      contacts?.map((contact: any) => (
                        <React.Fragment key={contact.id}>
                          <div
                            role="presentation"
                            onClick={() => {
                              setUser({
                                id: contact.contact.id,
                                avatar: contact.contact.customer.profileImage,
                                email: contact.contact.email,
                                name: contact.contact.customer.name,
                              });
                              form.setValue("email", contact.email);
                            }}
                            className="flex items-center justify-between py-2 first:pt-0 hover:cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              {/* Avatar */}
                              <Avatar className="size-8">
                                <AvatarImage
                                  src={imageURL(
                                    contact?.contact?.customer?.profileImage,
                                  )}
                                />
                                <AvatarFallback className="font-semibold">
                                  {getAvatarFallback(
                                    contact?.contact?.customer?.name,
                                  )}
                                </AvatarFallback>
                              </Avatar>

                              <div>
                                <p className="text-sm font-normal leading-5 text-foreground">
                                  {contact?.contact?.customer?.name}
                                </p>
                                <p className="text-xs font-normal leading-4 text-secondary-text">
                                  {contact?.contact?.customer?.phone &&
                                    parsePhoneNumber(
                                      shapePhoneNumber(
                                        contact?.contact?.customer?.phone,
                                      ),
                                    ).formatInternational()}
                                </p>
                              </div>
                            </div>
                          </div>

                          <Separator className="mb-1 mt-[5px]" />
                        </React.Fragment>
                      ))
                    ) : (
                      <Loader />
                    )}
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
