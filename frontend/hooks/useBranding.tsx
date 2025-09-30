import { useGlobal } from "@/contexts/GlobalProvider";

export const useBranding = () => {
  const { branding } = useGlobal();

  return branding;
};
