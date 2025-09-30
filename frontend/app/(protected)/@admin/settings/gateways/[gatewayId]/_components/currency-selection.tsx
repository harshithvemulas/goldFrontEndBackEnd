"use client";

import { Loader } from "@/components/common/Loader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useCurrencies } from "@/data/useCurrencies";
import { Currency } from "@/types/currency";
import { Add } from "iconsax-react";
import { useTranslation } from "react-i18next";

export function CurrencySelection() {
  const { currencies, isLoading } = useCurrencies();
  const { t } = useTranslation();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-1 rounded-lg">
          <Add />
          {t("Add currency")}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("Select currency")}</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput placeholder={t("Search currency by name")} />
          <CommandList>
            <CommandGroup>
              {isLoading && (
                <CommandItem>
                  <Loader />
                </CommandItem>
              )}
              {currencies?.map((currency: Currency) => (
                <CommandItem
                  key={currency.id}
                  className="flex w-full items-center gap-2.5"
                >
                  <Avatar className="font-bold">
                    <AvatarImage src={currency?.logo} />
                    <AvatarFallback className="bg-important text-important-foreground">
                      {currency.code}
                    </AvatarFallback>
                  </Avatar>
                  <span className="inline-block flex-1">{currency.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}
