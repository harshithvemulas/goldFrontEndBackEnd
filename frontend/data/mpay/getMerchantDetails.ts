import axios from "@/lib/axios";
import useSWR from "swr";

export function useMerchantDetails({ merchantId }: { merchantId: string }) {
  const { data, isLoading } = useSWR(
    `/mapi-global/merchant/${merchantId}`,
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
