"use client";

import { Case } from "@/components/common/Case";
import { MerchantAccountSelection } from "@/components/common/form/MerchantAccountSelection";
import { SelectWallet } from "@/components/common/form/SelectWallet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { getAvatarFallback } from "@/utils/getAvatarFallback";
import { ArrowRight2, Edit2, TickCircle } from "iconsax-react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type TPaymentRequestFormData } from "../page";

interface IPaymentDetails {
  form: UseFormReturn<TPaymentRequestFormData>;
  onNext: () => void;
  merchant: any;
  selectedMerchant: (value: any) => void;
  merchantIdInputMode: boolean;
  setMerchantIdInputMode: (value: boolean) => void;
}

export default function PaymentDetails({
  form,
  onNext,
  merchant,
  selectedMerchant,
  merchantIdInputMode,
  setMerchantIdInputMode,
}: IPaymentDetails) {
  const { t } = useTranslation();

  return (
    <>
      <h2 className="mb-4">{t("Add Merchant")}</h2>

      {/* Merchant id input field */}
      <Case condition={merchantIdInputMode}>
        <FormField
          control={form.control}
          name="receiver_merchant_id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MerchantAccountSelection
                  selected={field.value}
                  onSelect={(value, merchant) => {
                    field.onChange(value);
                    if (merchant) {
                      setMerchantIdInputMode(false);
                      selectedMerchant(merchant);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Case>

      {/* Show selected merchant Id  */}
      <Case condition={!merchantIdInputMode}>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5">
            <Avatar>
              <AvatarImage
                src={merchant?.profileImage}
                className="border-2 border-border"
              />
              <AvatarFallback className="border-2 border-border">
                {getAvatarFallback(merchant?.name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p>{merchant?.name}</p>
              <p className="text-sm text-gray">{merchant?.email}</p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-2 text-sm">
            <TickCircle variant="Bold" size={17} className="text-primary" />
            {t("Selected")}
          </div>

          <Button
            variant="link"
            size="sm"
            className="gap-1.5 justify-self-end text-sm text-foreground hover:text-primary"
            type="button"
            onClick={() => setMerchantIdInputMode(true)}
          >
            {t("Change")}
            <Edit2 size={15} />
          </Button>
        </div>
      </Case>

      {/* Select wallet */}
      <div className="my-8">
        <h2 className="mb-4">{t("Select wallet")}</h2>
        <FormField
          name="sender_wallet_id"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-12 sm:col-span-6 lg:col-span-4">
              <FormControl>
                <SelectWallet {...field} />
              </FormControl>
              <FormMessage className="col-span-12" />
            </FormItem>
          )}
        />
      </div>

      <div className="mb-10">
        <h2 className="mb-4">{t("How much?")}</h2>
        <FormField
          control={form.control}
          name="amount"
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

      <div className="flex w-full justify-end">
        <Button type="submit" className="w-52" onClick={onNext}>
          {t("Next")}
          <ArrowRight2 size={17} />
        </Button>
      </div>
    </>
  );
}
