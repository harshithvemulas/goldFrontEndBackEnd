import axios from "@/lib/axios";
import useSWR from "swr";

export function useKeySettings() {
  const { data, isLoading, error, mutate } = useSWR(
    "/kycs/detail",
    (url) => axios.get(url),
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  return {
    data: data?.data,
    isLoading,
    error,
    refresh: mutate,
  };
}
