"use client";

import { TDepositFormData } from "@/app/(protected)/@customer/deposit/page";
import { Case } from "@/components/common/Case";
import { SearchBox } from "@/components/common/form/SearchBox";
import { Loader } from "@/components/common/Loader";
import axios from "@/lib/axios";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import useSWR from "swr";
import { AgentItem } from "./AgentItem";

interface IAgentList {
  countryCode: string;
  currencyCode: string;
  form: UseFormReturn<TDepositFormData>;
  onNext: () => void;
}

export function AgentList({
  countryCode,
  currencyCode,
  form,
  onNext,
}: IAgentList) {
  const { t } = useTranslation();
  const { data, isLoading } = useSWR(
    `/agents/deposit?countryCode=${countryCode.toUpperCase()}&currencyCode=${currencyCode}`,
    (url) => axios.get(url),
  );

  return (
    <div className="mb-10 flex flex-col gap-4 px-2 md:mb-0">
      <div className="mb-4 flex flex-col flex-wrap gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="whitespace-nowrap text-2xl font-semibold text-foreground">
          {t("Select agent")}
        </h2>
        <SearchBox placeholder={t("Search agent")} iconPlacement="end" />
      </div>

      <div className="flex flex-col gap-y-4">
        <Case condition={isLoading}>
          <Loader />
        </Case>

        <Case condition={!isLoading && data?.data?.length === 0}>
          <p className="text-sm text-secondary-text">{t("Empty data")}</p>
        </Case>

        <Case condition={data?.data?.length > 0}>
          {data?.data?.map((agent: any) => (
            <AgentItem
              key={agent?.id}
              agent={agent}
              form={form}
              onNext={onNext}
            />
          ))}
        </Case>
      </div>
    </div>
  );
}
