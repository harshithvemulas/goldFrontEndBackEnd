"use client";

import MethodForm from "@/app/(protected)/@admin/settings/withdraw-methods/_components/method-form";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createWithdrawMethod } from "@/data/admin/withdraw-method/createWIthdrawMethod";
import {
  TWithdrawMethodData,
  WithdrawMethodSchema,
} from "@/schema/withdraw-method-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export default function CreateMethod() {
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  const router = useRouter();

  const form = useForm<TWithdrawMethodData>({
    resolver: zodResolver(WithdrawMethodSchema),
    defaultValues: {
      uploadLogo: "",
      name: "",
      countryCode: "",
      currencyCode: "",
      active: true,
      recommended: false,
      minAmount: "0",
      maxAmount: "0",
      fixedCharge: "0",
      percentageCharge: "0",
      params: [{ name: "", label: "", type: "text", required: false }],
    },
  });

  const onSubmit = (values: TWithdrawMethodData) => {
    startTransition(async () => {
      const res = await createWithdrawMethod(values);
      if (res?.status) {
        toast.success(t("Withdraw method created successfully"));
        router.push("/settings/withdraw-methods");
      } else {
        toast.error(t(res?.message));
      }
    });
  };

  return (
    <div className="mb-4 rounded-xl border border-border bg-background p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6 px-1"
        >
          <MethodForm form={form} />

          <div className="flex flex-row items-center justify-end gap-4">
            <Button>
              {isPending ? (
                <Loader
                  title={t("Creating...")}
                  className="text-primary-foreground"
                />
              ) : (
                <>
                  {t("Create method")}
                  <ArrowRight2 size={20} />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
