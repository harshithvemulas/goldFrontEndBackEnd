"use client";

import { Case } from "@/components/common/Case";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import Switch from "@/components/ui/switch";
import { acceptMerchant } from "@/data/admin/acceptMerchant";
import { declineMerchant } from "@/data/admin/declineMerchant";
import { toggleMerchantSuspendStatus } from "@/data/admin/updateMerchantStatus";
import { CloseCircle, MoreCircle, TickCircle } from "iconsax-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export function MerchantAccessCard({
  customer,
  onMutate,
}: {
  customer: any;
  onMutate: () => void;
}) {
  const { t } = useTranslation();

  // accept merchant
  const handleAcceptMerchant = () => {
    toast.promise(acceptMerchant(customer.id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res?.status) throw new Error(res.message);
        onMutate();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  // handle merchant Suspended status toggoling
  const handleToggleSuspendStatus = () => {
    toast.promise(toggleMerchantSuspendStatus(customer?.id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res?.status) throw new Error(res.message);
        onMutate();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  // decline merchant
  const handleDeclineMerchant = () => {
    toast.promise(declineMerchant(customer.id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res?.status) throw new Error(res.message);
        onMutate();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    <AccordionItem
      value="MerchantAccessCard"
      className="rounded-xl border border-border bg-background px-4 py-0"
    >
      <AccordionTrigger className="py-6 hover:no-underline">
        <p className="text-base font-medium leading-[22px]">
          {t("Merchant status")}
        </p>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-2 border-t pt-4">
        <div className="mb-4 inline-flex items-center gap-2">
          <h6 className="w-[150px]">{t("Suspended")}</h6>
          <Switch
            defaultChecked={!!customer?.isSuspended}
            onCheckedChange={handleToggleSuspendStatus}
          />
        </div>

        <h4>{t("Merchant access")}</h4>
        <Case condition={customer?.status === "verified"}>
          <p>{t("Access granted")}</p>
        </Case>

        <Case condition={customer?.status !== "verified"}>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              className="bg-[#0B6A0B] text-white hover:bg-[#149014]"
              onClick={handleAcceptMerchant}
            >
              <TickCircle />
              {t("Grant Access")}
            </Button>

            <Button
              type="button"
              className="bg-[#D13438] text-white hover:bg-[#b42328]"
              onClick={handleDeclineMerchant}
            >
              <CloseCircle />
              {t("Reject")}
            </Button>

            <Button
              type="button"
              className="bg-[#EAA300] text-white hover:bg-[#c08701]"
            >
              <MoreCircle />
              {t("Pending")}
            </Button>
          </div>
        </Case>
      </AccordionContent>
    </AccordionItem>
  );
}
