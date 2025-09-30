"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import AgentIcon from "@/components/icons/AgentIcon";
import { Flag } from "@/components/icons/Flag";
import { Button } from "@/components/ui/button";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import Label from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Separator from "@/components/ui/separator";
import { useCountries } from "@/data/useCountries";
import { useSWR } from "@/hooks/useSWR";
import { Country } from "@/types/country";
import { Gateway } from "@/types/gateway";
import { ArrowLeft2, ArrowRight2, Edit2, TickCircle } from "iconsax-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { TDepositFormData } from "../page";
import { AgentList } from "./AgentList";

interface IProps {
  form: UseFormReturn<TDepositFormData>;
  changeCountry: () => void;
  onBack: () => void;
  onNext: () => void;
}

export function MethodSelection({
  form,
  changeCountry,
  onBack,
  onNext,
}: IProps) {
  const { t } = useTranslation();
  const { getCountryByCode } = useCountries();
  const countryCode = form.getValues("country");
  const [country, setCountry] = useState<Country | null>();
  const [showAgentSelectionMenu, setShowAgentSelectionMenu] = useState(false);

  // get deposit methods
  const { data: gateways, isLoading: isGatewayFetching } = useSWR(
    `/gateways?currency=${form.getValues("wallet")}&country=${countryCode}`,
  );

  // update country state
  useEffect(() => {
    if (countryCode) {
      getCountryByCode(countryCode, setCountry);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countryCode]);

  return (
    <div className="flex flex-col gap-y-4 pt-6 md:gap-y-8">
      <div className="flex flex-col gap-y-4 px-2 sm:px-0">
        <h2>{t("Select your preferred method")}</h2>

        {/* selected country status */}
        <div className="flex flex-wrap items-center gap-4">
          {country && (
            <div className="flex items-center gap-2">
              <Flag
                countryCode={country?.code?.cca2}
                className="h-5 w-8 rounded-sm"
              />
              <span>{country?.name}</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <TickCircle variant="Bold" size="16" className="text-primary" />
            <span>{t("Selected")}</span>
          </div>

          <Button
            variant="link"
            type="button"
            onClick={changeCountry}
            className="h-fit w-fit gap-1 px-0 py-0 text-sm font-semibold text-secondary-text sm:ml-auto"
          >
            <span>{t("Change country")}</span>
            <Edit2 size={16} />
          </Button>
        </div>

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RadioGroup
                  onValueChange={(value) => {
                    if (value === "agent") {
                      field.onChange("");
                      form.setValue("isAgent", true);
                      setShowAgentSelectionMenu(true);
                    } else {
                      field.onChange(value);
                      form.setValue("isAgent", false);
                      setShowAgentSelectionMenu(false);
                    }
                  }}
                  className={`grid ${isGatewayFetching ? "grid-cols-1" : "grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3"}`}
                >
                  <Case condition={isGatewayFetching}>
                    <div className="flex justify-center py-10">
                      <Loader />
                    </div>
                  </Case>
                  <Case condition={!isGatewayFetching}>
                    <Label
                      data-active={field.value === "" && showAgentSelectionMenu}
                      className="relative col-span-1 flex cursor-pointer items-center gap-2 rounded-xl border-[3px] border-transparent bg-muted p-4 text-sm font-bold transition-all duration-300 ease-linear hover:bg-background hover:shadow-light-8 data-[active=true]:border-primary data-[active=true]:bg-primary-selected"
                      htmlFor="agent"
                    >
                      <RadioGroupItem
                        value="agent"
                        id="agent"
                        className="absolute left-0 top-0 opacity-0"
                      />
                      <AgentIcon />
                      <span>{t("By Agent")}</span>
                    </Label>

                    {gateways?.data
                      ?.map((d: Record<string, unknown>) => new Gateway(d))
                      ?.map((gateway: Gateway) => (
                        <Label
                          data-active={field.value === gateway.value}
                          className="relative col-span-1 flex cursor-pointer items-center gap-2 rounded-xl border-[3px] border-transparent bg-muted p-4 text-sm font-bold transition-all duration-300 ease-linear hover:bg-background hover:shadow-light-8 data-[active=true]:border-primary data-[active=true]:bg-primary-selected"
                          htmlFor={`${gateway.value}-${gateway.id}`}
                          key={gateway.id}
                        >
                          <RadioGroupItem
                            id={`${gateway.value}-${gateway.id}`}
                            value={gateway.value}
                            className="absolute left-0 top-0 opacity-0"
                          />

                          {gateway.logoImage ? (
                            <Image
                              src={gateway.logoImage}
                              alt={gateway.name}
                              width={32}
                              height={32}
                              className="h-8 w-8 rounded-md bg-background object-contain"
                            />
                          ) : null}
                          <span>{gateway.name.replace(/\//g, " / ")}</span>
                        </Label>
                      ))}
                  </Case>
                </RadioGroup>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      <Separator className="mb-1 mt-[5px] bg-divider-secondary" />

      {/* payment method */}
      <Case condition={showAgentSelectionMenu}>
        <AgentList
          countryCode={countryCode as string}
          currencyCode={form.getValues("wallet")}
          form={form}
          onNext={onNext}
        />
      </Case>

      <Case
        condition={form.watch("method") !== "agent" && !showAgentSelectionMenu}
      >
        {/* next button */}
        <div className="mt-8 flex justify-end gap-4">
          <Button variant="outline" onClick={onBack} type="button">
            <ArrowLeft2 size={16} />
            <span>{t("Back")}</span>
          </Button>
          <Button type="submit" onClick={onNext} className="min-w-48">
            <span>{t("Next")}</span>
            <ArrowRight2 size={16} />
          </Button>
        </div>
      </Case>
    </div>
  );
}
