"use client";

import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Separator from "@/components/ui/separator";
import Switch from "@/components/ui/switch";
import { updateServices } from "@/data/admin/updateServices";
import { useSWR } from "@/hooks/useSWR";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight2 } from "iconsax-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

// Agent info schema
const FeeInfo = z.object({
  value2: z.string({ required_error: "Field is required." }),
});

type TFeeInfo = z.infer<typeof FeeInfo>;

export default function ServicesSettings() {
  const { t } = useTranslation();
  const [, startTransition] = useTransition();

  const { data, isLoading, mutate } = useSWR("/admin/settings");

  const form = useForm<TFeeInfo>({
    resolver: zodResolver(FeeInfo),
    defaultValues: {
      value2: "",
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const formFields = [
    {
      name: "deposit",
      label: t("Deposit"),
      placeholder: "0.00%",
      switchable: true,
    },
    {
      name: "deposit_commission",
      label: t("Deposit Commission"),
      switchable: false,
    },
    {
      name: "withdraw",
      label: t("Withdraw"),
      switchable: true,
    },
    {
      name: "withdraw_commission",
      label: t("Withdraw Commission"),
      switchable: false,
    },
    {
      name: "transfer",
      label: t("Transfer"),
      switchable: true,
    },
    {
      name: "exchange",
      label: t("Exchange"),
      switchable: true,
    },
    {
      name: "payment",
      label: t("Payment"),
      switchable: true,
    },
    {
      name: "topup",
      label: t("Top-up"),
      switchable: true,
    },
    {
      name: "electricity_bill",
      label: t("Electricity Bill"),
      switchable: true,
    },
    {
      name: "virtual_card",
      label: t("Virtual Card"),
      switchable: true,
    },
  ];

  const getFieldValue = (key: string, valueType: string) => {
    const field = data?.data?.find((item: any) => item.key === key);
    return field ? field[valueType] : "";
  };

  // update access status
  const handleServicesToggle = (
    key: string,
    value1: "on" | "off",
    value2: string,
  ) => {
    const data = {
      key,
      value1,
      value2: value2 || null,
    };

    toast.promise(updateServices(data), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        mutate();
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  // update services
  const handleServiceCharges = (
    key: string,
    value1: "on" | "off",
    value2: string,
  ) => {
    const data = {
      key,
      value1,
      value2,
    };

    // update services information
    startTransition(async () => {
      const res = await updateServices(data);
      if (res.status) {
        mutate();
        toast.success(res.message);
      } else {
        toast.error(t(res.message));
      }
    });
  };

  return (
    <div className="rounded-xl border border-border bg-background px-4 py-0">
      <div className="py-6 hover:no-underline">
        <p className="text-base font-medium leading-[22px]">
          {t("Services and Status")}
        </p>
      </div>

      <div className="flex items-center gap-4 border-t py-4">
        <div className="grid w-full grid-cols-1 gap-6 px-1 md:grid-cols-2">
          {formFields.map((formField) => (
            <div className="rounded-2xl border p-3" key={formField.name}>
              <div className="mb-2 flex h-6 items-center justify-between gap-2">
                <h6 className="w-[200px]">{formField.label}</h6>
                {formField.switchable && (
                  <Switch
                    defaultChecked={
                      getFieldValue(formField.name, "value1") === "on"
                    }
                    onCheckedChange={() =>
                      handleServicesToggle(
                        formField.name,
                        getFieldValue(formField.name, "value1") === "on"
                          ? "off"
                          : "on",
                        getFieldValue(formField.name, "value2"),
                      )
                    }
                  />
                )}
              </div>
              <Separator className="my-2 bg-divider" />
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit((data) =>
                    handleServiceCharges(
                      formField.name,
                      getFieldValue(formField.name, "value1"),
                      data.value2,
                    ),
                  )}
                  className="flex items-end gap-2"
                >
                  {formField.name !== "virtual_card" ? (
                    <FormField
                      control={form.control}
                      name="value2"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm">
                            {t("Default fee")} (%)
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder={formField.placeholder}
                              disabled={
                                getFieldValue(formField.name, "value1") ===
                                "off"
                              }
                              className="h-10 text-base font-normal disabled:cursor-auto disabled:bg-accent disabled:opacity-100"
                              defaultValue={getFieldValue(
                                formField.name,
                                "value2",
                              )}
                              onChange={field.onChange}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <FormField
                      control={form.control}
                      name="value2"
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel className="text-sm">
                            {t("Card Provider")}
                          </FormLabel>
                          <FormControl>
                            <Select
                              defaultValue={getFieldValue(
                                formField.name,
                                "value2",
                              )}
                              disabled={
                                getFieldValue(formField.name, "value1") ===
                                "off"
                              }
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="disabled:bg-input">
                                <SelectValue
                                  placeholder={t("Select card provider")}
                                />
                              </SelectTrigger>
                              <SelectContent>
                                {["sudo-africa", "stripe-cards"]?.map(
                                  (currency: any) => (
                                    <SelectItem key={currency} value={currency}>
                                      {currency}
                                    </SelectItem>
                                  ),
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <Button
                    disabled={getFieldValue(formField.name, "value1") === "off"}
                  >
                    {t("Save")}
                    <ArrowRight2 size={20} />
                  </Button>
                </form>
              </Form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
