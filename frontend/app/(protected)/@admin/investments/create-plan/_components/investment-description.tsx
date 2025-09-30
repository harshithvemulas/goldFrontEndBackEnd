import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Separator from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { InvestmentFormData } from "../page";

export default function InvestmentDescription({
  form,
  setStep,
  isPending,
}: {
  form: UseFormReturn<InvestmentFormData>;
  setStep: (step: number) => void;
  isPending: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex max-w-3xl flex-col gap-6 px-1 py-4">
      <FormField
        name="description"
        control={form.control}
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("Description")}</FormLabel>
            <Textarea
              placeholder={t("Write description here...")}
              rows={10}
              {...field}
            />
            <FormMessage />
          </FormItem>
        )}
      />
      <Separator className="bg-divider" />

      <div className="flex flex-row items-center justify-between gap-4">
        <Button type="submit" variant="outline" onClick={() => setStep(1)}>
          <ArrowLeft2 size={20} />
          {t("Back")}
        </Button>

        <Button type="submit" disabled={isPending}>
          <Case condition={!isPending}>
            {t("Edit plan")}
            <ArrowRight2 size={20} />
          </Case>
          <Case condition={isPending}>
            <Loader
              title={t("Processing...")}
              className="text-primary-foreground"
            />
          </Case>
        </Button>
      </div>
    </div>
  );
}
