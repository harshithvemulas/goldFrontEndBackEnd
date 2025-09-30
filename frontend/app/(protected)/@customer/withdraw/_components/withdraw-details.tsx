import { TWithdrawFormSchema } from "@/app/(protected)/@customer/withdraw/page";
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

export function WithdrawDetails({
  form,
  toggleWithdrawType,
  toggleTab,
}: {
  form: UseFormReturn<TWithdrawFormSchema>;
  toggleWithdrawType: (type: "regular" | "agent") => void;
  toggleTab: (tab: string) => void;
}) {
  // handle next button
  const onNext = (type: "regular" | "agent") => {
    // validate the form field for this page

    let countError = 0;

    // set an error if wallet id isn't selected
    if (!form.watch("walletId")) {
      form.setError("walletId", {
        message: "Please select a wallet.",
        type: "custom",
      });

      countError += 1;
    }

    // set an error if amount not added
    if (!form.watch("withdrawAmount")) {
      form.setError(
        "withdrawAmount",
        {
          message: "Please enter withdraw amount.",
          type: "custom",
        },
        { shouldFocus: true },
      );

      countError += 1;
    }

    // if there has no error
    if (countError === 0) {
      // if type regular
      if (type === "regular") {
        toggleWithdrawType("regular");
        toggleTab("review");
      }

      // if type agent
      if (type === "agent") {
        toggleWithdrawType("agent");
        toggleTab("agent_selection");
      }
    }
  };
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-4 md:gap-8">
      {/* Select wallet */}
      <div className="flex flex-col gap-y-4">
        <h2>{t("Select wallet")}</h2>
        <FormField
          name="walletId"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectWallet value={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* How much */}
      <div className="flex flex-col gap-y-4">
        <h2>{t("How much?")}</h2>
        <FormField
          name="withdrawAmount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="number"
                  placeholder={t("Enter withdraw amount")}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex flex-col justify-end gap-2.5 md:flex-row">
        <Button type="button" variant="outline" onClick={() => onNext("agent")}>
          {t("Withdraw through an agent")}
        </Button>
        <Button type="submit" onClick={() => onNext("regular")}>
          {t("Regular withdraw")}
          <ArrowRight2 size={15} />
        </Button>
      </div>
    </div>
  );
}
