import axios from "@/lib/axios";
import useSWR from "swr";

export function useTransactionDetails({ trxId }: { trxId: string }) {
  const { data, isLoading } = useSWR(
    `/mapi-global/${trxId}`,
    (url) => axios.get(url).then((res) => res.data),
    {
      refreshInterval: 0,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      shouldRetryOnError: false,
    },
  );

  return {
    data,
    isLoading,
  };
}
