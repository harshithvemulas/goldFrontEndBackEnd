import React from "react";

import { TWithdrawFormSchema } from "@/app/(protected)/@customer/withdraw/page";
import { AgentCard } from "@/components/common/AgentCard";
import { Case } from "@/components/common/Case";
import { CountrySelection } from "@/components/common/form/CountrySelection";
import { Loader } from "@/components/common/Loader";
import { Flag } from "@/components/icons/Flag";
import { Button } from "@/components/ui/button";
import { useSWR } from "@/hooks/useSWR";
import { Country } from "@/types/country";
import { WithdrawAgentMethod } from "@/types/withdraw-method";
import {
  ArrowLeft2,
  ArrowRight2,
  Edit2,
  SearchNormal1,
  TickCircle,
  Warning2,
} from "iconsax-react";
import { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";

export function WithdrawByAgent({
  form,
  setAgent,
  onBack,
  onNext,
}: {
  form: UseFormReturn<TWithdrawFormSchema>;
  setAgent: (agent: any) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const [country, setCountry] = React.useState<Country>();
  const [isEditMode, setIsEditMode] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const { t } = useTranslation();

  const formData = form.getValues();
  // fetch available agent
  const { data: agents, isLoading } = useSWR(
    `/agents/deposit?countryCode=${country?.code?.cca2}&currencyCode=${formData.walletId}&search=${search}`,
  );

  return (
    <>
      <div>
        <h2 className="mb-5">{t("Select a country first")}</h2>
        <Case condition={isEditMode}>
          <CountrySelection
            defaultCountry={form.getValues("country")}
            onSelectChange={(country) => {
              form.setValue("country", country.code.cca2);
              setCountry(country);
            }}
          />
        </Case>
        <Case condition={!isEditMode}>
          <div>
            <div className="flex items-center justify-between gap-4">
              <div className="inline-flex gap-2">
                <Flag url={country?.flags?.png} className="h-5 w-7" />

                <span>{country?.name}</span>
                <div className="flex items-center gap-2.5 pl-2.5">
                  <TickCircle
                    size="16"
                    className="text-primary"
                    variant="Bold"
                  />
                  {t("Selected")}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 font-medium"
                onClick={() => setIsEditMode(true)}
              >
                {t("Change country")}
                <Edit2 size={16} />
              </Button>
            </div>
          </div>
        </Case>
      </div>

      <Case condition={isLoading}>
        <Loader className="mt-8 flex justify-center py-10" />
      </Case>

      <Case condition={!!country}>
        <div className="mt-8 flex w-full flex-col justify-between gap-4 md:flex-row md:items-center">
          <h2>{t("Select agent")}</h2>
          <div className="flex w-full max-w-[200px] items-center rounded-[4px] border">
            <input
              type="text"
              placeholder={t("Search agent...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-10 w-full flex-1 rounded-[4px] px-2.5 text-sm focus:outline-none"
            />
            <div className="rounded-r-[4px] px-2.5">
              <SearchNormal1 size="20" variant="Outline" />
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-12 gap-y-4 sm:gap-4">
          <Case condition={agents?.data?.length === 0}>
            <div className="col-span-12 h-32 text-sm font-semibold text-secondary-text">
              <div className="flex h-32 w-full flex-col items-center justify-center gap-4">
                <Warning2
                  size="38"
                  variant="Bulk"
                  className="text-primary-400"
                />
                <p>{t("No agent available for this country.")}</p>
              </div>
            </div>
          </Case>

          <Case condition={!!agents?.data?.length}>
            {agents?.data?.map((agent: any) => (
              <div key={agent.id} className="col-span-12 md:col-span-6">
                <AgentCard
                  form={form}
                  name={agent.name}
                  avatar=""
                  agentId={agent.agentId}
                  commission={agent.withdrawalCommission}
                  processingTime=""
                  phoneNumber={agent?.user?.customer?.phone}
                  paymentMethods={agent.agentMethods}
                  onSelect={(method: string) => {
                    form.setValue("method", method);
                    setAgent({
                      ...agent,
                      method: agent?.agentMethods?.find(
                        (m: WithdrawAgentMethod) => m.name === method,
                      ),
                    });
                  }}
                />
              </div>
            ))}
          </Case>
        </div>
      </Case>

      <div className="mt-8 flex items-center justify-between gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft2 />
          {t("Back")}
        </Button>

        <Button type="button" onClick={onNext}>
          {t("Next")}
          <ArrowRight2 />
        </Button>
      </div>
    </>
  );
}
