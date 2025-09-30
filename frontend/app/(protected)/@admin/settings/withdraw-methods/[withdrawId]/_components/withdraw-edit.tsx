"use client";

import MethodForm from "@/app/(protected)/@admin/settings/withdraw-methods/_components/method-form";
import { Loader } from "@/components/common/Loader";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { updateWithdrawMethod } from "@/data/admin/withdraw-method/updateWithdrawMethod";
import {
  TWithdrawMethodData,
  WithdrawMethodSchema,
} from "@/schema/withdraw-method-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

interface FormData extends Record<string, any> {
  uploadLogo: FileList;
  name: string;
  countryCode: string;
  currencyCode: string;
  active: boolean;
  recommended: boolean;
  minAmount?: number;
  maxAmount?: number;
  fixedCharge?: number;
  percentageCharge?: number;
  params: any;
}

interface IProps<T> {
  method: T;
  onMutate: () => void;
}

export function WithdrawEdit<T extends FormData>({
  method,
  onMutate,
}: IProps<T>) {
  const params = useParams(); // get customerId from params
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TWithdrawMethodData>({
    resolver: zodResolver(WithdrawMethodSchema),
    defaultValues: {
      uploadLogo: method?.logoImage || "",
      name: method?.name,
      countryCode: method?.countryCode,
      currencyCode: method?.currencyCode,
      active: !!method?.active,
      recommended: !!method?.recommended,
      minAmount: String(method.minAmount) || "0",
      maxAmount: String(method?.maxAmount) || "0",
      fixedCharge: String(method?.fixedCharge || "0"),
      percentageCharge: String(method?.percentageCharge) || "0",
      params: JSON.parse(method?.params),
    },
  });

  // update agent info data
  const onSubmit = (values: TWithdrawMethodData) => {
    startTransition(async () => {
      const res = await updateWithdrawMethod(
        values,
        params?.withdrawId as string,
      );
      if (res.status) {
        onMutate();
        toast.success(res.message);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <AccordionItem
      value="withdrawDetails"
      className="mb-4 rounded-xl border border-border bg-background px-4 py-0"
    >
      <AccordionTrigger className="py-6 hover:no-underline">
        <p className="text-base font-medium leading-[22px]">
          {t("Method details")}
        </p>
      </AccordionTrigger>
      <AccordionContent className="gap-4 border-t pt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6 px-1"
          >
            <MethodForm form={form} logoImage={method?.uploadLogo} />

            <div className="flex flex-row items-center justify-end gap-4">
              <Button>
                {isPending ? (
                  <Loader
                    title={t("Updating...")}
                    className="text-primary-foreground"
                  />
                ) : (
                  <>
                    {t("Update method")}
                    <ArrowRight2 size={20} />
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </AccordionContent>
    </AccordionItem>
  );
}
