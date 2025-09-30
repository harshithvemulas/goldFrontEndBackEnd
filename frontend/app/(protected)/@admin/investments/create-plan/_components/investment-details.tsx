import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Separator from "@/components/ui/separator";
import Switch from "@/components/ui/switch";
import { useCurrencies } from "@/data/useCurrencies";
import { startCase } from "@/lib/utils";
import { Currency } from "@/types/currency";
import { ArrowRight2 } from "iconsax-react";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InvestmentFormData } from "../page";

export default function InvestmentDetails({
  form,
  setStep,
}: {
  form: UseFormReturn<InvestmentFormData>;
  setStep: (step: number) => void;
}) {
  const { t } = useTranslation();
  const { currencies, isLoading } = useCurrencies();

  const handleOnNextValidation = () => {
    const fieldsToValidate = [
      { name: "name", message: t("Name is required") },
      {
        name: "minAmount",
        message:
          form.watch("isRange") === "1"
            ? t("Minimum amount is required")
            : t("Investment amount is required"),
      },
      { name: "currency", message: t("Currency is required") },
      { name: "interestRate", message: t("Interest rate is required") },
      { name: "duration", message: t("Duration is required") },
      { name: "durationType", message: t("Duration type is required") },
      {
        name: "withdrawAfterMatured",
        message: t("Withdraw after matured is required"),
      },
    ];

    let errorCount = 0;

    fieldsToValidate.forEach((field) => {
      if (!form.getValues(field.name as keyof InvestmentFormData)) {
        form.setError(
          field.name as keyof InvestmentFormData,
          {
            message: field.message,
            type: "custom",
          },
          { shouldFocus: true },
        );
        errorCount += 1;
      }
    });

    if (form.getValues("isRange") === "1" && !form.getValues("maxAmount")) {
      form.setError(
        "maxAmount",
        {
          message: t("Maximum amount is required"),
          type: "custom",
        },
        { shouldFocus: true },
      );
      errorCount += 1;
    }

    if (!errorCount) {
      setStep(2);
    }
  };

  // Clear errors when the field value changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name && form.getFieldState(name).error) {
        form.clearErrors(name);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  return (
    <div className="flex max-w-3xl flex-col gap-6 px-1 py-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="col-span-12 lg:col-span-6">
            <FormLabel>{t("Plan name")}</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder={t("Enter name for the investment plan")}
                className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="isRange"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Investment type")}</FormLabel>
            <FormControl>
              <RadioGroup
                defaultValue={field.value}
                onValueChange={field.onChange}
                className="flex"
              >
                <Label
                  htmlFor="TypeRange"
                  data-selected={field.value === "1"}
                  className="relative h-12 flex-1 rounded-xl border-2 border-transparent bg-muted p-4 hover:cursor-pointer hover:bg-primary-selected data-[selected=true]:border-primary data-[selected=true]:bg-primary-selected"
                >
                  <RadioGroupItem
                    id="TypeRange"
                    value="1"
                    className="absolute opacity-0"
                  />
                  <span>{t("Range")}</span>
                </Label>

                <Label
                  htmlFor="TypeFixed"
                  data-selected={field.value === "0"}
                  className="relative h-12 flex-1 rounded-xl border-2 border-transparent bg-muted p-4 hover:cursor-pointer hover:bg-primary-selected data-[selected=true]:border-primary data-[selected=true]:bg-primary-selected"
                >
                  <RadioGroupItem
                    id="TypeFixed"
                    value="0"
                    className="absolute opacity-0"
                  />
                  <span>{t("Fixed")}</span>
                </Label>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator className="bg-divider" />

      <div
        className={`grid ${form.watch("isRange") === "1" ? "grid-cols-2" : "grid-cols-1"} items-end gap-2`}
      >
        <FormField
          control={form.control}
          name="minAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {form.watch("isRange") === "1"
                  ? t("Investment amount (min-max)")
                  : t("Investment amount (Fixed)")}
              </FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={
                    form.watch("isRange") === "1"
                      ? t("Min")
                      : t("Enter investment amount")
                  }
                  className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("isRange") === "1" && (
          <FormField
            control={form.control}
            name="maxAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>&nbsp;</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder={t("Max")}
                    className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
      </div>

      <FormField
        name="currency"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Currency")}</FormLabel>
            <FormControl>
              <Select
                value={field.value.toUpperCase()}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="disabled:bg-input">
                  <SelectValue placeholder={t("Select currency")} />
                </SelectTrigger>
                <SelectContent>
                  {!isLoading &&
                    currencies?.map((currency: Currency) => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.code}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="duration"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Duration (Days)")}</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder={t("Enter investment duration")}
                className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="interestRate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Profit rate (Percentage)")}</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder={t("Enter a profit rate")}
                className="text-base font-normal disabled:cursor-auto disabled:bg-input disabled:opacity-100"
                {...field}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="durationType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Profit adjust")}</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="disabled:bg-input">
                  <SelectValue placeholder={t("Select portfolio adjust")} />
                </SelectTrigger>
                <SelectContent>
                  {["daily", "weekly", "monthly", "yearly"].map((item: any) => (
                    <SelectItem key={item} value={item}>
                      {startCase(t(item))}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="withdrawAfterMatured"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Withdraw After Matured")}</FormLabel>
            <FormControl>
              <RadioGroup
                defaultValue={field.value}
                onValueChange={field.onChange}
                className="flex"
              >
                <Label
                  htmlFor="TypeYes"
                  data-selected={field.value === "1"}
                  className="relative h-12 flex-1 rounded-xl border-2 border-transparent bg-muted p-4 hover:cursor-pointer hover:bg-primary-selected data-[selected=true]:border-primary data-[selected=true]:bg-primary-selected"
                >
                  <RadioGroupItem
                    id="TypeYes"
                    value="1"
                    className="absolute opacity-0"
                  />
                  <span>{t("Yes")}</span>
                </Label>

                <Label
                  htmlFor="TypeNo"
                  data-selected={field.value === "0"}
                  className="relative h-12 flex-1 rounded-xl border-2 border-transparent bg-muted p-4 hover:cursor-pointer hover:bg-primary-selected data-[selected=true]:border-primary data-[selected=true]:bg-primary-selected"
                >
                  <RadioGroupItem
                    id="TypeNo"
                    value="0"
                    className="absolute opacity-0"
                  />
                  <span>{t("No")}</span>
                </Label>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="isFeatured"
        control={form.control}
        render={({ field }) => (
          <FormItem className="space-y-auto flex flex-row items-center gap-2">
            <Label className="space-y-auto m-0 mb-0 mt-2 h-auto w-[130px] py-0 text-sm font-semibold">
              {t("Featured")}
            </Label>
            <FormControl>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
                className="disabled:opacity-100"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        name="isActive"
        control={form.control}
        render={({ field }) => (
          <FormItem className="space-y-auto flex flex-row items-center gap-2">
            <Label className="space-y-auto m-0 mb-0 mt-2 h-auto w-[130px] py-0 text-sm font-semibold">
              {t("Active")}
            </Label>
            <FormControl>
              <Switch
                checked={!!field.value}
                onCheckedChange={field.onChange}
                className="disabled:opacity-100"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Separator className="bg-divider" />

      <div className="flex flex-row items-center justify-end gap-4">
        <Button type="button" onClick={handleOnNextValidation}>
          {t("Next")}
          <ArrowRight2 size={20} />
        </Button>
      </div>
    </div>
  );
}
