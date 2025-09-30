"use client";

import { Flag } from "@/components/icons/Flag";
import Separator from "@/components/ui/separator";
import { useCountries } from "@/data/useCountries";
import { Country } from "@/types/country";
import { useTranslation } from "react-i18next";

export function AllowCountryList() {
  const { countries, isLoading } = useCountries();
  const { t } = useTranslation();
  return (
    <>
      <h6 className="font-medium text-secondary-text">
        {t("Allowed countries")}
      </h6>
      <div className="grid grid-cols-2 gap-2 p-0.5 py-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7">
        {isLoading &&
          [...Array(8)].map((_, index: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <Separator className="h-10 rounded-lg" key={index} />
          ))}

        {countries
          .filter((c: Country) => c.status === "officially-assigned")
          .map((country: Country) => (
            <div
              key={country.code.cca2}
              className="box-border flex items-center gap-2.5 overflow-hidden rounded-lg border bg-accent px-1.5 py-1"
            >
              <Flag countryCode={country.code.cca2} className="w-8" />
              <div className="line-clamp-1 block flex-1 overflow-ellipsis whitespace-nowrap font-medium">
                {country.name}
              </div>
            </div>
          ))}
      </div>
    </>
  );
}
