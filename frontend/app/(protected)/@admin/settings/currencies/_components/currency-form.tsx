"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Switch from "@/components/ui/switch";
import { createCurrency } from "@/data/settings/createCurrency";
import { updateCurrency } from "@/data/settings/updateCurrency";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import { useEffect, useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(1, "Currency name is required."),
  code: z.string().min(1, "Currency code is required."),
  minAmount: z.string().min(1, "Minimum amount is required."),
  maxAmount: z.string().min(1, "Maximum amount is required."),
  dailyTransferAmount: z.string().min(1, "Daily transfer amount is required."),
  dailyTransferLimit: z.string().min(1, "Daily transfer limit is required."),
  kycLimit: z.string().optional(),
  notificationLimit: z.string().optional(),
  acceptApiRate: z.boolean().optional(),
  usdRate: z.string().optional(),
  isCrypto: z.boolean().optional(),
});

type TFormData = z.infer<typeof formSchema>;

export function CurrencyForm({
  currency,
  onMutate,
}: {
  currency?: any;
  onMutate: () => void;
}) {
  const { t } = useTranslation();
  const [isPending, startTransition] = useTransition();

  const form = useForm<TFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      minAmount: "",
      maxAmount: "",
      dailyTransferAmount: "",
      dailyTransferLimit: "",
      kycLimit: "",
      notificationLimit: "",
      acceptApiRate: !!currency?.acceptApiRate,
      usdRate: "",
      isCrypto: !!currency?.isCrypto,
    },
  });

  useEffect(() => {
    if (currency) {
      form.reset({
        name: currency?.name,
        code: currency?.code,
        minAmount: String(currency?.minAmount),
        maxAmount: String(currency?.maxAmount),
        dailyTransferAmount: String(currency?.dailyTransferAmount),
        dailyTransferLimit: String(currency?.dailyTransferLimit),
        kycLimit: currency?.kycLimit ? String(currency?.kycLimit) : "",
        notificationLimit: currency?.notificationLimit
          ? String(currency?.notificationLimit)
          : "",
        acceptApiRate: !!currency?.acceptApiRate,
        usdRate: String(currency?.usdRate),
        isCrypto: !!currency?.isCrypto,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const acceptApiRate = form.watch("acceptApiRate");

  const formFields = [
    {
      name: "name",
      label: t("Currency Name"),
      placeholder: t("Enter currency name"),
      type: "text",
    },
    {
      name: "code",
      label: t("Code"),
      placeholder: t("Enter currency code"),
      type: "text",
    },
    {
      name: "minAmount",
      label: t("Minimum amount"),
      placeholder: t("Enter minimum transaction amount"),
      type: "text",
    },
    {
      name: "maxAmount",
      label: t("Maximum amount"),
      placeholder: t("Enter maximum transaction amount"),
      type: "text",
    },
    {
      name: "dailyTransferAmount",
      label: t("Daily transfer amount"),
      placeholder: t("Enter daily transfer amount"),
      type: "text",
    },
    {
      name: "dailyTransferLimit",
      label: t("Daily transfer limit"),
      placeholder: t("Enter daily transfer limit"),
      type: "text",
    },
    {
      name: "kycLimit",
      label: t("Kyc limit (Optional)"),
      placeholder: t("Enter kyc limit"),
      type: "text",
    },
    {
      name: "notificationLimit",
      label: t("Notification limit (Optional)"),
      placeholder: t("Enter notification limit"),
      type: "text",
    },
    {
      name: "acceptApiRate",
      label: t("Accept API rate"),
      type: "switch",
    },
    ...(!acceptApiRate
      ? [
          {
            name: "usdRate",
            label: t("USD Rate"),
            placeholder: t("Enter USD rate"),
            type: "text",
          },
        ]
      : []),
    {
      name: "isCrypto",
      label: t("Is Crypto"),
      type: "switch",
    },
  ];

  const onSubmit = (data: TFormData) => {
    const formData = {
      ...data,
      kycLimit: data.kycLimit ? data.kycLimit : null,
      notificationLimit: data.notificationLimit ? data.notificationLimit : null,
      acceptApiRate: data.acceptApiRate ? 1 : 0,
      isCrypto: data.isCrypto ? 1 : 0,
    };

    if (!currency) {
      startTransition(async () => {
        const res = await createCurrency(formData);
        if (res.status) {
          onMutate();
          toast.success(res.message);
        } else {
          toast.error(res.message);
        }
      });
    } else {
      startTransition(async () => {
        const res = await updateCurrency(formData, currency?.id);
        if (res.status) {
          onMutate();
          toast.success(res.message);
          form.reset();
        } else {
          toast.error(res.message);
        }
      });
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-y-4"
      >
        {formFields.map((f: any) =>
          f.type === "text" ? (
            <FormField
              key={f.name}
              control={form.control}
              name={f.name}
              render={({ field }) => (
                <FormItem className="space-y-2.5">
                  <FormLabel>{f.label}</FormLabel>
                  <Input
                    placeholder={f.placeholder}
                    className="mx-0.5"
                    {...field}
                  />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              key={f.name}
              control={form.control}
              name={f.name}
              render={() => (
                <FormItem className="flex items-center">
                  <FormLabel className="mt-2 inline-block w-[150px]">
                    {f.label}
                  </FormLabel>
                  <Switch
                    key={f.name}
                    defaultChecked={form.getValues(f.name)}
                    onCheckedChange={(value) => form.setValue(f.name, value)}
                  />
                </FormItem>
              )}
            />
          ),
        )}

        <Button disabled={isPending}>
          <Case condition={isPending}>
            <Loader
              title={currency ? t("Updating...") : t("Processing...")}
              className="text-primary-foreground"
            />
          </Case>
          <Case condition={!isPending}>
            {currency ? t("Update Currency") : t("Create Currency")}
            <ArrowRight2 size={20} />
          </Case>
        </Button>
      </form>
    </Form>
  );
}
