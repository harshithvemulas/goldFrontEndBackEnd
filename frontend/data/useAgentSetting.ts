import { useSWR } from "@/hooks/useSWR";

export function useAgentSettings() {
  const { data, error, isLoading } = useSWR("/agents/detail");

  return {
    agent: data?.data,
    isLoading,
    error,
  };
}
