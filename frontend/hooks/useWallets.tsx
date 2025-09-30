import axios from "@/lib/axios";
import { type IWallet, Wallet } from "@/types/wallet";
import useSWR from "swr";

export function useWallets() {
  const { data, isLoading, mutate } = useSWR("/wallets", (url: string) =>
    axios.get(url),
  );

  const wallets = data?.data?.map((d: IWallet) => new Wallet(d)) ?? [];

  const getWalletByCurrencyCode = (
    wallets: IWallet[],
    code: string,
  ): IWallet | undefined => {
    return wallets?.find((w: IWallet) => w?.currency?.code === code);
  };

  return {
    wallets,
    isLoading,
    getWalletByCurrencyCode,
    mutate,
  };
}
