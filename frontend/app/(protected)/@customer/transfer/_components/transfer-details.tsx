import { Case } from "@/components/common/Case";
import { SelectWallet } from "@/components/common/form/SelectWallet";
import { Loader } from "@/components/common/Loader";
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
  isCheckingUser: boolean;
  onNext: () => void;
}

export function TransferDetails({ form, isCheckingUser, onNext }: IProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-y-4 md:gap-y-8">
      {/* Recipient */}
      <div className="flex flex-col gap-y-4">
        <h2>{t("Add recipient")}</h2>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="text"
                  placeholder={t("Enter recipient’s email")}
                  {...field}
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
          name="currencyCode"
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
          name="amount"
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
        <Button
          type="submit"
          onClick={onNext}
          className="min-w-48"
          disabled={isCheckingUser}
        >
          <Case condition={isCheckingUser}>
            <Loader
              title={t("Checking...")}
              className="text-primary-foreground"
            />
          </Case>
          <Case condition={!isCheckingUser}>
            <span>{t("Next")}</span>
            <ArrowRight2 size={16} />
          </Case>
        </Button>
      </div>
    </div>
  );
}
