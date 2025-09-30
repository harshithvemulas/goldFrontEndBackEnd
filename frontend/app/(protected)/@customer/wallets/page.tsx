"use client";

import { Loader } from "@/components/common/Loader";
import { WalletAddButton } from "@/components/common/WalletAddButton";
import { WalletCard } from "@/components/common/WalletCard";
import { useSWR } from "@/hooks/useSWR";
import { IWallet, Wallet } from "@/types/wallet";

export default function Wallets() {
  const { data, isLoading } = useSWR("/wallets");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader />
      </div>
    );
  }

  const wallets = data?.data?.map((d: any) => new Wallet(d));

  return (
    <div className="w-full bg-background p-4">
      <div className="flex flex-wrap gap-4">
        {wallets.map((wallet: IWallet) => (
          <WalletCard
            key={wallet.id}
            {...{
              id: wallet.id,
              title: wallet?.currency.code,
              balance: wallet.balance,
              currency: wallet?.currency.code,
              card: wallet.cards?.[0],
              isDefaultWallet: wallet.defaultStatus,
              isPinnedDashboard: wallet.pinDashboard,
            }}
          />
        ))}
      </div>
      <div className="py-4">
        <WalletAddButton userWallets={wallets} />
      </div>
    </div>
  );
}
