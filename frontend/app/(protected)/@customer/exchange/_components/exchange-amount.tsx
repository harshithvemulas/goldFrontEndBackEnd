import { SelectWallet } from "@/components/common/form/SelectWallet";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronRight } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TExchangeFormData } from "../page";

interface IExchangeAmountProps {
  form: UseFormReturn<TExchangeFormData>;
  onNext: () => void;
}

export function ExchangeAmount({ form, onNext }: IExchangeAmountProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-4 md:gap-y-8">
      <div className="flex flex-col gap-y-4">
        <h2>{t("From")}</h2>
        <FormField
          name="currencyFrom"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectWallet {...field} id="currency-from" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* To */}
      <div className="flex flex-col gap-y-4">
        <h2>{t("To")}</h2>
        <FormField
          name="currencyTo"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectWallet {...field} id="currency-to" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col gap-y-4">
        <h2>{t("How much?")}</h2>
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder={t("Enter exchange amount")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" onClick={onNext}>
          {t("Next")}
          <ChevronRight size={15} />
        </Button>
      </div>
    </div>
  );
}
