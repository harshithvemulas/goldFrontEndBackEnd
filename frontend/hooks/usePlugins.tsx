import { useGlobal } from "@/contexts/GlobalProvider";

export const usePlugins = () => {
  const { googleAnalytics } = useGlobal();

  return {
    googleAnalytics,
  };
};
