"use client";

import { Case } from "@/components/common/Case";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { generateCard } from "@/data/cards/generateCard";
import { pinWalletDashboard } from "@/data/wallets/pinWalletDashboard";
import { setDefaultWallet } from "@/data/wallets/setDefaultWallet";
import { useGlobalSettings } from "@/hooks/useGlobalSettings";
import { ICard } from "@/types/card";
import {
  Card as CardIcon,
  Heart,
  HeartSlash,
  More,
  Settings,
} from "iconsax-react";
import { Pin } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { useSWRConfig } from "swr";

interface IProps {
  id: number;
  title: string;
  balance: string;
  currency: string;
  card: ICard | undefined;
  isDefaultWallet?: boolean;
  isPinnedDashboard?: boolean;
}

export function WalletCard({
  id,
  title,
  balance,
  currency,
  card,
  isDefaultWallet = false,
  isPinnedDashboard = false,
}: IProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const { mutate } = useSWRConfig();
  const { settings } = useGlobalSettings();

  // handle request to make default wallet
  const handleDefaultWallet = () => {
    toast.promise(setDefaultWallet({ walletId: id }), {
      loading: t("Processing..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        mutate("/wallets");
        return res.message;
      },
      error: (error) => error.message,
    });
  };

  // pin to dashboard
  const pinToDashboard = (pinDashboard: boolean) => {
    toast.promise(
      pinWalletDashboard({ pinDashboard, walletId: id?.toString() }),
      {
        loading: t("Processing..."),
        success: (res) => {
          if (!res.status) throw new Error(res.message);
          mutate("/wallets");
          return res.message;
        },
        error: (error) => error.message,
      },
    );
  };

  const handleIssueCard = () => {
    toast.promise(generateCard(id), {
      loading: t("Loading..."),
      success: (res) => {
        if (!res.status) throw new Error(res.message);
        mutate("/wallets");
        return res.message;
      },
      error: (err) => err.message,
    });
  };

  return (
    currency && (
      <Card className="w-[350px] overflow-hidden rounded-2xl border-primary bg-gradient-to-b from-[#48E1D8] to-primary">
        <CardContent className="relative overflow-hidden px-6 py-4">
          <div className="absolute right-2.5 top-2.5 flex justify-end gap-1">
            <Case condition={isPinnedDashboard}>
              <Badge>
                <Pin size={14} className="mr-1 rotate-45" />
                {t("Dashboard")}
              </Badge>
            </Case>
            <Case condition={isDefaultWallet}>
              <Badge>{t("Default")}</Badge>
            </Case>
          </div>

          <h2 className="text-shadow pointer-events-none absolute bottom-3 right-0 text-[104px] font-bold text-primary opacity-30">
            {currency}
          </h2>

          <div className="relative z-20 mb-4 flex items-center gap-2.5">
            <h6 className="font-bold text-primary-foreground">{title}</h6>
          </div>

          <div className="relative z-20 text-primary-foreground">
            <span className="text-xs font-normal">{t("Balance")}</span>
            <h1 className="flex items-center gap-1 align-baseline text-[32px] font-semibold leading-10">
              {Number(balance).toFixed(2)}
              <span className="text-sm font-normal leading-5">{currency}</span>
            </h1>
          </div>
        </CardContent>
        <CardFooter className="justify-end bg-primary px-6 py-2 text-primary-foreground">
          {card?.lastFour && settings?.virtual_card?.status === "on" ? (
            <div className="flex-1 text-sm font-normal leading-5">
              **** **** **** {card?.lastFour}
            </div>
          ) : null}

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              className={buttonVariants({
                variant: "default",
                size: "sm",
                className: "text-sm font-semibold leading-5",
              })}
            >
              <More size="20" />
              <span>{t("Menu")}</span>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="start">
              <Command>
                <CommandList>
                  <CommandGroup>
                    <CommandItem
                      className="mb-1"
                      onSelect={() => {
                        pinToDashboard(!isPinnedDashboard);
                        setOpen(false);
                      }}
                    >
                      {isPinnedDashboard ? (
                        <HeartSlash size="20" />
                      ) : (
                        <Heart size={20} />
                      )}
                      <span className="ml-1">
                        {isPinnedDashboard ? t("Unpin") : t("Pin")}{" "}
                        {t("from dashboard")}
                      </span>
                    </CommandItem>

                    <CommandItem
                      onSelect={() => {
                        handleDefaultWallet();
                        setOpen(false);
                      }}
                    >
                      <Settings size="20" />
                      <span className="ml-1">{t("Set as default")}</span>
                    </CommandItem>
                    {!card?.id && settings?.virtual_card?.status === "on" ? (
                      <CommandItem
                        disabled={
                          currency?.toUpperCase() !== "USD" &&
                          currency?.toUpperCase() !== "NGN"
                        }
                        onSelect={handleIssueCard}
                      >
                        <CardIcon size="20" />
                        <span className="ml-1">{t("Issue card")}</span>
                      </CommandItem>
                    ) : null}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </CardFooter>
      </Card>
    )
  );
}
