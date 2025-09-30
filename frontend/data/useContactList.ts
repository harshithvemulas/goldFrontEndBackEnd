"use client";

import useSWR from "swr";
import axios from "@/lib/axios";

export function useContactList(url?: string) {
  const { data, isLoading, error, mutate, ...otherResponse } = useSWR(
    url || "/contacts",
    (url) => axios.get(url),
  );

  return {
    contacts: data?.data ?? [],
    isLoading,
    error,
    mutate: () => mutate(data),
    ...otherResponse,
  };
}
