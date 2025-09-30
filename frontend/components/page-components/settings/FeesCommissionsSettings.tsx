"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateCommission } from "@/data/settings/updateCommission";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const ProfileInfoSchema = z.object({
  depositCharge: z.string({
    required_error: "Agent deposit fee is required.",
  }),

  withdrawalCharge: z.string({
    required_error: "Withdrawal fee is required.",
  }),

  depositCommission: z.string({
    required_error: "Deposit commission fee is required.",
  }),

  withdrawalCommission: z.string({
    required_error: "Withdrawal commission fee is required.",
  }),
});

type TProfileInfoFormData = z.infer<typeof ProfileInfoSchema>;

export default function FeesCommissionsSettings({
  data,
  isLoading,
}: {
  data: any;
  isLoading: boolean;
}) {
  const { t } = useTranslation();
  const [, startTransition] = useTransition();

  const form = useForm<TProfileInfoFormData>({
    resolver: zodResolver(ProfileInfoSchema),
    defaultValues: {
      depositCharge: "",
      withdrawalCharge: "",
      depositCommission: "",
      withdrawalCommission: "",
    },
  });

  React.useEffect(() => {
    if (data && !isLoading) {
      form.reset({
        depositCharge: data.depositFee?.toString(),
        withdrawalCharge: data.withdrawalFee?.toString(),
        depositCommission: data.depositCommission?.toString(),
        withdrawalCommission: data.withdrawalCommission?.toString(),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  // handle form submission logics
  const onSubmit = (values: TProfileInfoFormData) => {
    let errorCount: number = 0;

    // check validation is number...
    const validate = (key: keyof TProfileInfoFormData, value: string) => {
      if (value !== "default" && Number.isNaN(Number(value))) {
        form.setError(key, {
          message: t("Must be a number"),
        });
        return false;
      }
      return true;
    };

    Object.keys(values).forEach((v) => {
      const key = v as keyof TProfileInfoFormData;
      const value = values[key];
      if (!validate(key, value)) {
        errorCount += 1;
      }
    });

    // api submission
    startTransition(async () => {
      const filterValue = (value: string) => {
        return value === "default" ? null : Number(value);
      };

      if (!errorCount) {
        const data = {
          depositCharge: filterValue(values.depositCharge),
          withdrawalCharge: filterValue(values.withdrawalCharge),
          depositCommission: filterValue(values.depositCommission),
          withdrawalCommission: filterValue(values.withdrawalCommission),
        };

        const res = await updateCommission(data);

        if (res && res.status) {
          toast.success(res.message);
        } else {
          toast.error(t(res.message));
        }
      }
    });
  };

  const input = (
    name: keyof TProfileInfoFormData,
    label: string,
    type: string | undefined = "text",
    placeholder?: string,
  ) => {
    return (
      <FormField
        control={form.control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <div className="flex items-center gap-4">
              <FormLabel className="text-sm sm:text-base">{t(label)}</FormLabel>
            </div>

            <FormControl>
              <Input
                type={type}
                placeholder={placeholder ?? "0.00%"}
                disabled
                className="text-base font-normal disabled:cursor-auto disabled:bg-accent disabled:opacity-100"
                value={field.value}
                onChange={field.onChange}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    );
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-xl border border-border bg-background"
      >
        <AccordionItem
          value="FEES_COMMISSIONS_INFORMATION"
          className="border-none px-4 py-0"
        >
          <AccordionTrigger className="py-6 hover:no-underline">
            <p className="text-base font-medium leading-[22px]">
              {t("Charges and commissions")}
            </p>
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-6 border-t px-1 py-4">
            {input("depositCharge", "Agent deposit charge (Long distance)")}
            {input(
              "withdrawalCharge",
              "Agent withdrawal charge (Long distance)",
            )}
            {input("depositCommission", "Agent deposit commission")}
            {input("withdrawalCommission", "Agent withdrawal commission")}
          </AccordionContent>
        </AccordionItem>
      </form>
    </Form>
  );
}
