import { CountrySelection } from "@/components/common/form/CountrySelection";
import { SelectWallet } from "@/components/common/form/SelectWallet";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowRight2 } from "iconsax-react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TTransferFormData } from "../page";

interface IProps {
  form: UseFormReturn<TTransferFormData>;
  onNext: () => void;
}

export function TransferDetails({ form, onNext }: IProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-4 md:gap-y-8 md:pt-6">
      {/* Recipient */}
      <div className="flex flex-col gap-y-4">
        <h2>{t("Add recipient email")}</h2>
        {/* Recipient Id */}
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input type="email" placeholder={t("Email")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col gap-y-4">
        <h2>{t("Select country")}</h2>
        <FormField
          name="country"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <CountrySelection
                  defaultCountry={field.value}
                  onSelectChange={(country) =>
                    field.onChange(country.code.cca2)
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col gap-y-4">
        <h2>{t("Select wallet")}</h2>
        <FormField
          name="transferWalletId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectWallet {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col gap-y-4">
        <h2>{t("Add amount")}</h2>
        <FormField
          name="transferAmount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  placeholder={t("Enter transfer amount")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex justify-end">
        <Button type="button" onClick={onNext} className="min-w-48">
          <span>{t("Next")}</span>
          <ArrowRight2 size={16} />
        </Button>
      </div>
    </div>
  );
}
