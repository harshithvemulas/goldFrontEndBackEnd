"use client";

import useSWR from "swr";
import axios from "@/lib/axios";

export function useSavedWalletList() {
  const { data, isLoading, error, ...otherResponse } = useSWR(
    "/wallets/saved",
    (url) => axios.get(url),
  );

  return {
    wallets: data?.data ?? [],
    isLoading,
    error,
    ...otherResponse,
  };
}
