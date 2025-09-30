import { useGlobal } from "@/contexts/GlobalProvider";

export const useApp = () => {
  const global = useGlobal();

  return {
    isExpanded: global.isExpanded,
    device: global.device,
    setIsExpanded: global.setIsExpanded,
  };
};
