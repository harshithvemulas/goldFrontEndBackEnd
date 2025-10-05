"use client";

import { Case } from "@/components/common/Case";
import { WalletCardSelection } from "@/components/common/WalletCardSelection";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallets } from "@/hooks/useWallets";
import { type IWallet } from "@/types/wallet";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import React, { forwardRef } from "react";
import { useTranslation } from "react-i18next";

interface IProps {
  value: string;
  onChange: (walletId: string) => void;
  id?: string;
}

export const SelectWallet = forwardRef<HTMLDivElement, IProps>(
  function SelectWallet({ value, onChange, id }, ref) {
    const { t } = useTranslation();
    const [isExpanded, setIsExpanded] = React.useState(false);
    const { wallets, isLoading } = useWallets();

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          <Skeleton className="h-[128px] w-full rounded-xl" />
          <Skeleton className="h-[128px] w-full rounded-xl" />
          <Skeleton className="h-[128px] w-full rounded-xl" />
        </div>
      );
    }

    function getExpandedArray<T>(
      array: T[],
      expand: boolean = false,
      initialLength: number | undefined = 3,
    ): T[] {
      if (expand) return array;
      return array.slice(0, initialLength);
    }

    return (
      <div ref={ref} id={id}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {getExpandedArray<IWallet>(wallets, isExpanded)?.map(
            (wallet: IWallet) => {
              return (
                wallet?.currency.code && (
                  <React.Fragment key={wallet.walletId}>
                    <WalletCardSelection
                      walletId={wallet?.currency.code}
                      logo={wallet.logo}
                      name={wallet?.currency.code}
                      balance={wallet.balance}
                      selectedWallet={value}
                      onSelect={onChange}
                      id={id}
                    />
                  </React.Fragment>
                )
              );
            },
          )}
        </div>

        <Case condition={wallets?.length > 3}>
          <div className="mt-2 flex justify-end">
            <Button
              type="button"
              variant="link"
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-secondary-text transition duration-300 ease-out hover:text-primary"
            >
              <span className="text-inherit">
                {isExpanded ? t("Show less") : t("Show more")}
              </span>
              {isExpanded ? <ArrowUp2 size={12} /> : <ArrowDown2 size={12} />}
            </Button>
          </div>
        </Case>
      </div>
    );
  },
);
