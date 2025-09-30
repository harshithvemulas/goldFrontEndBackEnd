"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { ReviewItem, ReviewItemList } from "@/components/common/ReviewItems";
import { Flag } from "@/components/icons/Flag";
import { Button } from "@/components/ui/button";
import Separator from "@/components/ui/separator";
import { useCountries } from "@/data/useCountries";
import { useSWR } from "@/hooks/useSWR";
import { Currency, imageURL } from "@/lib/utils";
import { Country } from "@/types/country";
import { ArrowLeft2, ArrowRight2, Edit2, TickCircle } from "iconsax-react";
import { CountryCode } from "libphonenumber-js";
import Image from "next/image";
import React from "react";
import { useTranslation } from "react-i18next";
import { TDepositFormData } from "../page";

interface IProps {
  onBack: () => void;
  onNext: () => void;
  isLoading: boolean;
  formData: TDepositFormData;
}

export function Review({ onBack, onNext, isLoading, formData }: IProps) {
  const { t } = useTranslation();
  const { getCountryByCode } = useCountries();
  const [country, setCountry] = React.useState<Country | null>();

  // fetch agents
  const { data: agents } = useSWR(
    formData.isAgent
      ? `/agents/deposit?countryCode=${formData.country}&currencyCode=${formData.wallet}`
      : "",
  );

  // fetch deposit preview data
  const { data: calculation } = useSWR(
    `/deposits/preview/create?amount=${formData.amount}`,
  );
  // fetch gateways data.
  const { data: gateways } = useSWR(
    !formData?.isAgent && formData.method
      ? `/gateways?currency=${formData.wallet}&country=${formData.country}`
      : "",
  ); // fetch gateways

  // fetch country data using country code.
  React.useEffect(() => {
    getCountryByCode(formData.country as CountryCode, setCountry);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.country]);

  // find agent
  const findAgentByAgentId = (agents: any, agentId: string, method: string) => {
    if (!agentId) return null;
    const agent = agents.find((agent: any) => agent.agentId === agentId);
    const agentObj = {
      ...agent,
      method: agent.agentMethods.find(
        (m: Record<string, any>) => m.name === method,
      ),
    };

    return agentObj;
  };

  // find gateway
  const findGateway = (gateways: any, gateway: string) => {
    if (!gateway) return null;
    const g = gateways?.find(
      (d: Record<string, unknown>) => d.value === gateway,
    );
    return g;
  };

  // find agent
  const agent = findAgentByAgentId(
    agents?.data as [],
    formData?.agent as string,
    formData?.method as string,
  );

  const gateway = findGateway(gateways?.data, formData?.method as string);
  const currency = new Currency(formData?.wallet);

  return (
    <div className="flex flex-col gap-y-4 md:gap-y-8">
      <div className="flex flex-col gap-y-4">
        <h2>{t("Select your preferred method")}</h2>

        {/* selected country status */}
        <div className="flex flex-wrap items-center gap-4 py-2">
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
            onClick={onBack}
            className="h-fit w-fit gap-1 px-0 py-0 text-sm font-semibold text-secondary-text sm:ml-auto"
          >
            <span>{t("Change country")}</span>
            <Edit2 size={16} />
          </Button>
        </div>

        {/* selected method */}
        <div className="flex flex-wrap items-center gap-2">
          <Case condition={formData.isAgent}>
            <div className="flex w-full items-center gap-2 rounded-xl border border-secondary-200 px-4 py-3 sm:w-auto">
              <Case condition={agent?.method?.logo}>
                <Image
                  src={imageURL(agent?.method?.logo)}
                  alt={agent?.method?.name}
                  width={64}
                  height={64}
                  className="h-8 w-8"
                />
              </Case>
              <p className="text-sm">{agent?.method?.name}</p>
            </div>
          </Case>

          <Case condition={!formData.isAgent && !!formData.method}>
            <div className="flex w-full items-center gap-2 rounded-xl border border-secondary-200 px-4 py-3 sm:w-auto">
              {gateway?.logoImage ? (
                <Image
                  src={imageURL(gateway?.logoImage)}
                  alt={gateway?.name}
                  width={64}
                  height={64}
                  className="h-8 w-8"
                />
              ) : null}
              <p className="text-sm">{gateway?.name}</p>
            </div>
          </Case>
          <div className="flex items-center gap-2 pl-4">
            <TickCircle className="text-primary" variant="Bold" size="20" />
            <p className="text-sm">{t("Selected")}</p>
          </div>

          <button
            type="button"
            onClick={onBack}
            className="ml-auto flex items-center gap-1 px-3 py-1 text-sm font-semibold text-secondary-text transition duration-300 ease-out hover:text-primary"
          >
            <span>{t("Change")}</span>
            <Edit2 size={12} />
          </button>
        </div>
      </div>

      <Separator className="mb-1 mt-[5px] bg-divider-secondary" />

      {/* Deposit details */}
      <ReviewItemList groupName={t("Deposit details")}>
        <ReviewItem
          title={t("Amount")}
          value={`${currency.formatVC(Number(calculation?.data?.amount ?? 0))}`}
        />
        <ReviewItem
          title={t("Service charge")}
          value={`${currency.formatVC(calculation?.data?.fee ?? 0)}`}
        />
        <ReviewItem
          title={t("You get")}
          value={`${currency.formatVC(calculation?.data?.totalAmount ?? 0)}`}
        />
      </ReviewItemList>

      <Separator className="mb-1 mt-[5px] bg-divider-secondary" />

      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={onBack} type="button">
          <ArrowLeft2 size={16} />
          <span>{t("Back")}</span>
        </Button>
        <Button
          type="button"
          disabled={isLoading}
          onClick={onNext}
          className="min-w-48"
        >
          <Case condition={isLoading}>
            <Loader
              title={t("Processing...")}
              className="text-primary-foreground"
            />
          </Case>
          <Case condition={!isLoading}>
            <span>{t("Next")}</span>
            <ArrowRight2 size={16} />
          </Case>
        </Button>
      </div>
    </div>
  );
}
