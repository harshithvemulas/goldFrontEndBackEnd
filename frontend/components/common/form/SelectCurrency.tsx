"use client";

import { Case } from "@/components/common/Case";
import { Button } from "@/components/ui/button";
import { FormControl, FormItem } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { useWallets } from "@/hooks/useWallets";
import { imageURL } from "@/lib/utils";
import { type IWallet } from "@/types/wallet";
import { ArrowDown2, ArrowUp2 } from "iconsax-react";
import Image from "next/image";
import React, { forwardRef } from "react";

interface IProps {
  value: string;
  onChange: (walletId: string) => void;
}

export const SelectCurrency = forwardRef<IProps, any>(function SelectWallet(
  { value, onChange },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ref,
) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [defaultWallet, setDefaultWallet] = React.useState(false);
  const { wallets, isLoading } = useWallets();

  const watchWallets = React.useMemo(() => wallets, [wallets]);

  React.useEffect(() => {
    const wallet = watchWallets.find((w: IWallet) => w.defaultStatus);

    if (wallet && !defaultWallet) {
      onChange(wallet?.currency.code);
      setDefaultWallet(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchWallets]);

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
    <div>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
      >
        {getExpandedArray<IWallet>(wallets, isExpanded)?.map(
          (wallet: IWallet) => (
            <React.Fragment key={wallet.walletId}>
              <FormItem
                data-active={value === wallet?.currency.code}
                className="relative flex h-[52px] w-full max-w-[220px] items-center rounded-xl border-2 border-border bg-muted px-3 text-sm font-semibold leading-5 data-[active=true]:border-primary data-[active=true]:bg-primary-selected"
              >
                <div className="inline-flex items-center gap-2.5">
                  {wallet.logo && (
                    <Image
                      src={imageURL(wallet.logo)}
                      alt={wallet?.currency.code}
                      width={32}
                      height={32}
                    />
                  )}
                  <span> {wallet?.currency.code} </span>
                </div>
                <FormControl>
                  <RadioGroupItem
                    value={wallet?.currency.code}
                    className="absolute inset-0 left-0 top-0 z-10 h-full w-full opacity-0"
                  />
                </FormControl>
              </FormItem>
            </React.Fragment>
          ),
        )}
      </RadioGroup>

      <Case condition={wallets?.length > 3}>
        <div className="mt-2 flex justify-end">
          <Button
            type="button"
            variant="link"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1 px-3 py-1 text-sm font-semibold text-secondary-text transition duration-300 ease-out hover:text-primary"
          >
            <span className="text-inherit">
              {isExpanded ? "Show less" : "Show more"}
            </span>
            {isExpanded ? <ArrowUp2 size={12} /> : <ArrowDown2 size={12} />}
          </Button>
        </div>
      </Case>
    </div>
  );
});
