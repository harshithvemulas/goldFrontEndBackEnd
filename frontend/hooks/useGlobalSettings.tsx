import { useSWR } from "@/hooks/useSWR";

export function useGlobalSettings() {
  const { data, ...rest } = useSWR("/settings/global");

  return {
    settings: data?.data,
    ...rest,
  };
}
