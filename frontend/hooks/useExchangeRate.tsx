import axios from "@/lib/axios";
import useSWR from "swr";

export function useExchangeRate({
  from,
  to,
  amount,
}: {
  from: string;
  to: string;
  amount: string;
}) {
  const { data, isLoading } = useSWR(
    `/exchanges/calculations?currencyFrom=${from}&currencyTo=${to}&amountFrom=${amount}`,
    (url) => axios.get(url),
  );

  return {
    data: data?.data,
    isLoading,
  };
}
