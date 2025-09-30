import { TElectricityBillFormData } from "@/app/(protected)/@customer/services/electricity-bill/page";
import { SelectWallet } from "@/components/common/form/SelectWallet";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function PaymentDetails({
  form,
  onNext,
  onBack,
}: {
  form: UseFormReturn<TElectricityBillFormData>;
  onNext: () => void;
  onBack: () => void;
}) {
  const { t } = useTranslation();

  const handleOnNextValidation = () => {
    // count error
    let errorCount = 0;

    // check if wallet is selected
    if (!form.getValues("sender_wallet_id")) {
      form.setError(
        "sender_wallet_id",
        {
          message: "Please select a wallet.",
          type: "custom",
        },
        { shouldFocus: true },
      );
      errorCount += 1;
    }

    if (!form.getValues("bill_amount")) {
      form.setError(
        "bill_amount",
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
    <div className="flex w-full flex-col gap-4 md:gap-6">
      <div>
        <h2 className="mb-4">{t("Select wallet")}</h2>
        <FormField
          name="sender_wallet_id"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <SelectWallet {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h2 className="mb-4">{t("How much is the bill?")}</h2>
        <FormField
          control={form.control}
          name="bill_amount"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder={t("Enter payment amount")}
                  {...field}
                  type="number"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="flex items-center justify-between gap-4">
        <Button variant="outline" type="button" onClick={onBack}>
          <ArrowLeft2 size={15} />
          {t("Back")}
        </Button>

        <Button type="button" onClick={handleOnNextValidation}>
          {t("Next")}
          <ArrowRight2 size={15} />
        </Button>
      </div>
    </div>
  );
}
