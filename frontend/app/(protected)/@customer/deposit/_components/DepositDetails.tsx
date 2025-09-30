"use client";

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
import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { TDepositFormData } from "../page";

interface IProps {
  form: UseFormReturn<TDepositFormData>;
  onNext: () => void;
}

export function DepositDetails({ form, onNext }: IProps) {
  const { t } = useTranslation();

  // handle validation of this page before onNext call
  const handleOnNextValidation = () => {
    // count error
    let errorCount = 0;

    // check if wallet is selected
    if (!form.getValues("wallet")) {
      form.setError(
        "wallet",
        {
          message: "Please select a wallet.",
          type: "custom",
        },
        { shouldFocus: true },
      );
      errorCount += 1;
    }

    if (!form.getValues("amount")) {
      form.setError(
        "amount",
        {
          message: "Amount is required.",
          type: "custom",
        },
        { shouldFocus: true },
      );
      errorCount += 1;
    }

    if (!errorCount) {
      onNext();
    }
  };

  return (
    <div className="flex flex-col gap-y-4 md:gap-y-8">
      {/* Wallet */}
      <div className="flex flex-col gap-y-4">
        <h2>{t("Select wallet")}</h2>
        <FormField
          name="wallet"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <SelectWallet {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* How much? */}
      <div className="flex flex-col gap-y-4">
        <h2>{t("How much?")}</h2>
        <FormField
          name="amount"
          control={form.control}
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Input
                  type="number"
                  placeholder={t("Enter deposit amount")}
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      onNext();
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Action button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          onClick={handleOnNextValidation}
          className="min-w-48"
        >
          <span>{t("Next")}</span>
          <ArrowRight2 size={16} />
        </Button>
      </div>
    </div>
  );
}
