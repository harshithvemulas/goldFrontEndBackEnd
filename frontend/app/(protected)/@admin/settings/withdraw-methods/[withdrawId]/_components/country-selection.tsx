"use client";

import { Loader } from "@/components/common/Loader";
import { Flag } from "@/components/icons/Flag";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCountries } from "@/data/useCountries";
import { Country } from "@/types/country";
import { Add } from "iconsax-react";
import { useTranslation } from "react-i18next";

export function CountrySelection() {
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1 rounded-lg">
          <Add />
          {t("Add country")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader className="hidden">
          <DialogTitle>{t("Select country")}</DialogTitle>
          <DialogDescription>{t("Select active country")}</DialogDescription>
        </DialogHeader>

        <Command>
          <CommandInput
            placeholder={t("Search country by name")}
            className="placeholder:text-secondary-text"
          />
          <CommandList>
            <CommandGroup>
              <CountryList />
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

function CountryList() {
  const { countries, isLoading } = useCountries();

  if (isLoading) {
    return (
      <CommandItem>
        <Loader />
      </CommandItem>
    );
  }

  return countries
    .filter((c: Country) => c.status === "officially-assigned")
    .map((country: Country) => (
      <CommandItem
        key={country.code.ccn3}
        className="flex w-full items-center gap-2.5"
      >
        <Flag countryCode={country.code.cca2} />
        <span className="inline-block flex-1">{country.name}</span>
      </CommandItem>
    ));
}
