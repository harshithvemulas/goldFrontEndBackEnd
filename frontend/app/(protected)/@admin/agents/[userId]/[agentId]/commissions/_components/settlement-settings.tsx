"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateAgentDepositAndWithdrawal } from "@/data/admin/updateAgentDepositAndWithdrawal";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
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

type Data = {
  id: string | number;
  userId: string | number;
  depositCharge: number | null;
  withdrawalCharge: number | null;
  depositCommission: number | null;
  withdrawalCommission: number | null;
};

export default function SettlementSettings({
  data,
  onMutate,
}: {
  data: Data;
  onMutate: () => void;
}) {
  const [isPending, startTransaction] = useTransition();

  const { t } = useTranslation();

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
    const formatValue = (value: number | null) => {
      if (value === null) {
        return "default";
      }
      return value?.toString();
    };

    if (data) {
      form.reset({
        depositCharge: formatValue(data?.depositCharge),
        withdrawalCharge: formatValue(data?.withdrawalCharge),
        depositCommission: formatValue(data?.depositCommission),
        withdrawalCommission: formatValue(data?.withdrawalCommission),
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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

    startTransaction(async () => {
      const filterValue = (value: string) => {
        return value === "default" ? null : Number(value);
      };

      if (!errorCount) {
        const formData = {
          depositCharge: filterValue(values.depositCharge),
          withdrawalCharge: filterValue(values.withdrawalCharge),
          depositCommission: filterValue(values.depositCommission),
          withdrawalCommission: filterValue(values.withdrawalCommission),
        };

        const res = await updateAgentDepositAndWithdrawal(
          formData,
          data?.userId,
        );

        if (res.status) {
          onMutate();
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

              <span className="flex items-center gap-1.5">
                <Checkbox
                  checked={field.value === "default"}
                  onCheckedChange={(checked) =>
                    field.onChange(checked ? "default" : data?.[name] || "")
                  }
                />
                <span>{t("Use default instead")}</span>
              </span>
            </div>

            <FormControl>
              <Input
                type={type}
                placeholder={placeholder ?? "0.00%"}
                disabled={field.value === "default"}
                className="text-base font-normal disabled:cursor-auto disabled:opacity-50"
                value={
                  field.value === "default" ? data?.[name] || "" : field.value
                }
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

            <div className="flex flex-row items-center justify-end gap-4">
              <Button disabled={isPending}>
                <Case condition={!isPending}>
                  {t("Save")}
                  <ArrowRight2 size={20} />
                </Case>
                <Case condition={isPending}>
                  <Loader className="text-primary-foreground" />
                </Case>
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </form>
    </Form>
  );
}
