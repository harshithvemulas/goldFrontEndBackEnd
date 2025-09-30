"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateMerchantFees } from "@/data/admin/updateMerchantFees";
import { useSWR } from "@/hooks/useSWR";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import { useParams } from "next/navigation";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  depositFee: z.string().optional(),
  withdrawalFee: z.string().optional(),
  exchangeFee: z.string().optional(),
  transferFee: z.string().optional(),
  paymentFee: z.string().optional(),
});

type TFormData = z.infer<typeof formSchema>;

export default function FeesSettings() {
  const params = useParams();
  const [isPending, startTransition] = useTransition();
  const { t } = useTranslation();

  // fetch user by id
  const { data, isLoading, mutate } = useSWR(
    `/admin/merchants/${params.merchantId}`,
  );

  // form instance
  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      depositFee: "",
      withdrawalFee: "",
      exchangeFee: "",
      transferFee: "",
      paymentFee: "",
    },
  });

  // Agent useEffect
  useEffect(() => {
    if (data?.data) {
      form.reset({
        depositFee: data?.data?.depositFee ?? "",
        withdrawalFee: data?.data?.withdrawalFee ?? "",
        exchangeFee: data?.data?.exchangeFee ?? "",
        transferFee: data?.data?.transferFee ?? "",
        paymentFee: data?.data?.paymentFee ?? "",
      });
    }
  }, [data?.data, form]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const formFields = [
    {
      name: "depositFee",
      label: t("Deposit Fee"),
      placeholder: "0.00%",
    },
    {
      name: "withdrawalFee",
      label: t("Withdrawal Fee"),
      placeholder: "0.00%",
    },
    {
      name: "exchangeFee",
      label: t("Exchange Fee"),
      placeholder: "0.00%",
    },
    {
      name: "transferFee",
      label: t("Transfer Fee"),
      placeholder: "0.00%",
    },
    {
      name: "paymentFee",
      label: t("Payment Fee"),
      placeholder: "0.00%",
    },
  ];

  // update fees
  const onSubmit = (values: TFormData) => {
    startTransition(async () => {
      const res = await updateMerchantFees(values, params.userId as string);
      if (res.status) {
        toast.success(res.message);
        mutate();
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <Accordion type="multiple" defaultValue={["ServicesSettings"]}>
      <div className="flex flex-col gap-4 p-4">
        <div className="rounded-xl border border-border bg-background">
          <AccordionItem
            value="ServicesSettings"
            className="rounded-xl border border-border bg-background px-4 py-0"
          >
            <AccordionTrigger className="py-6 hover:no-underline">
              <p className="text-base font-medium leading-[22px]">
                {t("Fees")}
              </p>
            </AccordionTrigger>

            <AccordionContent className="flex items-center gap-4 border-t pt-4">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
                  <div className="flex w-full flex-col gap-y-6 px-1">
                    {formFields.map((formField: any) => (
                      <FormField
                        key={formField.name}
                        control={form.control}
                        name={formField.name}
                        render={({ field }) => (
                          <FormItem className="w-full space-y-2.5">
                            <FormLabel>{formField.label}</FormLabel>
                            <Input
                              type="text"
                              placeholder={formField.placeholder}
                              className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                              {...field}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <div className="mt-4 flex flex-row items-center justify-end gap-4">
                    <Button disabled={isPending}>
                      <Case condition={isPending}>
                        <Loader className="text-primary-foreground" />
                      </Case>
                      <Case condition={!isPending}>
                        {t("Save")}
                        <ArrowRight2 size={20} />
                      </Case>
                    </Button>
                  </div>
                </form>
              </Form>
            </AccordionContent>
          </AccordionItem>
        </div>
      </div>
    </Accordion>
  );
}
