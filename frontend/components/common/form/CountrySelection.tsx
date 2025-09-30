"use client";

import * as React from "react";

import { Loader } from "@/components/common/Loader";
import { Flag } from "@/components/icons/Flag";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useCountries } from "@/data/useCountries";
import cn from "@/lib/utils";
import type { Country } from "@/types/country";
import { ArrowDown2 } from "iconsax-react";
import { useTranslation } from "react-i18next";

interface IProps {
  allCountry?: boolean;
  defaultValue?: Country | null;
  onSelectChange: (country: Country) => void;
  disabled?: boolean;
  triggerClassName?: string;
  arrowClassName?: string;
  flagClassName?: string;
  defaultCountry?: string;
  display?: (country?: Country | null) => React.ReactNode;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  placeholderClassName?: string;
}

// export component
export function CountrySelection({
  allCountry = false,
  defaultValue,
  defaultCountry,
  onSelectChange,
  disabled = false,
  triggerClassName,
  arrowClassName,
  flagClassName,
  display,
  placeholderClassName,
  align = "start",
  side = "bottom",
}: IProps) {
  const { t } = useTranslation();
  const { countries, getCountryByCode, isLoading } = useCountries();

  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<Country | null | undefined>(
    defaultValue,
  );

  React.useEffect(() => {
    if (defaultValue) {
      setSelected(defaultValue);
    }
  }, [defaultValue]);

  React.useEffect(() => {
    (async () => {
      if (defaultCountry) {
        await getCountryByCode(defaultCountry, (country: Country | null) => {
          if (country) {
            setSelected(country);
            onSelectChange(country);
          }
        });
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultCountry]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        disabled={disabled}
        className={cn(
          "flex h-12 w-full items-center justify-between rounded-md border-none border-input bg-accent px-3 text-base",
          triggerClassName,
        )}
      >
        {selected ? (
          <div className="flex flex-1 items-center">
            <div className="flex flex-1 items-center gap-2 text-left">
              <Flag
                className={flagClassName}
                countryCode={
                  selected.code?.cca2 === "*" ? "UN" : selected.code?.cca2
                }
              />
              {display !== undefined ? (
                display(selected)
              ) : (
                <span>{selected.name}</span>
              )}
            </div>
          </div>
        ) : (
          <span className={cn("text-placeholder", placeholderClassName)}>
            {t("Select country")}
          </span>
        )}

        <ArrowDown2 className={cn("size-6", arrowClassName)} />
      </PopoverTrigger>
      <PopoverContent
        className="min-w-[var(--radix-popover-trigger-width)] p-0"
        align={align}
        side={side}
      >
        <Command>
          <CommandInput placeholder={t("Search...")} />
          <CommandList>
            <CommandGroup>
              {isLoading && <Loader />}

              {allCountry && (
                <CommandItem
                  value={t("All countries")}
                  onSelect={() => {
                    setSelected({
                      name: "All Countries",
                      code: {
                        cca2: "*",
                        cca3: "SGS",
                        ccn3: "239",
                      },
                      status: "officially-assigned",
                    });
                    onSelectChange({
                      name: "All Countries",
                      code: {
                        cca2: "*",
                        cca3: "SGS",
                        ccn3: "239",
                      },
                      status: "officially-assigned",
                    });
                    setOpen(false);
                  }}
                >
                  <Flag countryCode="UN" />
                  <span className="pl-1.5">{t("All countries")}</span>
                </CommandItem>
              )}

              {countries?.map((country: Country) =>
                country.status === "officially-assigned" ? (
                  <CommandItem
                    key={country.code.ccn3}
                    value={country.name}
                    onSelect={() => {
                      setSelected(country);
                      onSelectChange(country);
                      setOpen(false);
                    }}
                  >
                    <Flag countryCode={country.code.cca2} />
                    <span className="pl-1.5"> {country.name}</span>
                  </CommandItem>
                ) : null,
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
