"use client";

import ShoppingCardIcon from "@/components/icons/ShoppingCardIcon";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Separator from "@/components/ui/separator";
import { convertCustomerType } from "@/data/admin/convertCustomerType";
import { TMerchantInfoFormSchema } from "@/schema/registration-schema";
import { ArrowRight2 } from "iconsax-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { MerchantInfoForm } from "./MerchantInfoForm";

export default function MerchantConvertCard({ customer }: { customer: any }) {
  const [isPending, startTransaction] = React.useTransition();
  const [open, setOpen] = React.useState(false);

  const { t } = useTranslation();

  const onSubmit = (values: TMerchantInfoFormSchema) => {
    startTransaction(async () => {
      const res = await convertCustomerType(
        {
          roleId: 3,
          merchant: {
            name: values.name,
            email: values.email,
            proof: values.license,
            addressLine: values.street,
            zipCode: values.zipCode,
            countryCode: values.country,
            city: values.city,
          },
        },
        customer.id,
      );

      if (res?.status) {
        setOpen(false);
        toast.success(res.message);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <div className="flex flex-1 flex-col items-center rounded-xl border border-border bg-background px-6 py-4">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-spacial-blue-foreground/50">
        <ShoppingCardIcon />
      </div>
      <Separator className="mb-1 mt-[5px] bg-border" />

      <div className="mt-2 px-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl">
              {t("Convert to Merchant")}
              <ArrowRight2 size={16} />
            </Button>
          </DialogTrigger>

          <DialogContent className="flex max-h-[90%] max-w-[716px] flex-col gap-6 p-0">
            <DialogHeader className="px-16 pb-0 pt-16">
              <DialogTitle className="text-[32px] font-medium leading-10">
                {t("Add merchant information")}
              </DialogTitle>
            </DialogHeader>
            <Separator className="mx-16" />

            <div className="h-auto overflow-y-auto px-16 pb-16 pt-0">
              <MerchantInfoForm
                onPrev={() => {
                  setOpen(false);
                }}
                isLoading={isPending}
                onSubmit={onSubmit}
                nextButtonLabel="Convert"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
