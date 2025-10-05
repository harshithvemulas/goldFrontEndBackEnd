import MeterProviderList from "@/app/(protected)/@customer/services/electricity-bill/_components/meter-provider-list";
import { SelectWallet } from "@/components/common/form/SelectWallet";
import { Button } from "@/components/ui/button";
import { Command, CommandInput } from "@/components/ui/command";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TElectricityBillFormData } from "@/schema/electricity-bill-schema";
import { ArrowLeft2, ArrowRight2 } from "iconsax-react";
import Link from "next/link";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

export default function MeterDetails({
  form,
  onNext,
  meterProvider,
  setMeterProvider,
}: {
  form: UseFormReturn<TElectricityBillFormData>;
  onNext: () => void;
  meterProvider: Record<string, any> | null;
  setMeterProvider: (provider: any) => void;
}) {
  const [showProviderList, setShowProviderList] = React.useState(false);
  const { t } = useTranslation();

  return (
    <div className="flex w-full flex-col gap-4 md:gap-6">
      <div>
        <h2 className="mb-4 font-semibold">{t("Electricity name")}</h2>
        <FormField
          name="meter_provider"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Popover
                  open={showProviderList}
                  onOpenChange={setShowProviderList}
                >
                  <PopoverTrigger className="flex h-12 w-full items-center justify-between rounded-md border border-input bg-secondary px-3">
                    {field.value ? (
                      <span>{meterProvider?.name}</span>
                    ) : (
                      <span className="font-normal text-secondary-text">
                        {t("Write Provider name")}
                      </span>
                    )}
                  </PopoverTrigger>
                  <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                    <Command>
                      <CommandInput />
                      <MeterProviderList
                        onSelect={(provider: any) => {
                          field.onChange(`${provider?.id}`);
                          setMeterProvider(provider);
                          setShowProviderList(false);
                        }}
                      />
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <h2 className="mb-4 font-semibold">{t("Meter Number")}</h2>
        <FormField
          name="meter_number"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input placeholder={t("Enter meter number")} {...field} />
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

      <div className="flex items-center justify-between gap-4">
        <Button
          variant="outline"
          type="button"
          asChild
          className="flex w-[102px] gap-0.5 rounded-lg px-4 py-2 text-base font-medium leading-[22x]"
        >
          <Link href="/services">
            <ArrowLeft2 size="24" />
            {t("Back")}
          </Link>
        </Button>

        <Button
          type="button"
          onClick={onNext}
          className="flex w-[200px] gap-0.5 rounded-lg px-4 py-2 text-base font-medium leading-[22x]"
        >
          {t("Next")}
          <ArrowRight2 size="16" />
        </Button>
      </div>
    </div>
  );
}
