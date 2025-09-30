"use client";

import axios from "@/lib/axios";
import useSWRHook, { type SWRConfiguration } from "swr";

export const useSWR = (url: string, options?: SWRConfiguration) => {
  const response = useSWRHook(url || null, (u: string) => axios.get(u), {
    shouldRetryOnError: false,
    revalidateOnFocus: false,
    ...options,
  });
  return response;
};
