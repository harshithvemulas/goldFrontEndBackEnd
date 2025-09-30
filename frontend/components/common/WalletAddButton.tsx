"use client";

import { Case } from "@/components/common/Case";
import { Loader } from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import Separator from "@/components/ui/separator";
import { addWallet } from "@/data/wallets/addWallet";
import { useSWR } from "@/hooks/useSWR";
import { Currency, ICurrency } from "@/types/currency";
import type { IWallet } from "@/types/wallet";
import { Add, ArrowLeft, ClipboardText, Wallet2 } from "iconsax-react";
import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

export function WalletAddButton({ userWallets }: { userWallets: IWallet[] }) {
  const { t } = useTranslation();
  const { data, isLoading } = useSWR("/currencies");
  const { mutate } = useSWRConfig();

  const handleAddWallet = (currencyCode: string) => {
    toast.promise(addWallet({ currencyCode }), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        mutate("/currencies");
        mutate("/wallets");
        return res.message;
      },
      error: (error) => error.message,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const currencies = data?.data?.map((d: any) => new Currency(d));

  const availableCurrency = currencies?.filter(
    (c: ICurrency) =>
      userWallets.findIndex((w) => w.currency.id === c.id) === -1,
  );

  return (
    <Drawer direction="right">
      <DrawerTrigger asChild>
        <Button variant="outline" className="gap-1 font-normal">
          <Add />
          <span>{t("Add Wallet")}</span>
        </Button>
      </DrawerTrigger>

      <DrawerContent className="inset-x-auto inset-y-0 bottom-auto left-auto right-0 top-0 m-0 flex h-full w-[90%] flex-col overflow-x-hidden overflow-y-scroll rounded-t-none bg-background px-0 py-8 sm:w-[400px]">
        <div className="flex items-center gap-4 px-6">
          <DrawerClose asChild>
            <Button variant="outline" size="icon">
              <ArrowLeft />
            </Button>
          </DrawerClose>
          <DrawerHeader className="flex-1 p-0">
            <DrawerTitle className="text-left">
              {t("Create a New Wallet")}
            </DrawerTitle>
            <DrawerDescription className="sr-only absolute text-xs text-secondary-text">
              {t(
                "Quickly and securely set up your new digital wallet by following the steps.",
              )}
            </DrawerDescription>
          </DrawerHeader>
        </div>

        <div className="flex flex-col gap-1 px-3 py-6">
          <h6 className="mb-6 px-3 font-medium text-secondary-text">
            {t("Currency Already in Use")}
          </h6>
          {userWallets?.map((wallet: IWallet) => (
            <React.Fragment key={wallet.currency.id}>
              <div className="inline-flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent">
                <Wallet2 size={32} />
                <div className="flex-1">
                  <h6 className="text-foreground">{wallet.currency.name}</h6>
                  <span className="text-xs text-secondary-text">
                    {t("Currency")}: {wallet?.currency.code}
                  </span>
                </div>

                <Badge variant="success">{t("Added")}</Badge>
              </div>

              <Separator className="border-divider" />
            </React.Fragment>
          ))}
        </div>

        <Separator />

        <div className="flex flex-col gap-1 px-3 py-6">
          <h6 className="mb-6 px-3 font-medium text-secondary-text">
            {t("Available Currency")}
          </h6>
          <Case condition={availableCurrency?.length === 0}>
            <div className="ml-3 flex items-center gap-2 rounded-lg bg-accent py-4 pl-4 text-secondary-text">
              <ClipboardText />
              {t("No data...")}
            </div>
          </Case>

          <div>
            <Case condition={availableCurrency?.length > 0}>
              {availableCurrency?.map((currency: ICurrency) => (
                <React.Fragment key={currency.id}>
                  <div className="flex w-full items-center gap-2 rounded-lg px-3 py-2 hover:bg-accent">
                    <Wallet2 size={32} />
                    <div className="flex-1">
                      <h6 className="text-foreground">{currency.name}</h6>
                      <span className="text-xs text-secondary-text">
                        {t("Currency")}: {currency.code}
                      </span>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 hover:bg-background"
                      onClick={() => handleAddWallet(currency.code)}
                    >
                      <Add />
                      <span>{t("Add")}</span>
                    </Button>
                  </div>

                  <Separator className="border-divider" />
                </React.Fragment>
              ))}
            </Case>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
