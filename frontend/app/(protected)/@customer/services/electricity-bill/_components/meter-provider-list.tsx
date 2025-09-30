"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import {
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import axios from "@/lib/axios";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import useSWR from "swr";
import MeterProviderItem from "./meter-provider-item";

export default function MeterProviderList({
  onSelect,
}: {
  onSelect: (meterProvider: any) => void;
}) {
  const { t } = useTranslation();

  const { data, isLoading, error } = useSWR(
    "/services/utility/billers",
    (url) => axios(url),
  );

  if (error) {
    toast.error(error.message);
  }

  return (
    <CommandList>
      <CommandGroup>
        <Case condition={isLoading}>
          <div className="w-full px-4 py-2.5">
            <Loader title={t("Loading...")} />
          </div>
        </Case>

        <Case condition={!isLoading && data?.data?.length !== 0}>
          {data?.data?.map((item: any) => (
            <CommandItem
              value={item.name}
              key={item.id}
              onSelect={() => onSelect(item)}
            >
              <MeterProviderItem providerName={item.name} logo="" />
            </CommandItem>
          ))}
        </Case>
      </CommandGroup>
    </CommandList>
  );
}
