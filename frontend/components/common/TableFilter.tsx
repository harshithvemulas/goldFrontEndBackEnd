"use client";

import * as React from "react";

import { Case } from "@/components/common/Case";
import { CountrySelection } from "@/components/common/form/CountrySelection";
import { DatePicker } from "@/components/common/form/DatePicker";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import Label from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSWR } from "@/hooks/useSWR";
import { Gateway } from "@/types/gateway";
import { Method } from "@/types/method";
import { format, parse } from "date-fns";
import { FilterSearch } from "iconsax-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

type Props = {
  canFilterByStatus?: boolean;
  canFilterByDate?: boolean;
  canFilterByMethod?: boolean;
  canFilterByGateway?: boolean;
  canFilterByAgent?: boolean;
  canFilterByAgentMethod?: boolean;
  canFilterUser?: boolean;
  canFilterByGender?: boolean;
  canFilterByCountryCode?: boolean;
};

export function TableFilter({
  canFilterByStatus = true,
  canFilterByDate = true,
  canFilterByMethod = false,
  canFilterByGateway = false,
  canFilterByAgent = false,
  canFilterByAgentMethod = false,
  canFilterUser = false,
  canFilterByGender = false,
  canFilterByCountryCode = false,
}: Props) {
  // translation hook
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  // state
  const [filter, setFilter] = React.useState<Record<string, string>>({});
  const [open, setOpen] = React.useState(false);

  // fetch all methods
  const { data: methods, isLoading: isMethodLoading } = useSWR("/methods");
  const { data: gateways, isLoading: isGatewayLoading } = useSWR("/gateways");
  const { data: agentMethods, isLoading: isAgentMethodLoading } = useSWR(
    canFilterByAgentMethod ? "/agent-methods?limit=100&page=1" : "",
  );

  // handle filter
  const onFilter = (key: string, value: string) => {
    const sp = new URLSearchParams(searchParams.toString());
    if (value) {
      sp.set(key, value);
      setFilter((p) => ({ ...p, [key]: value }));
    } else {
      sp.delete(key);
      setFilter((p) => ({ ...p, [key]: "" }));
    }

    router.replace(`${pathname}?${sp.toString()}`);
  };

  React.useEffect(() => {
    const sp = Object.fromEntries(searchParams.entries());
    if (sp) {
      setFilter(sp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const clearFilter = () => {
    const sp = new URLSearchParams();
    const keys = Object.keys(filter);

    keys.forEach((key) => sp.delete(key));
    setFilter({});
    router.replace(`${pathname}?${sp.toString()}`);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <FilterSearch size={20} />
          {t("Filter")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[300px] max-w-[400px]">
        <div className="flex flex-col space-y-4">
          {/* Status */}
          <Case condition={canFilterByStatus}>
            <div className="flex w-full flex-col space-y-2">
              <Label className="text-sm font-normal text-secondary-text">
                {canFilterUser ? "Status" : "Transaction status"}
              </Label>
              <Select
                value={filter?.status}
                onValueChange={(value) => onFilter("status", value)}
              >
                <SelectTrigger className="h-10 w-full text-base data-[placeholder]:text-secondary-text">
                  <SelectValue placeholder={t("Status")} />
                </SelectTrigger>

                <SelectContent>
                  <Case condition={canFilterUser}>
                    <SelectItem value="true">{t("Active")}</SelectItem>
                    <SelectItem value="false">{t("Inactive")}</SelectItem>
                  </Case>
                  <Case condition={!canFilterUser}>
                    <SelectItem value="pending"> {t("Pending")} </SelectItem>
                    <SelectItem value="completed">{t("Completed")} </SelectItem>
                    <SelectItem value="failed">{t("Failed")} </SelectItem>
                  </Case>
                </SelectContent>
              </Select>
            </div>
          </Case>

          <Case condition={canFilterByGender}>
            <div className="flex w-full flex-col space-y-2">
              <Label className="text-sm font-normal text-secondary-text">
                {t("Gender")}
              </Label>
              <Select
                value={filter?.gender}
                onValueChange={(value) => onFilter("gender", value)}
              >
                <SelectTrigger className="h-10 w-full text-base data-[placeholder]:text-secondary-text">
                  <SelectValue placeholder={t("Gender")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="male">{t("Male")}</SelectItem>
                  <SelectItem value="female">{t("Female")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Case>

          {/* Withdraw methods */}
          <Case condition={canFilterByMethod}>
            <div className="flex w-full flex-col space-y-2">
              <Label className="text-sm font-normal text-secondary-text">
                {t("Withdraw method")}
              </Label>
              <Select
                value={filter?.method}
                onValueChange={(value) => onFilter("method", value)}
              >
                <SelectTrigger className="h-10 w-full text-base data-[placeholder]:text-secondary-text">
                  <SelectValue placeholder={t("Withdraw method")} />
                </SelectTrigger>

                <SelectContent side="right" align="start">
                  <Case condition={canFilterByAgent}>
                    <SelectItem value="agent">{t("Agent")}</SelectItem>
                  </Case>
                  {isMethodLoading ? (
                    <Loader />
                  ) : (
                    methods?.data
                      ?.map((m: any) => new Method(m))
                      ?.map((m: Method) => (
                        <SelectItem
                          key={m.id}
                          value={m.value}
                          className="border-b border-dashed"
                        >
                          {m.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </Case>

          {/* Deposit gateway */}
          <Case condition={canFilterByGateway}>
            <div className="flex w-full flex-col space-y-2">
              <Label className="text-sm font-normal text-secondary-text">
                {t("Deposit gateway")}
              </Label>
              <Select
                value={filter?.gateway}
                onValueChange={(value) => onFilter("method", value)}
              >
                <SelectTrigger className="h-10 w-full text-base data-[placeholder]:text-secondary-text">
                  <SelectValue placeholder={t("Deposit gateway")} />
                </SelectTrigger>

                <SelectContent side="right" align="start">
                  <Case condition={canFilterByAgent}>
                    <SelectItem value="agent">{t("Agent")}</SelectItem>
                  </Case>
                  {isGatewayLoading ? (
                    <Loader />
                  ) : (
                    gateways?.data
                      ?.map((m: any) => new Gateway(m))
                      ?.map((m: Gateway) => (
                        <SelectItem
                          key={m.id}
                          value={m.value}
                          className="border-b border-dashed"
                        >
                          {m.name}{" "}
                          <span className="pl-1.5 text-secondary-text/80">
                            {m.value}
                          </span>
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </Case>

          {/* agent methods */}
          <Case condition={canFilterByAgentMethod}>
            <div className="flex w-full flex-col space-y-2">
              <Label className="text-sm font-normal text-secondary-text">
                {t("Agent method")}
              </Label>
              <Select
                value={filter?.method}
                onValueChange={(value) => onFilter("method", value)}
              >
                <SelectTrigger className="h-10 w-full text-base data-[placeholder]:text-secondary-text">
                  <SelectValue placeholder={t("Method")} />
                </SelectTrigger>

                <SelectContent side="right" align="start">
                  {isAgentMethodLoading ? (
                    <Loader />
                  ) : (
                    agentMethods?.data?.data
                      ?.map((m: any) => new Method(m))
                      ?.map((m: Method) => (
                        <SelectItem
                          key={m.id}
                          value={m.name}
                          className="border-b border-dashed"
                        >
                          {m.name}
                        </SelectItem>
                      ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </Case>

          {/* Date */}
          <Case condition={canFilterByDate}>
            <div className="flex w-full flex-col space-y-2">
              <Label className="text-sm font-normal text-secondary-text">
                {t("Date")}
              </Label>

              <DatePicker
                value={
                  Object.prototype.hasOwnProperty.call(filter, "date") &&
                  filter.date
                    ? new Date(parse(filter.date, "yyyy-MM-dd", new Date()))
                    : undefined
                }
                onChange={(date) => {
                  onFilter("date", date ? format(date, "yyyy-MM-dd") : "");
                }}
                className="h-10"
                placeholderClassName="text-secondary-text"
              />
            </div>
          </Case>

          {/* Filter by country */}
          <Case condition={canFilterByCountryCode}>
            <div className="flex w-full flex-col space-y-2">
              <Label className="text-sm font-normal text-secondary-text">
                {t("Country")}
              </Label>

              <CountrySelection
                defaultCountry={filter?.countryCode}
                onSelectChange={(country) => {
                  onFilter("countryCode", country.code.cca2);
                }}
                triggerClassName="h-10"
                placeholderClassName="text-secondary-text"
                side="right"
                align="start"
              />
            </div>
          </Case>

          <div className="flex flex-col items-stretch space-y-2">
            <Button
              type="button"
              onClick={() => setOpen(false)}
              className="h-10"
            >
              {t("Done")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={clearFilter}
              className="h-10"
            >
              {t("Clear Filter")}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
