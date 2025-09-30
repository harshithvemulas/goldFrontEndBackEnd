"use client";

import { TWithdrawFormSchema } from "@/app/(protected)/@customer/withdraw/page";
import { CountrySelection } from "@/components/common/form/CountrySelection";
import { Loader } from "@/components/common/Loader";
import { PayMethodCard } from "@/components/common/PayMethodCard";
import { useSWR } from "@/hooks/useSWR";
import { Currency, imageURL } from "@/lib/utils";
import type { Country } from "@/types/country";
import { WithdrawMethod } from "@/types/withdraw-method";
import { Warning2 } from "iconsax-react";
import React, { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SelectedMethodPreview } from "./selected-method";

export function WithdrawMethods({
  form,
  selectMethod,
  method,
  setMethod,
}: {
  form: UseFormReturn<TWithdrawFormSchema>;
  selectMethod: React.Dispatch<
    React.SetStateAction<WithdrawMethod | undefined>
  >;
  method: string;
  setMethod: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [selectedCountry, setSelectedCountry] = useState<Country | undefined>();

  return (
    <>
      <CountrySelection
        defaultCountry={form.getValues("country")}
        onSelectChange={(country: Country) => {
          setSelectedCountry(country);
          form.setValue("country", country.code.cca2);
        }}
      />

      <SelectMethod
        selectedMethod={method}
        country={selectedCountry}
        form={form}
        setSelectedMethod={setMethod}
        onSelect={selectMethod}
      />
    </>
  );
}

function SelectMethod({
  selectedMethod,
  country,
  setSelectedMethod,
  form,
  onSelect,
}: any) {
  const [isSelectedMethodMode, setIsSelectedMethodMode] = useState(true);
  const [method, setMethod] = useState<WithdrawMethod>();
  const { t } = useTranslation();

  const { data: methods, isLoading } = useSWR(
    `/withdraws/methods/list?country=${country?.code?.cca2}&currency=${form.getValues("walletId")}`,
  );

  const currency = new Currency();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const activeMethods = methods?.data?.filter((m: WithdrawMethod) =>
    Boolean(m.active),
  );

  if (!activeMethods?.length) {
    return (
      <div className="flex items-center justify-center py-10">
        <div className="flex h-32 w-full flex-col items-center justify-center gap-4">
          <Warning2 size="38" variant="Bulk" className="text-primary-400" />
          <p>{t("No methods available for this country.")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 grid grid-cols-12 gap-4">
      {!isSelectedMethodMode ? (
        <SelectedMethodPreview
          method={{
            name: method?.name as string,
            logo: imageURL(method?.logoImage as string),
          }}
          onEdit={() => setIsSelectedMethodMode(true)}
        />
      ) : (
        activeMethods?.map((method: WithdrawMethod) => (
          // eslint-disable-next-line react/no-array-index-key
          <div key={method.id} className="col-span-6">
            <PayMethodCard
              name={method.name}
              logo={imageURL(method.logoImage as string)}
              type={method.value}
              isRecommended={Boolean(method.recommended)}
              fee={`${method.percentageCharge}% + ${currency.formatVC(method.fixedCharge, method.currencyCode)}`}
              defaultSelect={selectedMethod}
              onSelect={(m: string) => {
                setMethod(method);
                setSelectedMethod(m);
                setIsSelectedMethodMode(false);
                onSelect(method);
              }}
            />
          </div>
        ))
      )}
    </div>
  );
}
