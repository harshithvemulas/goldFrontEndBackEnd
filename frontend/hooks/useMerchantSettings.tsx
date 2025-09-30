import axios from "@/lib/axios";
import useSWR from "swr";

export function useMerchantSettings() {
  const { data, error, isLoading } = useSWR("/merchants/detail", (u: string) =>
    axios.get(u),
  );

  return {
    error,
    data: data?.data,
    isLoading,
  };
}
