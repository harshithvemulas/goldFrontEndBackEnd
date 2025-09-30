"use client";

import { Currency } from "@/types/currency";
import axios from "@/lib/axios";
import useSWR from "swr";

export function useCurrencies() {
  const { data, isLoading, error, mutate } = useSWR("/currencies", (url) =>
    axios.get(url),
  );

  const apiData = data?.data;
  const currencies = apiData ? apiData.map((d: any) => new Currency(d)) : [];

  return {
    currencies,
    isLoading,
    error,
    mutate,
  };
}
